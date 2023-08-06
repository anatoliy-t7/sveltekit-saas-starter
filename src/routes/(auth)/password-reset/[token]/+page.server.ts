import { auth } from '$lib/server/lucia';
import { validatePasswordResetToken } from '$lib/server/token';
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
	default: async (event) => {
		const authRequest = auth.handleRequest(event);
		const formData = await event.request.formData();
		const password = formData.get('new-password');
		if (password instanceof File || password === null || password.length < 8) {
			return fail(400, {
				message: 'Invalid password'
			});
		}
		try {
			const userId = await validatePasswordResetToken(event.params.token ?? '');
			let user = await auth.getUser(userId);

			await auth.invalidateAllUserSessions(user.userId);
			await auth.updateKeyPassword('email', user.email, password);

			if (!user.emailVerified) {
				user = await auth.updateUserAttributes(user.userId, {
					email_verified: true
				});
			}

			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});

			authRequest.setSession(session);
		} catch (e) {
			return fail(400, {
				message: 'Invalid or expired password reset link'
			});
		}

		// TODO send message
		throw redirect(302, '/');
	}
};
