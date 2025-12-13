import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// Redirect authenticated users to dashboard (except if they're on logout path)
	if (locals.user && url.pathname !== '/logout') {
		redirect(303, '/dashboard');
	}

	return {
		user: locals.user
	};
};
