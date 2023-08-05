import { auth, passwordResetToken } from '$lib/server/lucia';
import { db } from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';
import { sendEmail } from '$lib/server/utils';
import { PUBLIC_DOMAIN } from '$env/static/public';

const emailRegex = /^.+@.+/;

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString() ?? '';
		if (email === null || !emailRegex.test(email)) {
			return fail(400, {
				message: 'Invalid email',
				email
			});
		}
		try {
			const databaseUser = await db.authUser.findFirst({
				where: {
					email: email
				}
			});
			if (!databaseUser) {
				return fail(400, {
					message: 'Email does not exist',
					email
				});
			}
			const user = auth.transformDatabaseUser(databaseUser);
			const token = await passwordResetToken.issue(user.id);
			const resetLink = `${PUBLIC_DOMAIN}/password-reset/${token.toString()}`;
			await sendEmail(user.email, 'Password reset', 'reset-password', resetLink);

			return {
				success: true
			};
		} catch (e) {
			return fail(500, {
				message: 'An unknown error occurred',
				email
			});
		}
	}
};
