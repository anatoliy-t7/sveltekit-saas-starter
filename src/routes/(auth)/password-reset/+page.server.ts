import { db } from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';
import { sendEmail } from '$lib/server/utils';
import { PUBLIC_DOMAIN } from '$env/static/public';
import { generatePasswordResetToken } from '$lib/server/token';

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
			const storedUser = await db.user.findFirst({
				where: {
					email: email
				}
			});

			if (!storedUser) {
				return fail(400, {
					message: 'Email does not exist',
					email
				});
			}
			const token = await generatePasswordResetToken(storedUser.id);

			const resetLink = `${PUBLIC_DOMAIN}/password-reset/${token.toString()}`;
			await sendEmail(storedUser.email, 'Password reset', 'reset-password', resetLink);

			return {
				success: true
			};
		} catch (e) {
			console.log(e);

			return fail(500, {
				message: 'An unknown error occurred',
				email
			});
		}
	}
};
