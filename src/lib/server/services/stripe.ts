import Stripe from 'stripe';
import { SECRET_STRIPE_KEY } from '$env/static/private';

export const stripe = new Stripe(SECRET_STRIPE_KEY, {
	apiVersion: '2023-08-16'
});
