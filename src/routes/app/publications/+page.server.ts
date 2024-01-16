import { db } from '$lib/server/db';
import { userPublications } from '$lib/server/drizzle';
import { and, eq } from 'drizzle-orm';
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

export const actions: Actions = {
	deletePublication: async (event) => {
		const session = await event.locals.auth.validate();
		if (!session || event.url.searchParams.get('publicationId') == null) {
			throw redirect(301, '/login');
		}
		const publication = await db
			.select()
			.from(userPublications)
			.where(
				and(
					eq(userPublications.userId, session.user?.userId),
					eq(userPublications.id, parseInt(event.url.searchParams.get('publicationId')!))
				)
			);
		if (publication.length === 0) {
			throw fail(500, { message: 'invalid data' });
		}
		await db
			.delete(userPublications)
			.where(eq(userPublications.id, parseInt(event.url.searchParams.get('publicationId')!)));
		return {
			message: 'ok'
		};
	}
};
