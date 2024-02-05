import { dev } from '$app/environment';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';
import { Lucia } from 'lucia';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { GitHub } from 'arctic';

import { db } from './db';
import { user, userSession } from './drizzle';

const adapter = new DrizzleSQLiteAdapter(db, userSession, user);

export const auth = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			username: attributes.username,
			email: attributes.email,
			aiCredits: attributes.ai_credits,
			keyHash: attributes.keyHash
		};
	}
});

interface DatabaseUserAttributes {
	username: string;
	email: string;
	ai_credits: number;
	keyHash: string;
}

declare module 'lucia' {
	interface Register {
		Lucia: typeof auth;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

export const githubAuth = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET);
