import { auth, googleAuth } from '$lib/server/services/auth';
import { db } from '$lib/server/services/prisma';
import { OAuthRequestError } from '@lucia-auth/oauth';
import * as billing from '$lib/server/services/billing';
import * as plans from '$lib/server/models/plan';

export const GET = async ({ url, cookies, locals }) => {
	const storedState = cookies.get('google_oauth_state');
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');
	const planHandle = cookies.get('user_plan');

	// validate state
	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400
		});
	}
	try {
		const { existingUser, googleUser, googleTokens, createUser, createKey } =
			await googleAuth.validateCallback(code);

		const getUser = async () => {
			if (existingUser) return existingUser;
			if (!googleUser.email_verified) {
				throw new Error('Email not verified');
			}
			const existingDatabaseUserWithEmail = await db.user.findUnique({
				where: {
					email: googleUser.email
				}
			});
			if (existingDatabaseUserWithEmail) {
				// transform `UserSchema` to `User`
				const user = auth.transformDatabaseUser(existingDatabaseUserWithEmail);
				await createKey(user.userId);
				return user;
			}
			return await createUser({
				attributes: {
					email: googleUser.email,
					email_verified: googleUser.email_verified,
					role: 'client',
					name: googleUser.name,
					avatar: googleUser.picture || null
				}
			});
		};

		const user = await getUser();
		const session = await auth.createSession({
			userId: user.userId,
			attributes: {}
		});
		locals.auth.setSession(session);

		if (planHandle) {
			const plan: Plan = await plans.getBy({ handle: planHandle });
			const checkout = await billing.createCheckout(session?.user, plan);

			return new Response(null, {
				status: 302,
				headers: {
					Location: checkout.url
				}
			});
		}

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/dashboard'
			}
		});
	} catch (e) {
		console.error(e);

		if (e instanceof OAuthRequestError) {
			// invalid code
			return new Response(null, {
				status: 400
			});
		}
		return new Response(null, {
			status: 500
		});
	}
};
