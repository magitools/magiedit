import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { userArticles, userPublications } from '$lib/server/drizzle';
import { eq } from 'drizzle-orm';
import { decrypt } from '$lib/server/article';

export const load: PageServerLoad = async ({ locals, cookies }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');
	if (!cookies.get('magiedit:key')) {
		throw redirect(302, session.user.keyHash ? '/profile/key/unlock' : '/profile/key/create');
	}
	const articles = await db
		.select()
		.from(userArticles)
		.where(eq(userArticles.author, session.user.userId));
	const publications = await db
		.select()
		.from(userPublications)
		.where(eq(userPublications.userId, session.user.userId));
	return {
		articles: await Promise.all(
			articles.map(async (e) => ({
				id: e.id,
				content: await decrypt(e.content, e.iv, cookies.get('magiedit:key'))
			}))
		),
		publications: publications || []
	};
};
