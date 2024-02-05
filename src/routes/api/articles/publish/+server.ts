import { supportedPlatforms } from '$lib/articles/platforms/base';
import '$lib/articles/platforms';
import { db } from '$lib/server/db';
import { userArticles, userPublications } from '$lib/server/drizzle';
import { fail, json, type RequestHandler } from '@sveltejs/kit';
import { and, eq, inArray } from 'drizzle-orm';
import fm from 'front-matter';
import { env } from '$env/dynamic/private';
import { LogSnag } from '@logsnag/node';
import { decrypt } from '$lib/server/article';
import { decode } from '$lib/server/cookie';

//TODO parallelize posts
export const POST: RequestHandler = async ({ locals, request, cookies }) => {
	const session = await locals.auth.validate();
	const { LOGSNAG_PROJECT, LOGSNAG_TOKEN } = env;
	if (!session) {
		throw fail(500, { message: 'not authenticad' });
	}
	const key = cookies.get('magiedit:key', { decode: decode });
	const { id, publishers: publisherIds } = Object.fromEntries(await request.formData());
	if (!id || key === undefined || !publisherIds) {
		throw fail(500, { message: 'invalid data' });
	}
	const article = await db
		.select()
		.from(userArticles)
		.where(
			and(
				eq(userArticles.id, parseInt(id.toString())),
				eq(userArticles.author, session.user.userId)
			)
		);
	const content = await decrypt(article[0].content, article[0].iv, key);
	const frontMatter = fm(content.toString()).attributes as Record<string, any>;
	const res = new Map<string, 'ok' | 'ko'>();
	for (const publisher of await db
		.select()
		.from(userPublications)
		.where(
			and(
				eq(userPublications.userId, session.user.userId),
				inArray(
					userPublications.id,
					publisherIds
						.toString()
						.split(',')
						.map((e) => Number(e))
				)
			)
		)) {
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
