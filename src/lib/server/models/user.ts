import { db } from '$lib/server/services/prisma';
import { setError } from 'sveltekit-superforms/server';
import { auth } from '../services/auth';
import { fail, redirect } from '@sveltejs/kit';

export const pagination = async (limit: number = 15, page: number = 1) => {
	return await db.user.paginate().withPages({
		limit: limit,
		page: page,
		includePageCount: true
	});
};

export function get(id: string) {
	return getBy({ id });
}

export function getBy(where: any) {
	return db.user.findUnique({ where });
}

export function update(id: string, data: object) {
	return db.user.update({
		data,
		where: { id }
	});
}

export const save = async (form: any) => {
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
	throw redirect(303, '/dashboard/users');
};

export const remove = async (id: string) => {
	try {
		await db.user.delete({
			where: {
				id: id
			}
		});
	} catch (e) {
		console.error(e);
		return fail(400, { e });
	}
	throw redirect(303, '/dashboard/users');
};
