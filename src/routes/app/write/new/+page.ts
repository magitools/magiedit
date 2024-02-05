import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { generateIv } from '$lib/articles/crypto';

export const load: PageLoad = async () => {
	const keyData = sessionStorage.getItem('magiedit:key');
	if (!keyData) redirect(302, '/profile/key/unlock');
	const keyBytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(keyData));
	const key = await crypto.subtle.importKey('raw', keyBytes, 'AES-CBC', false, ['encrypt']);
	const iv = generateIv();
	const encodedContent = await crypto.subtle.encrypt(
		{ name: 'AES-CBC', iv },
		key,
		new TextEncoder().encode('write here')
	);
	const base64 = btoa(String.fromCharCode(...new Uint8Array(encodedContent)));
	const data = new FormData();
	data.append('content', base64);
	data.append('iv', iv.toString());
	const res = await fetch('/api/articles', {
		method: 'POST',
		body: data
	});
	if (!res.ok) {
		console.log('error');
		return {};
	}
	const result = await res.json();
	redirect(302, `/app/write/${result.id}`);
};

export const ssr = false;
