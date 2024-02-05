import { fail, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { userArticles } from '$lib/server/drizzle';
import { env } from '$env/dynamic/private';
import { LogSnag } from '@logsnag/node';

export const POST: RequestHandler = async ({ locals, request }) => {
	const { user } = locals;
	if (!user) redirect(302, '/login');
	const { LOGSNAG_PROJECT, LOGSNAG_TOKEN } = env;
	const { content, iv } = Object.fromEntries(await request.formData());
	if (!content || !iv) throw fail(500, { message: 'invalid data' });
	const data = await db
		.insert(userArticles)
		.values({ author: user.id, content: content.toString(), iv: iv.toString() });
	if (LOGSNAG_PROJECT && LOGSNAG_TOKEN) {
		const logsnag = new LogSnag({ token: LOGSNAG_TOKEN, project: LOGSNAG_PROJECT });
		await logsnag.track({
			channel: 'articles',
			event: 'New Article',
			user_id: user.id
		});
	}
	return json({ id: Number(data.lastInsertRowid!) });
};
