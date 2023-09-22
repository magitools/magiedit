import { db } from '$lib/server/db';
import { userArticles } from '$lib/server/drizzle';
import { fail, json, type RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

export const PUT: RequestHandler = async ({ locals, cookies, params, request }) => {
	const session = await locals.auth.validate();
	if (!session) throw fail(500, { message: 'not authorized' });
	const hashKey = cookies.get('keyhash');
	if (!hashKey) throw fail(500, { message: 'not authorized' });
	if (!(await bcrypt.compare(hashKey, session.user.keyHash)))
		throw fail(500, { message: 'not authorized' });
	const article = await db
		.select()
		.from(userArticles)
		.where(eq(userArticles.id, parseInt(params.id!)))
		.where(eq(userArticles.author, session.user.userId))
		.limit(1);
	if (article.length !== 1) throw fail(500, { message: 'article not found' });
	const { content } = Object.fromEntries(await request.formData());
	if (!content) throw fail(500, { message: 'invalid data format' });
	await db.update(userArticles).set({ content: content.toString() });
	return json({ message: 'saved' });
};
