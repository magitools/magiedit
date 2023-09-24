import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, cookies }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');
	if (!cookies.get('keyhash')) throw redirect(302, '/profile/key/unlock');

	return {
		key: cookies.get('keyhash')!
	};
};
