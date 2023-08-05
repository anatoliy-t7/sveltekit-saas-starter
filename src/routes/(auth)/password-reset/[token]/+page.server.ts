import { auth, passwordResetToken } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals, params }) => {
		const formData = await request.formData();
		const password = formData.get('new-password');
		if (password instanceof File || password === null || password.length < 8) {
			return fail(400, {
				message: 'Invalid password'
			});
		}
		try {
			const token = await passwordResetToken.validate(params.token ?? '');
			let user = await auth.getUser(token.userId);
			if (!user.email_verified) {
				user = await auth.updateUserAttributes(user.id, {
					email_verified: true
				});
			}
			await auth.invalidateAllUserSessions(user.id);
			await auth.updateKeyPassword('email', user.email, password);
			const session = await auth.createSession(user.id);
			locals.auth.setSession(session);
		} catch (e) {
			return fail(400, {
				message: 'An unknown error occurred'
			});
		}

		// TODO send message
		throw redirect(302, '/');
	}
};
