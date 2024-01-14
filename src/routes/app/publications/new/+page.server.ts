import { db } from '$lib/server/db';
import { userPublications } from '$lib/server/drizzle';
import { eq, like } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { redirect, type Actions, fail } from '@sveltejs/kit';
import { supportedPlatforms } from '$lib/articles/platforms/base';
import PlatformList from '$lib/articles/platforms';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw fail(500, { message: 'not connected' });
	}
	const platforms = supportedPlatforms;
	return {
		platforms:
			platforms.map((e) => ({
				platformName: new e().getPlatformName(),
				platformSettings: new e().getRequiredSettings(),
				platformId: e.name
			})) ?? []
	};
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const session = await locals.auth.validate();
		if (!session) {
			throw fail(500, { message: 'not connected' });
		}
		const formData = await request.formData();
		const data = Object.fromEntries(formData);
		//TODO implement save logic
		return { message: 'ok' };
	}
};
