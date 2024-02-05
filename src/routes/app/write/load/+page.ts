import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const keyData = sessionStorage.getItem('magiedit:key');
	if (!keyData) redirect(302, '/profile/key/unlock');
};

export const ssr = false;
