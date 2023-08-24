import { error, fail } from '@sveltejs/kit';
import { ROLES } from '$lib/consts';
import { superValidate } from 'sveltekit-superforms/server';
import { userSchema } from '$lib/zod';
import { serializeNonPOJOs } from '$lib/server/utils';
import { deleteUser, getUser, saveUser } from '$lib/server/models/user';

const fullUserSchema = userSchema.pick({
	id: true,
	name: true,
	email: true,
	role: true,
	active: true,
	password: true
});

export const load = async ({ params }) => {
	const id: string | undefined = params.id && params.id !== 'new' ? params.id : undefined;

	const user = await getUser(id);

	if (id && !user) throw error(404, 'User not found.');

	const form = await superValidate(serializeNonPOJOs(user), fullUserSchema);

	return { form, roles: ROLES };
};

export const actions = {
	save: async (event) => {
		const form = await superValidate(event, fullUserSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		return await saveUser(form);
	},

	delete: async ({ request }) => {
		const values = await request.formData();
		const form = await superValidate(values, userSchema);

		return await deleteUser(form.data.id);
	}
};
