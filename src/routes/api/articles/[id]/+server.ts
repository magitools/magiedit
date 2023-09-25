import { db } from '$lib/server/db';
import { userArticles } from '$lib/server/drizzle';
import { fail, json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const PUT: RequestHandler = async ({ locals, params, request }) => {
	const session = await locals.auth.validate();
	const article = await db
		.select()
		.from(userArticles)
		.where(eq(userArticles.id, parseInt(params.id!)))
		.where(eq(userArticles.author, session.user.userId))
		.limit(1);
	if (article.length !== 1) throw fail(500, { message: 'article not found' });
	const { content } = Object.fromEntries(await request.formData());
	if (!content) throw fail(500, { message: 'invalid data format' });
	const res = await db
		.update(userArticles)
		.set({ content: content.toString() })
		.where(eq(userArticles.id, article[0].id));
	console.log(res);
	return json({ message: 'saved' });
};
