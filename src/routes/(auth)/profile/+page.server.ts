import { redirect, type Actions, fail } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/lucia';
import { db } from '$lib/server/db';
import { user, userImages } from '$lib/server/drizzle';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const { user } = locals;
	if (!user) redirect(302, '/login');
	const parentData = await parent();

	const savedImages = await db.select().from(userImages).where(eq(userImages.userId, user.id));
	return {
		userId: user.id,
		username: user.username,
		email: user.email,
		aiCredits: user.aiCredits,
		savedImages: parentData.enabledOptions?.storage ? savedImages : []
	};
};

export const actions: Actions = {
	recharge: async ({ locals }) => {
		const { user: userSession } = locals;
		if (!userSession) return fail(401);
		await db
			.update(user)
			.set({ aiCredits: (userSession?.aiCredits ?? 0) + 1 })
			.where(eq(user.id, userSession?.id));
		return JSON.stringify({ status: 'ok' });
	},
	logout: async ({ locals, cookies }) => {
		const { session } = locals;
		if (!session) return fail(401);
		await auth.invalidateSession(session.id); // invalidate session
		const sessionCookie = auth.createBlankSessionCookie();
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '/',
			...sessionCookie.attributes
		}); // remove cookie
		redirect(302, '/login'); // redirect to login page
	}
};
