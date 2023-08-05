import { auth } from '$lib/server/lucia';
import { error, fail, type Actions, redirect } from '@sveltejs/kit';
import { sendEmail } from '$lib/server/utils';
import { PUBLIC_DOMAIN } from '$env/static/public';
import { generateEmailVerificationToken, validateEmailVerificationToken } from '$lib/server/token';
import type { LayoutServerLoad } from '../../$types';

export const load = (async (event) => {
	const token = event.url.searchParams.get('token');

	if (token) {
		const userId = await validateEmailVerificationToken(token);

		if (!userId) {
			throw redirect(307, '/login');
		}
		const user = await auth.getUser(userId);
		await auth.updateUserAttributes(user.userId, {
			email_verified: true
		});
		return { success: true };
	} else {
	}
}) satisfies LayoutServerLoad;

export const actions: Actions = {
	default: async (event) => {
		const authRequest = auth.handleRequest(event);
		const session = await authRequest.validate();

		if (!session) {
			throw redirect(302, '/login');
		}
		if (session.user.emailVerified) {
			return fail(422, {
				message: 'Email already verified'
			});
		}
		try {
			const token = await generateEmailVerificationToken(session.user.userId);

			// url to verify tokens
			const url = `${PUBLIC_DOMAIN}/email-verification?token=${token}`;
			sendEmail(session.user.email, 'Verify email', 'verify-email', url);

			return { success: true };
		} catch {
			return fail(500, {
				message: 'An unknown error occurred'
			});
		}
	}
};
