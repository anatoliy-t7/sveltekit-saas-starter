import { stripeClient } from '$lib/stores';
import { loadStripe as stripejs } from '@stripe/stripe-js';
import { browser } from '$app/environment';
import { env } from '$env/dynamic/private';

export const loadStripe = async function () {
	if (browser) {
		const client = await stripejs(env.PUBLIC_STRIPE_KEY);
		stripeClient.set(client);
	} else return null;
};
