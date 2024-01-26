import type { IArticle } from '$lib/articles/types';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
	const keyData = sessionStorage.getItem('magiedit:key');
	if (!keyData) throw redirect(302, '/profile/key/unlock');
	const keyBytes = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(keyData));
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
					const iv = new Uint8Array(e.iv.split(',').map((i) => parseInt(i)));
					const decryptedContent = await window.crypto.subtle.decrypt(
						{ name: 'AES-CBC', iv },
						key,
						buffer
					);
					return { content: new TextDecoder().decode(decryptedContent), id: e.id } as IArticle;
				} catch (error) {
					console.log(error.toString());
				}
			})
		)
	};
};

export const ssr = false;
