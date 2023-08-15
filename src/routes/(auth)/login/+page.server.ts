import { auth } from '$lib/server/lucia';
import { generateRandomString, isWithinExpiration } from 'lucia/utils';
import { fail, json, redirect } from '@sveltejs/kit';
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

		// TODO https://lucia-auth.com/guidebook/email-verification-codes
		const verificationTimeout = new Map<
			string,
			{
				timeoutUntil: number;
				timeoutSeconds: number;
			}
		>();

		if (user) {
			const storedTimeout = verificationTimeout.get(user.id) ?? null;

			if (!storedTimeout) {
				// first attempt - setup throttling
				verificationTimeout.set(user.id, {
					timeoutUntil: Date.now(),
					timeoutSeconds: 1
				});
			} else {
				// subsequent attempts
				if (!isWithinExpiration(storedTimeout.timeoutUntil)) {
					return message(otpForm, { message: 'Too many requests' });
				}
				const timeoutSeconds = storedTimeout.timeoutSeconds * 2;
				verificationTimeout.set(user.id, {
					timeoutUntil: Date.now() + timeoutSeconds * 1000,
					timeoutSeconds
				});
			}

			let result = await db.verificationCode.findFirst({
				where: {
					user_id: user.id,
					code: otpForm.data.otp
				}
			});

			if (!result) {
				return setError(otpForm, 'otp', 'Invalid verification code');
			}

			await db.user.update({
				where: {
					id: user.id
				},
				data: {
					active: true
				}
			});

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
