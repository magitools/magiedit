import { supportedPlatforms } from '$lib/articles/platforms/base';
import '$lib/articles/platforms';
import { db } from '$lib/server/db';
import { userPublications } from '$lib/server/drizzle';
import { fail, json, type RequestHandler } from '@sveltejs/kit';
import { eq, like } from 'drizzle-orm';
import fm from 'front-matter';

export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.auth.validate();
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
			const platform = supportedPlatforms.find((e) => e.name === publisher.publisherName);
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
	return json({
		message: 'finished',
		status: Array.from(res).map(([key, val]) => `${key}: ${val}`)
	});
};
