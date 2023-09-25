import { fail, json, redirect, type RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';

export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');
	const { passkey } = Object.fromEntries(await request.formData());
	if (!passkey) throw fail(500, { message: 'invalid data' });
	if (!(await bcrypt.compare(passkey.toString(), session.user.keyHash)))
		throw fail(500, { message: 'invalid credentials' });
	return json({ message: 'ok' });
};
