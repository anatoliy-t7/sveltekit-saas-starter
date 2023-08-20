import { auth } from '$lib/server/lucia';
import { generateRandomString } from 'lucia/utils';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { userSchema, otpSchema } from '$lib/zod';
import { db } from '$lib/server/prisma';
import { sendEmail } from '$lib/server/utils';

const emailSchema = userSchema.pick({
	email: true
});

let email: string;

export const load: PageServerLoad = async (event) => {
	const authRequest = auth.handleRequest(event);
	const session = await authRequest.validate();
	if (session) throw redirect(302, '/');

	const emailForm = await superValidate(emailSchema);
	const otpForm = await superValidate(otpSchema);
	return { emailForm, otpForm, email };
};

export const actions: Actions = {
	sendOtp: async (event) => {
		const emailForm = await superValidate(event.request, emailSchema);

		if (!emailForm.valid) return fail(400, { emailForm });

		let user = await db.user.findUnique({
			where: {
				email: emailForm.data.email
			}
		});

		const code = generateRandomString(6, '0123456789');

		if (!user) {
			user = await auth.createUser({
				key: {
					providerId: 'otp', // auth method
					providerUserId: emailForm.data.email.toLowerCase(),
					password: null
				},
				attributes: {
					email: emailForm.data.email.toLowerCase(),
					email_verified: false,
					active: false
				}
			});
		}

		await db.$transaction(async (trx) => {
			await trx.verificationCode.deleteMany({
				where: {
					user_id: user?.id
				}
			});

			await db.verificationCode.create({
				data: {
					code: code,
					expires: new Date().getTime() + 300,
					user_id: user?.id
				}
			});
		});

		sendEmail(user.email, 'Sign in OTP', 'send-otp', code);

		return { emailForm };
	},

	checkOtp: async (event) => {
		const otpForm = await superValidate(event.request, otpSchema);

		if (!otpForm.valid) return fail(400, { otpForm });

		let user = await db.user.findUnique({
			where: {
				email: otpForm.data.email
			}
		});

		if (user) {
			// return message(otpForm, { message: 'Too many requests' });

			let verify = await db.verificationCode.findFirst({
				where: {
					user_id: user.id
				}
			});

			if (verify?.code !== otpForm.data.otp) {
				verify = await db.verificationCode.update({
					where: {
						id: verify?.id
					},
					data: {
						attempts: {
							decrement: 1
						}
					}
				});

				console.log('verify.attempts', verify.attempts);

				if (verify.attempts <= 0) {
					return setError(otpForm, 'email', 'Attempts exhausted, try again');
				}

				return setError(otpForm, 'otp', 'Invalid verification code');
			}

			const session = await auth.createSession({
				userId: user.id,
				attributes: {}
			});
			event.locals.auth.setSession(session);

			throw redirect(303, '/');
		} else {
			return message(otpForm, { message: 'User not found' });
		}
	}
};
