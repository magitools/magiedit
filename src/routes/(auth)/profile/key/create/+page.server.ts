import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { user } from '$lib/server/drizzle';
import bcrypt from 'bcryptjs';

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

export const actions: Actions = {
	default: async ({ locals, request, cookies }) => {
		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/login');
		const { passkey } = Object.fromEntries(await request.formData());
		if (!passkey) throw fail(500, { message: 'invalid data' });
		await db.update(user).set({ keyHash: await bcrypt.hash(passkey.toString(), 12) });
		await cookies.set('keyhash', passkey.toString(), { path: '/' });
		throw redirect(302, '/app');
	}
};
