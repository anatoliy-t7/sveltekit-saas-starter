// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
/// <reference types="lucia" />
declare global {
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = {
			email: string;
		};
		type DatabaseSessionAttributes = {};
	}

	namespace App {
		// interface Error {}
		interface Locals {
			auth: import('lucia').AuthRequest;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
