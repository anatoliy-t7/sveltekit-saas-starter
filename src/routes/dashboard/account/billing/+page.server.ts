import { auth } from '$lib/server/services/auth';
import { stripe } from '$lib/server/services/stripe';
import { redirect } from '@sveltejs/kit';
import { PUBLIC_DOMAIN } from '$env/static/public';

export const load = async (event) => {
	const authRequest = auth.handleRequest(event);
	const session = await authRequest.validate();

	const customers = await stripe.customers.list({
		email: session?.user.email
	});

	if (customers?.data?.length) {
		const portalSession = await stripe.billingPortal.sessions.create({
			customer: customers?.data[0].id,
			return_url: `${PUBLIC_DOMAIN}/account`
		});

		throw redirect(303, portalSession.url);
	}

	throw redirect(303, '/account');
};
