import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { userPublications } from '$lib/server/drizzle';
import { and, eq } from 'drizzle-orm';
import '$lib/articles/platforms';
import { supportedPlatforms } from '$lib/articles/platforms/base';

export const load: PageServerLoad = async ({ locals, params }) => {
	const session = await locals.auth.validate();
	if (!session) {
		redirect(301, '/login');
	}
	const publication = await db
		.select()
		.from(userPublications)
		.where(
			and(
				eq(userPublications.id, parseInt(params.id)),
				eq(userPublications.userId, session.user.userId)
			)
		);
	if (publication.length === 0) {
		redirect(301, '/app/publications');
	}
	const platform = Array.from(supportedPlatforms.values()).find(
		(e) => e.name === publication[0].publisherName
	);
	return {
		publication: publication[0],
		labels: new platform().getRequiredSettings().map((e) => e.label)
	};
};

export const actions: Actions = {
	default: async ({ locals, params, request }) => {
		const session = await locals.auth.validate();
		if (!session) {
			redirect(301, '/login');
		}
		const publication = await db
			.select()
			.from(userPublications)
			.where(
				and(
					eq(userPublications.id, parseInt(params.id)),
					eq(userPublications.userId, session.user.userId)
				)
			);
		if (publication.length === 0) {
			redirect(301, '/app/publications');
		}
		const { name, ...data } = Object.fromEntries(await request.formData());
		await db
			.update(userPublications)
			.set({ name: name.toString(), publisherData: data })
			.where(eq(userPublications.id, parseInt(params.id)));
	}
};
