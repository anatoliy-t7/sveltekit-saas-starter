import { auth } from '$lib/server/lucia';

export const load = async (event) => {
	const authRequest = auth.handleRequest(event);
	const session = await authRequest.validate();

	return {
		user: session?.user
	};
};
