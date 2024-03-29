import { encode } from '$lib/server/cookie';
import { fail, json, redirect, type RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';

export const POST: RequestHandler = async ({ locals, request, cookies }) => {
	const { user } = locals;
	if (!user) redirect(302, '/login');
	const { passkey } = Object.fromEntries(await request.formData());
	if (!passkey) throw fail(500, { message: 'invalid data' });
	if (!(await bcrypt.compare(passkey.toString(), user.keyHash)))
		throw fail(500, { message: 'invalid credentials' });
	cookies.set('magiedit:key', passkey.toString(), { path: '/', encode: encode });
	return json({ message: 'ok' });
};
