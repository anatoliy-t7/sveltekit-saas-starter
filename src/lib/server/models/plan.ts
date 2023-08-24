import { db } from '$lib/server/services/prisma';

export function all() {
	return db.plan.findMany({
		orderBy: [{ price: 'asc' }]
	});
}

export function get(id: string) {
	return getBy({ id });
}

export function getBy(where: string) {
	return db.plan.findUnique({ where });
}
