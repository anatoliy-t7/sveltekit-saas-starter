import { error, fail } from '@sveltejs/kit';
import { db } from '$lib/server/prisma';
import { message, superValidate } from 'sveltekit-superforms/server';
import { userSchema } from '$lib/zod';

const accountSchema = userSchema.pick({
	id: true,
	name: true,
	email: true,
	phone: true
});

export const load = async ({ locals }) => {
	const { user } = await locals.auth.validateUser();

	const editUser = user?.id
		? await db.authUser.findUnique({
				where: {
					id: user?.id
				}
		  })
		: null;

	if (user?.id && !editUser) throw error(404, 'User not found.');

	const form = await superValidate(JSON.parse(JSON.stringify(editUser)), accountSchema);
	return { form };
};

export const actions = {
	save: async (event) => {
		const form = await superValidate(event, accountSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await db.authUser.update({
				where: {
					id: form.data.id
				},
				data: {
					name: form.data.name,
					email: form.data.email,
					phone: form.data.phone
				}
			});
		} catch (e) {
			return fail(400, { error: e });
		}

		return message(form, { message: 'User data was saved' });
	}
};
