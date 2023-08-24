// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
/// <reference types="lucia" />
declare global {
	namespace Lucia {
		type Auth = import('$lib/server/services/auth').Auth;
		type DatabaseUserAttributes = {
			id: string?;
			name: string?;
			email: string;
			email_verified: boolean;
			role: string;
			avatar: string?;
			active: boolean?;
			plan_id: number?;
		};
		type DatabaseSessionAttributes = {};
	}

	namespace App {
		// interface Error {}
		interface Locals {
			auth: import('lucia').AuthRequest;
			plan: string?;
		}
		// interface PageData {}
		// interface Platform {}
	}

	interface Plan {
		id: number?;
		handle: string;
		name: string;
		price: number;
		price_id: number;
	}
}

export {};
