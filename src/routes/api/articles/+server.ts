import { fail, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { userArticles } from '$lib/server/drizzle';

export const POST: RequestHandler = async ({ cookies, locals, request }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');
	if (!cookies.get('keyhash')) throw redirect(302, '/profile/key/unlock');
	const { content, iv } = Object.fromEntries(await request.formData());
	if (!content || !iv) throw fail(500, { message: 'invalid data' });
	const data = await db
		.insert(userArticles)
		.values({ author: session.user.userId, content: content.toString(), iv: iv.toString() });
	return json({ id: Number(data.lastInsertRowid!) });
};
