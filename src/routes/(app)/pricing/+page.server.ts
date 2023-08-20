import { auth } from '$lib/server/lucia';
import { stripe } from '$lib/server/stripe';

export const load = async (event) => {
	const authRequest = auth.handleRequest(event);
	const session = await authRequest.validate();

	let product = null;
	if (session) {
		const customers = await stripe.customers.list({
			email: session?.user.email
		});

		if (customers?.data?.length) {
			const subscriptions = await stripe.subscriptions.list({
				customer: customers?.data[0].customer
			});

			const subscription = subscriptions?.data?.find((s) => s.status === 'active');

			product = await stripe.products.retrieve(subscription?.plan.product);
		}
	}

	return { product };
};
