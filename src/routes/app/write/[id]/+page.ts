import type { IArticle } from '$lib/articles/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
	const keyBytes = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(data.key));
	const key = await window.crypto.subtle.importKey('raw', keyBytes, 'AES-CBC', false, ['decrypt']);
	const buffer = new Uint8Array(
		atob(data.article.content)
			.split('')
			.map((c) => c.charCodeAt(0))
	);
	const iv = new Uint8Array(data.article.iv.split(',').map((e) => parseInt(e)));
	const decryptedContent = await window.crypto.subtle.decrypt({ name: 'AES-CBC', iv }, key, buffer);
	const decoded = new TextDecoder().decode(decryptedContent);
	const res = { ...data.article, content: decoded } as IArticle;
	return { article: res, key: data.key };
};

export const ssr = false;
