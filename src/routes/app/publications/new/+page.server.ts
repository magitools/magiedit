import { db } from '$lib/server/db';
import { userPublications } from '$lib/server/drizzle';
import type { PageServerLoad } from './$types';
import { type Actions, fail } from '@sveltejs/kit';
import { supportedPlatforms } from '$lib/articles/platforms/base';
import '$lib/articles/platforms';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw fail(500, { message: 'not connected' });
	}
	const platforms = supportedPlatforms;
	return {
		platforms:
			Array.from(platforms.values()).map((e) => ({
				platformName: new e().getPlatformName(),
				platformSettings: new e().getRequiredSettings(),
				platformId: e.name
			})) || []
	};
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const session = await locals.auth.validate();
		if (!session) {
			throw fail(500, { message: 'not connected' });
		}
		const formData = await request.formData();
		const { publisher_id, publisher_name, ...args } = Object.fromEntries(formData);
		console.log(publisher_id, publisher_name, args);
		await db.insert(userPublications).values({
			publisherName: publisher_id,
			publisherData: args,
			name: publisher_name,
			userId: session.user.userId
		});
		//TODO implement save logic
		return { message: 'ok' };
	}
};
