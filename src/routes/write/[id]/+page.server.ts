import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const query = await (await request.formData()).get('search');
		console.log(query);
		const data = await (
			await fetch(`/api/unsplash?search=${query}`, {
				headers: {
					accept: 'application/json'
				}
			})
		).json();
		return { photos: data.photos };
	}
};
