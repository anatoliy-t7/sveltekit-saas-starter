import { stripeClient } from '$lib/stores/stripe';
import { loadStripe as stripejs } from '@stripe/stripe-js';
import { browser } from '$app/environment';
import { PUBLIC_STRIPE_KEY } from '$env/static/public';

export const loadStripe = async function () {
	if (browser) {
		const client = await stripejs(PUBLIC_STRIPE_KEY);
		stripeClient.set(client);
	} else return null;
};
