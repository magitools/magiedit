import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { userArticles, userPublications } from '$lib/server/drizzle';
import { eq } from 'drizzle-orm';
import { decrypt } from '$lib/server/article';
import { decode } from '$lib/server/cookie';

export const load: PageServerLoad = async ({ locals, cookies }) => {
	const session = await locals.auth.validate();
	if (!session) redirect(302, '/login');
	const cookie = cookies.get('magiedit:key', { decode: decode });
	if (cookie === undefined) {
		redirect(302, session.user.keyHash ? '/profile/key/unlock' : '/profile/key/create');
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
				content: await decrypt(e.content, e.iv, cookie)
			}))
		),
		publications: publications || []
	};
};
