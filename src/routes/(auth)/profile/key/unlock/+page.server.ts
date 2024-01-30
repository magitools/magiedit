import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) redirect(302, '/login');
	if (!session.user.keyHash) redirect(302, '/profile/key/create');
};
