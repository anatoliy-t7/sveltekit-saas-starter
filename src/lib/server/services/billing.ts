import { stripe } from '$lib/server/services/stripe';
import { env } from '$env/dynamic/private';
import { PUBLIC_DOMAIN } from '$env/static/public';
import * as users from '$lib/server/models/user';
import * as plans from '$lib/server/models/plan';

export async function syncCheckout(sessionId: string) {
	const checkout = await stripe.checkout.sessions.retrieve(sessionId);

	return syncSubscription(checkout.subscription);
}

export async function syncSubscription(subscriptionId: string) {
	const subscription = await stripe.subscriptions.retrieve(subscriptionId);
	const { userId } = subscription.metadata;

	const item = subscription.items.data[0];
	const price_id = item.price.id;
	const plan = await plans.getBy({ price_id });

	await users.update(userId, {
		customer_id: subscription.customer,
		subscription_id: subscription.id,
		status: subscription.status.toUpperCase(),
		plan_id: plan?.id
	});
}

export async function createCheckout({ email }, plan: Plan) {
	const user = await users.getBy({ email });
	const metadata = {
		userId: user?.id
	};

	return stripe.checkout.sessions.create({
		success_url: absoluteURL('/dashboard/welcome?checkout_session_id={CHECKOUT_SESSION_ID}'),
		cancel_url: absoluteURL('/pricing'),
		currency: 'usd',
		mode: 'subscription',
		customer_email: email,
		client_reference_id: user?.id,
		metadata,
		subscription_data: {
			metadata
		},
		line_items: [
			{
				price: plan.price_id,
				quantity: 1
			}
		]
	});
}

export async function createPortalSession({ email }) {
	const user = await users.getBy({ email });

	return stripe.billingPortal.sessions.create({
		customer: user.customer_id,
		return_url: absoluteURL('/dashboard')
	});
}

function absoluteURL(path: string) {
	return new URL(path, PUBLIC_DOMAIN).toString();
}
