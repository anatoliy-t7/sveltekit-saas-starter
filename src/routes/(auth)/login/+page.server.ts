import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { superValidate, setError } from 'sveltekit-superforms/server';
import { userSchema } from '$lib/zod';
import { db } from '$lib/server/prisma';
import { LuciaError } from 'lucia';
import { generateEmailVerificationToken } from '$lib/server/token';
import { sendEmail } from '$lib/server/utils';
import { PUBLIC_DOMAIN } from '$env/static/public';

export const load: PageServerLoad = async (event) => {
	const authRequest = auth.handleRequest(event);
	const session = await authRequest.validate();
	if (session) throw redirect(302, '/');

	const form = await superValidate(userSchema);
	return { form };
};

export const actions: Actions = {
	default: async (event) => {
		const authRequest = auth.handleRequest(event);

		const form = await superValidate(event.request, userSchema);

		if (!form.valid) return fail(400, { form });

		const checkUser = await db.user.findUnique({
			where: {
				email: form.data.email
			}
		});

		let user;

		if (checkUser) {
			try {
				user = await auth.useKey('email', form.data.email, form.data.password);
			} catch (e) {
				if (
					e instanceof LuciaError &&
					(e.message === 'AUTH_INVALID_KEY_ID' || e.message === 'AUTH_INVALID_PASSWORD')
				) {
					return setError(form, 'password', 'Invalid password');
				}

				return fail(500, {
					message: 'An unknown error occurred'
				});
			}
		} else {
			try {
				user = await auth.createUser({
					key: {
						providerId: 'email', // auth method
						providerUserId: form.data.email.toLowerCase(), // unique id when using "username" auth method
						password: form.data.password // hashed by Lucia
					},
					attributes: {
						name: null,
						email: form.data.email.toLowerCase(),
						email_verified: false,
						role: 'client'
					}
				});
			} catch (e) {
				return fail(500, {
					message: 'An unknown error occurred'
				});
			}
		}

		if (!checkUser || !checkUser?.email_verified) {
			const token = await generateEmailVerificationToken(user.userId);

			// url to verify tokens
			const url = `${PUBLIC_DOMAIN}/email-verification?token=${token}`;
			sendEmail(user.providerUserId, 'Verify email', 'verify-email', url);
		}

		const session = await auth.createSession({
			userId: user.userId,
			attributes: {}
		});
		authRequest.setSession(session);

		throw redirect(302, '/');
	}
};
