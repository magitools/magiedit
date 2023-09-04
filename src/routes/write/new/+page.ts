import { db } from '$lib/storage/db';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const id = await db.articles.add({ tags: [], title: Date.now().toString() });
	throw redirect(302, `/write/${id}`);
};
