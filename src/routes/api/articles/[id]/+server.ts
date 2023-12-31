import { db } from '$lib/server/db';
import { userArticles } from '$lib/server/drizzle';
import { fail, json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const PUT: RequestHandler = async ({ locals, params, request }) => {
	const session = await locals.auth.validate();
	if (!session) throw fail(500, { message: 'invalid session' });
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
	const session = await locals.auth.validate();
	if (!session) throw fail(500, { message: 'invalid session' });
	const article = await db
		.select()
		.from(userArticles)
		.where(eq(userArticles.id, parseInt(params.id!)));
	if (article.length !== 1) throw fail(500, { message: 'article not found' });
	if (article[0].author !== session.user.userId)
		throw fail(500, { message: 'invalid permissions' });
	await db.delete(userArticles).where(eq(userArticles.id, parseInt(params.id!)));
	return json({ message: 'deleted' });
};
