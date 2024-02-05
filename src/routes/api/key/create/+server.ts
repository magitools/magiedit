import { encode } from '$lib/server/cookie';
import { db } from '$lib/server/db';
import { user } from '$lib/server/drizzle';
import { fail, json, redirect, type RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ locals, request, cookies }) => {
	const { user: userSession } = await locals;
	if (!userSession) redirect(302, '/login');
	const { passkey } = Object.fromEntries(await request.formData());
	if (!passkey) throw fail(500, { message: 'invalid data' });
	await db
		.update(user)
		.set({ keyHash: await bcrypt.hash(passkey.toString(), 12) })
		.where(eq(user.id, userSession.id));
	//TODO set transform string
	cookies.set('magiedit:key', passkey.toString(), { path: '/', encode: encode });
	return json({ message: 'ok' });
};
