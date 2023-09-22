import { redirect, type Actions, fail } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/lucia';
import { db } from '$lib/server/db';
import { user, userImages } from '$lib/server/drizzle';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');
	const savedImages = await db
		.select()
		.from(userImages)
		.where(eq(userImages.userId, session.user.userId));
	return {
		userId: session.user.userId,
		username: session.user.username,
		email: session.user.email,
		aiCredits: session.user.aiCredits,
		savedImages
	};
};

export const actions: Actions = {
	recharge: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(401);
		await db
			.update(user)
			.set({ aiCredits: (session?.user?.aiCredits ?? 0) + 1 })
			.where(eq(user.id, session?.user?.userId));
		return JSON.stringify({ status: 'ok' });
	},
	logout: async ({ locals, cookies }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(401);
		await auth.invalidateSession(session.sessionId); // invalidate session
		locals.auth.setSession(null); // remove cookie
		cookies.delete('keyhash');
		throw redirect(302, '/login'); // redirect to login page
	}
};
