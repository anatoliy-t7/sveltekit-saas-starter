import { db } from '$lib/server/prisma';
import { error, fail, redirect } from '@sveltejs/kit';
import { ROLES } from '$lib/consts';
import { superValidate, setError, actionResult } from 'sveltekit-superforms/server';
import { auth } from '$lib/server/lucia';
import { userSchema } from '$lib/zod';
import { Prisma } from '@prisma/client';
import { serializeNonPOJOs } from '$lib/server/utils';

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

	const user = id
		? await db.user.findUnique({
				where: {
					id: id
				}
		  })
		: null;

	if (id && !user) throw error(404, 'User not found.');

	const form = await superValidate(JSON.parse(JSON.stringify(user)), fullUserSchema);
	let roles = ROLES;
	return { form, roles };
};

export const actions = {
	save: async (event) => {
		const form = await superValidate(event, fullUserSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		if (form.data.id) {
			await db.user.update({
				where: {
					id: form.data.id
				},
				data: {
					name: form.data.name,
					email: form.data.email,

					role: form.data.role,
					active: form.data.active
				}
			});
		} else {
			const checkUser = await db.user.findUnique({
				where: {
					email: form.data.email
				}
			});
			if (checkUser) {
				return setError(form, 'email', 'A user with this email already exists.');
			}

			const user = await auth.createUser({
				key: {
					providerId: 'email',
					providerUserId: form.data.email.toLowerCase(),
					password: form.data.password
				},
				attributes: {
					name: form.data.name,
					email: form.data.email.toLowerCase(),
					email_verified: false,
					role: form.data.role
				}
			});
		}

		throw redirect(303, '/admin/users');
	},

	delete: async ({ request }) => {
		const values = await request.formData();
		const form = await superValidate(values, userSchema);
		try {
			await db.user.delete({
				where: {
					id: form.data.id
				}
			});
		} catch (e) {
			console.error(e);
			return fail(400, { e });
		}

		throw redirect(303, '/admin/users');
	}
};
