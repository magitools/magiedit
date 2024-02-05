import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals;
	if (!user) redirect(302, '/login');
	if (user.keyHash) redirect(302, '/app');
	return {
		userId: user.id,
		username: user.username,
		email: user.email,
		aiCredits: user.aiCredits,
		keyHash: user.keyHash
	};
};
