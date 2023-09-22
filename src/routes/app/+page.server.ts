import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { userArticles } from '$lib/server/drizzle';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ cookies, locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');
	if (!cookies.get('keyhash')) throw redirect(302, '/profile/key/unlock');
	const articles = await db
		.select()
		.from(userArticles)
		.where(eq(userArticles.author, session.user.userId));

	return {
		articles,
		key: cookies.get('keyhash')!
	};
};
