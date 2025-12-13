import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { user, stats } = await parent();

	return {
		user,
		stats
	};
};
