import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// Redirect authenticated users to dashboard (except for logout and pending-approval pages)
	if (locals.user && url.pathname !== '/logout' && url.pathname !== '/pending-approval') {
		// Don't redirect pending users to dashboard - they need to stay on pending-approval
		if (locals.user.approvalStatus !== 'pending') {
			redirect(303, '/dashboard');
		}
	}

	return {
		user: locals.user
	};
};
