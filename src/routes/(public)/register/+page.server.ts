import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { createUserWithSession } from '$lib/server/auth/session';
import {
	getSignupMode,
	getAllowedDomains,
	isEmailDomainAllowed,
	type SignupMode
} from '$lib/server/settings/appSettings';
import {
	validateInvitationCode,
	markInvitationUsed
} from '$lib/server/invitations/invitations';

const REFRESH_COOKIE_NAME = 'refresh_token';

export const load: PageServerLoad = async ({ url }) => {
	const signupMode = await getSignupMode();
	const allowedDomains = await getAllowedDomains();
	const inviteCode = url.searchParams.get('invite') || '';

	return {
		signupMode,
		allowedDomains,
		domainRestricted: allowedDomains.length > 0,
		inviteCode
	};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const displayName = data.get('displayName')?.toString().trim();
		const email = data.get('email')?.toString().toLowerCase().trim();
		const password = data.get('password')?.toString();
		const confirmPassword = data.get('confirmPassword')?.toString();
		const inviteCode = data.get('inviteCode')?.toString().trim();

		// Get current signup configuration
		const signupMode = await getSignupMode();

		// Validation
		if (!displayName || !email || !password || !confirmPassword) {
			return fail(400, { error: 'All fields are required', displayName, email, signupMode });
		}

		if (displayName.length < 2 || displayName.length > 50) {
			return fail(400, {
				error: 'Display name must be between 2 and 50 characters',
				displayName,
				email,
				signupMode
			});
		}

		if (password.length < 8) {
			return fail(400, {
				error: 'Password must be at least 8 characters',
				displayName,
				email,
				signupMode
			});
		}

		if (password !== confirmPassword) {
			return fail(400, { error: 'Passwords do not match', displayName, email, signupMode });
		}

		// Check domain restriction
		const domainAllowed = await isEmailDomainAllowed(email);
		if (!domainAllowed) {
			const allowedDomains = await getAllowedDomains();
			return fail(400, {
				error: `Registration is restricted to the following domains: ${allowedDomains.join(', ')}`,
				displayName,
				email,
				signupMode
			});
		}

		// Validate invitation code if in invitation mode
		let validatedInvitation: Awaited<ReturnType<typeof validateInvitationCode>>['invitation'];
		if (signupMode === 'invitation') {
			if (!inviteCode) {
				return fail(400, {
					error: 'An invitation code is required to register',
					displayName,
					email,
					signupMode
				});
			}

			const validation = await validateInvitationCode(inviteCode, email);
			if (!validation.valid) {
				return fail(400, {
					error: validation.error || 'Invalid invitation code',
					displayName,
					email,
					signupMode
				});
			}
			validatedInvitation = validation.invitation;
		}

		// Check if email already exists
		const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);

		if (existingUser) {
			return fail(400, {
				error: 'An account with this email already exists',
				displayName,
				email,
				signupMode
			});
		}

		// Determine approval status based on signup mode
		const approvalStatus = signupMode === 'approval' ? 'pending' : 'approved';

		let result;
		try {
			// Create user and session
			result = await createUserWithSession(email, password, displayName, { approvalStatus });
		} catch (error) {
			console.error('Registration error:', error);
			return fail(500, {
				error: 'Something went wrong. Please try again.',
				displayName,
				email,
				signupMode
			});
		}

		// Mark invitation as used if applicable
		if (signupMode === 'invitation' && validatedInvitation) {
			await markInvitationUsed(validatedInvitation.code, result.userId);
		}

		// Set refresh token cookie (outside try/catch to avoid catching redirect)
		cookies.set(REFRESH_COOKIE_NAME, result.tokens.refreshToken, {
			path: '/',
			httpOnly: true,
			secure: !import.meta.env.DEV,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 7 // 7 days
		});

		// If approval is required, redirect to pending page
		if (approvalStatus === 'pending') {
			redirect(303, '/pending-approval');
		}

		// Redirect to dashboard (must be outside try/catch as redirect() throws)
		redirect(303, '/dashboard');
	}
};
