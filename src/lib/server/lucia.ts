import { dev } from '$app/environment';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { github } from '@lucia-auth/oauth/providers';
import { libsql } from '@lucia-auth/adapter-sqlite';
import { client } from './db';

export const auth = lucia({
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	adapter: libsql(client, {
		user: 'user',
		key: 'user_key',
		session: 'user_session'
	}),
	getUserAttributes: (data) => {
		return {
			username: data.username,
			email: data.email
		};
	}
});

export const githubAuth = github(auth, {
	clientId: GITHUB_CLIENT_ID,
	clientSecret: GITHUB_CLIENT_SECRET
});

export type Auth = typeof auth;
