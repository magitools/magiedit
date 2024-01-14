import { db } from '$lib/server/db';
import { userPublications } from '$lib/server/drizzle';
import { eq, like } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { redirect, type Actions, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw redirect(301, '/login');
	}
	const publications = await db
		.select()
		.from(userPublications)
		.where(eq(userPublications.userId, session.user?.userId));
	return { publications };
};
