import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');
	if (session.user.keyHash) throw redirect(302, '/app');
	return {
		userId: session.user.userId,
		username: session.user.username,
		email: session.user.email,
		aiCredits: session.user.aiCredits,
		keyHash: session.user.keyHash
	};
};
