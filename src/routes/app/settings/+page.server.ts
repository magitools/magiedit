import { db } from '$lib/server/db';
import { userPreferences } from '$lib/server/drizzle';
import { eq, like } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { redirect, type Actions, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw redirect(301, '/login');
	}
	const preferences = await db
		.select()
		.from(userPreferences)
		.where(like(userPreferences.key, `${session.user?.userId}:%`));
	return { preferences };
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const session = await locals.auth.validate();
		if (!session) {
			throw fail(500, { message: 'not connected' });
		}
		const formData = await request.formData();
		const data = Object.fromEntries(formData);
		Object.keys(data).forEach(async (e) => {
			const dbVersion = await db
				.select()
				.from(userPreferences)
				.where(eq(userPreferences.key, `${session.user?.userId}:${e}`));
			if (dbVersion.length === 0) {
				await db
					.insert(userPreferences)
					.values({ key: `${session.user?.userId}:${e}`, value: data[e].toString() });
			} else {
				await db
					.update(userPreferences)
					.set({ value: data[e].toString() })
					.where(eq(userPreferences.id, dbVersion[0].id));
			}
		});
		return { message: 'ok' };
	}
};
