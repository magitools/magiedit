import { db } from '$lib/server/db';
import { user } from '$lib/server/drizzle';
import { fail, json, redirect, type RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';

export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');
	const { passkey } = Object.fromEntries(await request.formData());
	if (!passkey) throw fail(500, { message: 'invalid data' });
	await db.update(user).set({ keyHash: await bcrypt.hash(passkey.toString(), 12) });
	return json({ message: 'ok' });
};
