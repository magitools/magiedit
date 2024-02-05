import { dev } from '$app/environment';
import { githubAuth } from '$lib/server/lucia.js';
import { generateState } from 'arctic';
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies }) => {
	const state = generateState();
	const url = await githubAuth.createAuthorizationURL(state);
	cookies.set('github_oauth_state', state, {
		httpOnly: true,
		secure: !dev,
		path: '/',
		sameSite: 'lax',
		maxAge: 60 * 60
	});
	redirect(302, url.toString());
};
