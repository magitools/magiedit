import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { userArticles, userPublications } from '$lib/server/drizzle';
import { eq } from 'drizzle-orm';
import { decrypt } from '$lib/server/article';
import { decode } from '$lib/server/cookie';

export const load: PageServerLoad = async ({ locals, cookies }) => {
	const { user } = locals;
	if (!user) redirect(302, '/login');
	const cookie = cookies.get('magiedit:key', { decode: decode });
	if (cookie === undefined) {
		redirect(302, locals.user?.keyHash ? '/profile/key/unlock' : '/profile/key/create');
	}
	const articles = await db.select().from(userArticles).where(eq(userArticles.author, user.id));
	const publications = await db
		.select()
		.from(userPublications)
		.where(eq(userPublications.userId, user.id));
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
