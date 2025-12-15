import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { revokeSession } from '$lib/server/auth/session';

const REFRESH_COOKIE_NAME = 'refresh_token';

export const POST: RequestHandler = async ({ locals, cookies }) => {
	if (locals.user) {
		// Revoke all sessions for this user
		await revokeSession(locals.user.id);
	}

	// Clear the refresh token cookie
	cookies.delete(REFRESH_COOKIE_NAME, { path: '/' });

	return json({ success: true });
};
