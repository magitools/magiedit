import { db } from '$lib/storage/db';
import { fail } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const id = params['id'];
	if (!id) {
		throw fail(500, { message: 'could not find id in url' });
	}
	await db.articles.delete(id);
	window.location.href = '/';
};

export const ssr = false;
export const prerender = false;
