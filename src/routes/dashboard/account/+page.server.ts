import { error, fail } from '@sveltejs/kit';
import { db } from '$lib/server/services/prisma';
import { message, superValidate } from 'sveltekit-superforms/server';
import { userSchema } from '$lib/zod';
import { auth } from '$lib/server/services/auth';
import { stripe } from '$lib/server/services/stripe';

const accountSchema = userSchema.pick({
	id: true,
	name: true,
	email: true,
	phone: true
});

export const load = async (event) => {
	const authRequest = auth.handleRequest(event);
	const session = await authRequest.validate();

	const editUser = session?.user?.userId
		? await db.user.findUnique({
				where: {
					id: session?.user?.userId
				}
		  })
		: null;

	if (session?.user?.userId && !editUser) throw error(404, 'User not found.');

	const form = await superValidate(JSON.parse(JSON.stringify(editUser)), accountSchema);

	const customers = await stripe.customers.list({
		email: session?.user.email
	});

	let subIsActive = false;
	if (customers?.data?.length) {
		const subscriptions = await stripe.subscriptions.list({
			customer: customers?.data[0].customer
		});

		subIsActive = subscriptions?.data?.find((s) => s.status === 'active') ? true : false;
	}

	return { form, subIsActive };
};

export const actions = {
	save: async (event) => {
		const form = await superValidate(event, accountSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await db.user.update({
				where: {
					id: form.data.id
				},
				data: {
					name: form.data.name,
					email: form.data.email
				}
			});
		} catch (e) {
			return fail(400, { error: e });
		}

		return message(form, { message: 'User data was saved' });
	}
};
