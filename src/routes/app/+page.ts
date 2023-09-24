import type { IArticle } from '$lib/articles/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
	const keyBytes = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(data.key));
	const key = await window.crypto.subtle.importKey('raw', keyBytes, 'AES-CBC', false, ['decrypt']);
	return {
		articles: await Promise.all(
			data.articles.map(async (e) => {
				const buffer = new Uint8Array(
					atob(e.content)
						.split('')
						.map((c) => c.charCodeAt(0))
				);
				try {
					const decryptedContent = await window.crypto.subtle.decrypt(
						{ name: 'AES-CBC', iv: new Uint8Array(16) },
						key,
						buffer
					);
					console.log(decryptedContent);
					return { content: new TextDecoder().decode(decryptedContent), id: e.id } as IArticle;
				} catch (error) {
					console.log(error.toString());
				}
			})
		)
	};
};

export const ssr = false;
