import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { userArticles } from '$lib/server/drizzle';
import crypto from 'crypto';
export const load: PageServerLoad = async ({ locals, cookies }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');
	if (!cookies.get('keyhash')) throw redirect(302, '/profile/key/unlock');

	const keyBytes = await crypto.subtle.digest(
		'SHA-256',
		new TextEncoder().encode(cookies.get('keyhash')!)
	);
	const key = await crypto.subtle.importKey('raw', keyBytes, 'AES-CBC', false, ['encrypt']);
	const iv = new Uint8Array(16);
	const encodedContent = await crypto.subtle.encrypt(
		{ name: 'AES-CBC', iv },
		key,
		new TextEncoder().encode('write here')
	);
	const base64 = btoa(String.fromCharCode(...new Uint8Array(encodedContent)));
	const res = await db
		.insert(userArticles)
		.values({ author: session.user.userId, content: base64, iv: iv.toString() });
	console.log(res);
	throw redirect(302, `/app/write/${res.lastInsertRowid}`);
};
