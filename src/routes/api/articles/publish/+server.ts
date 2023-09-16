import { supportedPlatforms } from '$lib/articles/platforms/base';
import '$lib/articles/platforms';
import { db } from '$lib/server/db';
import { userPreferences } from '$lib/server/drizzle';
import { fail, json, type RequestHandler } from '@sveltejs/kit';
import { like } from 'drizzle-orm';

export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw fail(500, { message: 'not authenticad' });
	}
	const { content, title, published } = Object.fromEntries(await request.formData());
	if (!content) {
		throw fail(500, { message: 'invalid data' });
	}
	const tokens = await db
		.select()
		.from(userPreferences)
		.where(like(userPreferences.key, `${session?.user?.userId}:%`));
	if (!tokens) {
		return json({ message: 'no publishing outlets provided' });
	}
	const res = new Map<string, 'ok' | 'ko'>();
	for (const platform of supportedPlatforms) {
		try {
			await new platform().setSettings(tokens).publish({
				content: content.toString(),
				title: title.toString(),
				published: Boolean(published)
			});
			res.set(new platform().getPlatformName(), 'ok');
		} catch (error) {
			res.set(new platform().getPlatformName(), 'ko');
		}
	}
	return json({
		message: 'finished',
		status: Array.from(res).map(([key, val]) => `${key}: ${val}`)
	});
};
