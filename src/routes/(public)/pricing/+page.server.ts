import * as plans from '$lib/server/models/plan';
export const load = async () => {
	return {
		plans: plans.all()
	};
};
