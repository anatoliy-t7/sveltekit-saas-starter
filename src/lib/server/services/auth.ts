import { lucia } from 'lucia';
import { google, facebook } from '@lucia-auth/oauth/providers';
import { sveltekit } from 'lucia/middleware';
import { dev } from '$app/environment';
import { prisma } from '@lucia-auth/adapter-prisma';
import { db } from '$lib/server/services/prisma';
import { PUBLIC_DOMAIN } from '$env/static/public';
import {
	GOOGLE_CLIENT_ID,
	GOOGLE_SECRET_ID,
	FACEBOOK_CLIENT_ID,
	FACEBOOK_SECRET_ID
} from '$env/static/private';

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
	clientId: GOOGLE_CLIENT_ID,
	clientSecret: GOOGLE_SECRET_ID,
	redirectUri: `${PUBLIC_DOMAIN}/login/google/callback`,
	scope: ['openid', 'profile', 'email']
});

export const facebookAuth = facebook(auth, {
	clientId: FACEBOOK_CLIENT_ID,
	clientSecret: FACEBOOK_SECRET_ID,
	redirectUri: `${PUBLIC_DOMAIN}/login/facebook/callback`,
	scope: []
});

export type Auth = typeof auth;
