// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

/// <reference types="unplugin-icons/types/svelte" />
declare namespace App {
	interface Locals {
		user: import('lucia').User | null;
		session: import('lucia').Session | null;
	}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}
