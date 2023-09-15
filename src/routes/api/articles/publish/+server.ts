import { DevPlatform } from '$lib/articles/platforms/dev';
import { HashnodePlatform } from '$lib/articles/platforms/hashnode';
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
	const devPlatform = new DevPlatform();
	const hashnodePlatform = new HashnodePlatform();
	if (tokens.some((e) => e.key.split(':')[1] === devPlatform.getRequiredSettings()[0])) {
		await devPlatform
			.setSettings({ dev: tokens.find((e) => e.key.split(':')[1] === 'dev')!.value! })
			.publish({
				title: title.toString(),
				content: content.toString(),
				tags: [],
				published: published !== null ? Boolean(published) : false
			});
	}

	return json({ message: 'ok' });
};
