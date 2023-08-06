import { auth } from '$lib/server/lucia';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);
	return await resolve(event);
};

export const handleError = ({ error, event }) => {
	console.error(error);
	return {
		message: "An unexpected error occurred. We're working on it."
	};
};
