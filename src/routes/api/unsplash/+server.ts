import { env } from '$env/dynamic/private';
import { fail, json, type RequestHandler } from '@sveltejs/kit';
import { createApi } from 'unsplash-js';

export const GET: RequestHandler = async ({ url }) => {
	const { UNSPLASH_TOKEN } = env;
	if (!UNSPLASH_TOKEN) {
		throw fail(500, { message: 'could not find unsplash configuration' });
	}
	const client = createApi({ accessKey: UNSPLASH_TOKEN });
	const query = url.searchParams.get('query');
	const page = url.searchParams.has('page') ? parseInt(url.searchParams.get('page')) : 1;
	if (query) {
		const res = await client.search.getPhotos({ query, page });
		return json({ photos: res.response?.results || [] });
	} else {
		throw new Error('Malformed request');
	}
};
