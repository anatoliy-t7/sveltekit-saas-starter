import { auth, googleAuth } from '$lib/server/lucia.js';
import { db } from '$lib/server/prisma';
import { OAuthRequestError } from '@lucia-auth/oauth';

export const GET = async ({ url, cookies, locals }) => {
	const storedState = cookies.get('google_oauth_state');
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');

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
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
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
