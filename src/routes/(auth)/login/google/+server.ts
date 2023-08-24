import { dev } from '$app/environment';
import { googleAuth } from '$lib/server/services/auth';

export const GET = async (event) => {
	const [url, state] = await googleAuth.getAuthorizationUrl();

	const plan = event.url.searchParams.get('plan');

	if (plan) {
		event.cookies.set('user_plan', plan);
	}

	// store state
	event.cookies.set('google_oauth_state', state, {
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
