import { auth, facebookAuth } from '$lib/server/services/auth';
import { db } from '$lib/server/services/prisma';
import { OAuthRequestError } from '@lucia-auth/oauth';

export const GET = async ({ url, cookies, locals }) => {
	const storedState = cookies.get('facebook_oauth_state');
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');

	// validate state
	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400
		});
	}
	try {
		const { existingUser, facebookUser, createUser, createKey } =
			await facebookAuth.validateCallback(code);

		console.log('facebookUser', facebookUser);

		const getUser = async () => {
			if (existingUser) return existingUser;
			// if (!facebookUser.email_verified) {
			// 	throw new Error('Email not verified');
			// }
			const existingDatabaseUserWithEmail = await db.user.findUnique({
				where: {
					email: facebookUser.name
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
					email: facebookUser.name,
					email_verified: true,
					role: 'client',
					name: facebookUser.name,
					active: true,
					avatar: facebookUser.picture ? facebookUser.picture.data.url : null
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
