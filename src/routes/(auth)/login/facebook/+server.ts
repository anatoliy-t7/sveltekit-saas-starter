import { dev } from '$app/environment';
import { facebookAuth } from '$lib/server/services/auth';

export const GET = async ({ cookies }) => {
	const [url, state] = await facebookAuth.getAuthorizationUrl();
	// store state
	cookies.set('facebook_oauth_state', state, {
		httpOnly: true,
		secure: !dev,
		path: '/',
		maxAge: 60 * 60
	});
	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString()
		}
	});
};
