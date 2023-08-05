import { auth } from '$lib/server/lucia';
import { redirect } from '@sveltejs/kit';

export const GET = async (event) => {
	const authRequest = auth.handleRequest(event);
	const session = await authRequest.validate();
	if (!session) {
		throw redirect(302, '/');
	}

	await auth.invalidateSession(session.sessionId);
	authRequest.setSession(null);

	throw redirect(302, '/');
};
