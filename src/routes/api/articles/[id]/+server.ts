import { db } from '$lib/server/db';
import { userArticles } from '$lib/server/drizzle';
import { fail, json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { LogSnag } from '@logsnag/node';

export const PUT: RequestHandler = async ({ locals, params, request }) => {
	const { user } = locals;
	if (!user) throw fail(500, { message: 'invalid session' });
	const article = await db
		.select()
		.from(userArticles)
		.where(eq(userArticles.id, parseInt(params.id!)));
	if (article.length !== 1) throw fail(500, { message: 'article not found' });
	const { content } = Object.fromEntries(await request.formData());
	if (!content) throw fail(500, { message: 'invalid data format' });
	await db
		.update(userArticles)
		.set({ content: content.toString() })
		.where(eq(userArticles.id, article[0].id));
	return json({ message: 'saved' });
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
	const { user } = locals;
	if (!user) throw fail(500, { message: 'invalid session' });
	const article = await db
		.select()
		.from(userArticles)
		.where(eq(userArticles.id, parseInt(params.id!)));
	if (article.length !== 1) throw fail(500, { message: 'article not found' });
	if (article[0].author !== user.id) throw fail(500, { message: 'invalid permissions' });
	await db.delete(userArticles).where(eq(userArticles.id, parseInt(params.id!)));
	const { LOGSNAG_PROJECT, LOGSNAG_TOKEN } = env;
	if (LOGSNAG_PROJECT && LOGSNAG_TOKEN) {
		const logsnag = new LogSnag({ token: LOGSNAG_TOKEN, project: LOGSNAG_PROJECT });
		await logsnag.track({
			channel: 'articles',
			event: 'Deleted Article',
			user_id: user.id
		});
	}
	return json({ message: 'deleted' });
};
