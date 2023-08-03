import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { userSchema } from '$lib/zod';
import { db } from '$lib/server/prisma';
import { LuciaError } from 'lucia';

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
					return fail(400, {
						message: 'Invalid password'
					});
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
						providerUserId: form.data.email, // unique id when using "username" auth method
						password: form.data.password // hashed by Lucia
					},
					attributes: {
						email: form.data.email
					}
				});
			} catch (e) {
				return fail(500, {
					message: 'An unknown error occurred'
				});
			}
		}

		const session = await auth.createSession({
			userId: user.userId,
			attributes: {}
		});
		authRequest.setSession(session);

		// redirect to
		// make sure you don't throw inside a try/catch block!
		throw redirect(302, '/');
	}
};
