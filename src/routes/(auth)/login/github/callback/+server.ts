import { db } from '$lib/server/db.js';
import { user } from '$lib/server/drizzle.js';
import { auth, githubAuth } from '$lib/server/lucia.js';
import { isRedirect, redirect } from '@sveltejs/kit';
import { OAuth2RequestError } from 'arctic';

import { eq } from 'drizzle-orm';
import { generateId } from 'lucia';

export const GET = async ({ url, cookies }) => {
	const storedState = cookies.get('github_oauth_state');
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');
	// validate state
	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400
		});
	}
	try {
		const tokens = await githubAuth.validateAuthorizationCode(code);
		const githubUserResponse = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const githubUser = await githubUserResponse.json();
		const existingUser = await db.select().from(user).where(eq(user.githubId, githubUser.id));
		if (existingUser.length === 1) {
			const session = await auth.createSession(existingUser[0].id, {});
			const sessionCookie = auth.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '/',
				...sessionCookie.attributes
			});
			redirect(
				302,
				existingUser[0].keyHash !== null ? '/profile/key/unlock' : '/profile/key/create'
			);
		} else {
			const userId = generateId(15);
			await db.insert(user).values({
				id: userId,
				githubId: githubUser.id,
				username: githubUser.login,
				email: githubUser.email
			});
			redirect(302, '/profile/key/create');
		}
	} catch (e) {
		if (e instanceof OAuth2RequestError) {
			// invalid code
			return new Response(null, {
				status: 400
			});
		}
		if (isRedirect(e)) {
			console.log(e);
			redirect(e.status, e.location);
		}
		return new Response(null, {
			status: 500
		});
	}
};
