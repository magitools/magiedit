import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import bcrypt from 'bcryptjs';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');
	if (!session.user.keyHash) throw redirect(302, '/profile/key/create');
};

export const actions: Actions = {
	default: async ({ locals, cookies, request }) => {
		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/login');
		const { passkey } = Object.fromEntries(await request.formData());
		if (!passkey) throw fail(500, { message: 'invalid data' });
		if (!(await bcrypt.compare(passkey.toString(), session.user.keyHash)))
			return fail(500, { message: 'invalid credentials' });
		cookies.set('keyhash', passkey.toString(), { path: '/' });
		throw redirect(302, '/app');
	}
};
