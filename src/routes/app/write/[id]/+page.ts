import type { IArticle } from '$lib/articles/types';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
	const keyData = sessionStorage.getItem('magiedit:key');
	if (!keyData) throw redirect(302, '/profile/key/unlock');
	const keyBytes = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(keyData));
	const key = await window.crypto.subtle.importKey('raw', keyBytes, 'AES-CBC', false, ['decrypt']);
	console.log('Created key');
	const buffer = new Uint8Array(
		atob(data.article.content)
			.split('')
			.map((c) => c.charCodeAt(0))
	);
	const iv = new Uint8Array(data.article.iv.split(',').map((e) => parseInt(e)));
	console.log('got the iv');
	const decryptedContent = await window.crypto.subtle.decrypt({ name: 'AES-CBC', iv }, key, buffer);
	console.log('decrypted');
	const decoded = new TextDecoder().decode(decryptedContent);
	const res = { ...data.article, content: decoded } as IArticle;
	return { article: res };
};

export const ssr = false;
