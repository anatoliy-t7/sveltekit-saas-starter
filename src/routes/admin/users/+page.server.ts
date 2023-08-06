import { error } from '@sveltejs/kit';
import { db } from '$lib/server/prisma';

export const load = async ({ url }) => {
	const getUsers = async () => {
		const page = Number(url.searchParams.get('page') || 1);
		const limit = 15;

		const users = await db.user.paginate().withPages({
			limit: limit,
			page: page,
			includePageCount: true
		});

		if (!users) {
			throw error(404, 'Users not found');
		}

		return JSON.parse(JSON.stringify(users));
	};

	return { users: getUsers() };
};
