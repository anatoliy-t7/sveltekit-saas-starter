import { error } from '@sveltejs/kit';
import * as user from '$lib/server/models/user';
import { serializeNonPOJOs } from '$lib/server/utils';

export const load = async ({ url }) => {
	const page: number = Number(url.searchParams.get('page') || 1);
	const limit: number = Number(url.searchParams.get('limit') || 15);

	const [users, meta] = await user.pagination(limit, page);

	if (!users) {
		throw error(404, 'Users not found');
	}

	return { users: serializeNonPOJOs(users), meta };
};
