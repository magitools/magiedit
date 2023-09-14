import { db } from '$lib/server/db';
import { userImages } from '$lib/server/drizzle';
import { fail, json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw fail(401, { message: 'unauthorized' });
	}
	const images = await db
		.select()
		.from(userImages)
		.where(eq(userImages.userId, session.user.userId));
	return json({ images });
};
