import type { IArticle } from '$lib/articles/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
	const keyBytes = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(data.key));
	const key = await window.crypto.subtle.importKey('raw', keyBytes, 'AES-CBC', false, ['decrypt']);
	console.log(key);
	return {
		articles: await Promise.all(
			data.articles.map(async (e) => {
				const buffer = new TextEncoder().encode(e.content);
				const decryptedContent = await window.crypto.subtle.decrypt(
					{ name: 'AES-CBC', iv: new Uint8Array(16) },
					key,
					buffer
				);
				return { content: new TextDecoder().decode(decryptedContent), id: e.id } as IArticle;
			})
		)
	};
};

export const ssr = false;
