import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { userArticles } from '$lib/server/drizzle';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');
	const articles = await db
		.select()
		.from(userArticles)
		.where(eq(userArticles.author, session.user.userId));

	return {
		articles
	};
};
