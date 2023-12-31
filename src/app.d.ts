// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

/// <reference types="unplugin-icons/types/svelte" />
declare namespace App {
	interface Locals {
		auth: import('lucia').AuthRequest;
	}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}

/// <reference types="lucia" />
declare global {
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = {
			username: string;
			email: string;
			aiCredits: number;
		};
		type DatabaseSessionAttributes = object;
	}
}
