import { auth } from '$lib/server/services/auth';
import { error, redirect } from '@sveltejs/kit';
import * as plans from '$lib/server/models/plan';
import * as billing from '$lib/server/services/billing';

export async function GET(event) {
	const authRequest = auth.handleRequest(event);
	const session = await authRequest.validate();

	if (session?.user.plan_id) {
		throw error(400, 'User already has a plan');
	}

	const handle = event.url.searchParams.get('plan');
	const plan: Plan = await plans.getBy({ handle });

	const checkout = await billing.createCheckout(session?.user, plan);

	throw redirect(303, checkout.url);
}
