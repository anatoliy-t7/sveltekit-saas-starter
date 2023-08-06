import { PUBLIC_DOMAIN } from '$env/static/public';
import { auth } from '$lib/server/lucia';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const handleAuth: Handle = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);
	const response = await resolve(event);
	return response;
};

const handleMiddleware: Handle = async ({ resolve, event }) => {
	const authRequest = auth.handleRequest(event);
	const session = await authRequest.validate();

	if (event.url.pathname.startsWith('/account') && !session?.user) {
		throw redirect(303, '/login');
	}

	if (event.url.pathname.startsWith('/admin') && session?.user?.role !== 'admin') {
		throw redirect(303, '/login');
	}

	if (event.url.pathname.startsWith('/api')) {
		// Required for CORS to work
		if (event.request.method === 'OPTIONS') {
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
					'Access-Control-Allow-Origin': PUBLIC_DOMAIN,
					'Access-Control-Allow-Headers': PUBLIC_DOMAIN
				}
			});
		}
	}

	const response = await resolve(event);
	if (event.url.pathname.startsWith('/api')) {
		response.headers.append('Access-Control-Allow-Origin', PUBLIC_DOMAIN);
	}

	return response;
};

export const handle = sequence(handleAuth, handleMiddleware);

export const handleError = ({ error, event }) => {
	console.error(error);
	return {
		message: "An unexpected error occurred. We're working on it."
	};
};
