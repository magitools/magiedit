import { supportedPlatforms } from '$lib/articles/platforms/base';
import '$lib/articles/platforms';
import { db } from '$lib/server/db';
import { userPublications } from '$lib/server/drizzle';
import { fail, json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import fm from 'front-matter';
import { env } from '$env/dynamic/private';
import { LogSnag } from '@logsnag/node';

//TODO parallelize posts
export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.auth.validate();
	const { LOGSNAG_PROJECT, LOGSNAG_TOKEN } = env;
	if (!session) {
		throw fail(500, { message: 'not authenticad' });
	}
	const { content } = Object.fromEntries(await request.formData());
	if (!content) {
		throw fail(500, { message: 'invalid data' });
	}
	const frontMatter = fm(content.toString()).attributes as Record<string, any>;
	const res = new Map<string, 'ok' | 'ko'>();
	for (const publisher of await db
		.select()
		.from(userPublications)
		.where(eq(userPublications.userId, session.user.userId))) {
		try {
			const platform = Array.from(supportedPlatforms.values()).find(
				(e) => e.name === publisher.publisherName
			);
			if (!platform) continue;
			await new platform()
				.setFrontmatter(frontMatter)
				.setSettings(publisher.publisherData)
				.publish(content.toString());
			res.set(publisher.name, 'ok');
		} catch (error) {
			console.log(error);
			res.set(publisher.name, 'ko');
		}
	}
	if (LOGSNAG_PROJECT && LOGSNAG_TOKEN) {
		const logsnag = new LogSnag({ token: LOGSNAG_TOKEN, project: LOGSNAG_PROJECT });
		await logsnag.track({
			channel: 'articles',
			event: 'Published Article',
			user_id: session.user.userId,
			tags: { platforms: res.size }
		});
	}
	return json({
		message: 'finished',
		status: Array.from(res).map(([key, val]) => `${key}: ${val}`)
	});
};
