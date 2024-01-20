import { env } from '$env/dynamic/private';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { fail, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const { GIPHY_TOKEN } = env;
	if (!GIPHY_TOKEN) {
		throw fail(500, { message: 'could not find giphy configuration' });
	}
	const client = new GiphyFetch(GIPHY_TOKEN);
	const query = url.searchParams.get('query');
	const pageParam = url.searchParams.get('page');
	const page = pageParam ? parseInt(pageParam) : 0;
	if (!query) {
		throw 'Invalid url format';
	}
	const results = await client.search(query, {
		type: 'gifs',
		offset: page * 25
	});
	return json({ data: results.data });
};
