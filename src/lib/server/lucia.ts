import { lucia } from 'lucia';
import { google, facebook } from '@lucia-auth/oauth/providers';
import { sveltekit } from 'lucia/middleware';
import { dev } from '$app/environment';
import { prisma } from '@lucia-auth/adapter-prisma';
import { db } from '$lib/server/prisma';
import { env } from '$env/dynamic/private';
import { PUBLIC_DOMAIN } from '$env/static/public';

export const auth = lucia({
	adapter: prisma(db),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	sessionCookie: {
		expires: false
	},
	getUserAttributes: (data) => {
		return {
			name: data.name,
			email: data.email,
			role: data.role,
			emailVerified: data.email_verified,
			avatar: data.avatar,
			active: data.active
		};
	}
});

export const googleAuth = google(auth, {
	clientId: env.GOOGLE_CLIENT_ID,
	clientSecret: env.GOOGLE_SECRET_ID,
	redirectUri: `${PUBLIC_DOMAIN}/login/google/callback`,
	scope: ['openid', 'profile', 'email']
});

export const facebookAuth = facebook(auth, {
	clientId: env.FACEBOOK_CLIENT_ID,
	clientSecret: env.FACEBOOK_SECRET_ID,
	redirectUri: `${PUBLIC_DOMAIN}/login/facebook/callback`,
	scope: []
});

export type Auth = typeof auth;
