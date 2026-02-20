import { json, redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { paraglideMiddleware } from '$lib/paraglide/server.js';
import { validateAccessToken, refreshSession } from '$lib/server/auth/session';
import { checkRateLimit, RATE_LIMITS } from '$lib/server/security/rateLimit';

const REFRESH_COOKIE_NAME = 'refresh_token';

// Rate limited API paths and their configurations
const RATE_LIMITED_PATHS: Array<{ pattern: RegExp; config: keyof typeof RATE_LIMITS }> = [
	{ pattern: /^\/api\/ai\//, config: 'ai' },
	{ pattern: /^\/api\/chat\/completions/, config: 'chatCompletions' },
	{ pattern: /^\/api\/chat\/realtime-token/, config: 'realtimeToken' }
];

// Routes that pending users are allowed to access
const PENDING_USER_ALLOWED_ROUTES = ['/pending-approval', '/logout', '/api/auth/logout', '/'];

const authHandle: Handle = async ({ event, resolve }) => {
	// Initialize user as null
	event.locals.user = null;

	// Try to get access token from Authorization header
	const authHeader = event.request.headers.get('Authorization');
	let accessToken: string | null = null;

	if (authHeader?.startsWith('Bearer ')) {
		accessToken = authHeader.slice(7);
	}

	// Validate access token if present
	if (accessToken) {
		const user = await validateAccessToken(accessToken);
		if (user) {
			event.locals.user = user;
		}
	}

	// If no valid access token, try to refresh using cookie
	if (!event.locals.user) {
		const refreshToken = event.cookies.get(REFRESH_COOKIE_NAME);

		if (refreshToken) {
			const tokens = await refreshSession(refreshToken);

			if (tokens) {
				// Set the new refresh token cookie
				event.cookies.set(REFRESH_COOKIE_NAME, tokens.refreshToken, {
					path: '/',
					httpOnly: true,
					secure: !import.meta.env.DEV,
					sameSite: 'lax',
					maxAge: 60 * 60 * 24 * 7 // 7 days
				});

				// Validate the new access token to get user data
				const user = await validateAccessToken(tokens.accessToken);
				if (user) {
					event.locals.user = user;
					// Store the new access token in locals for the response
					event.locals.newAccessToken = tokens.accessToken;
				}
			} else {
				// Invalid refresh token, clear the cookie
				event.cookies.delete(REFRESH_COOKIE_NAME, { path: '/' });
			}
		}
	}

	// Check if user is pending approval and trying to access restricted routes
	if (event.locals.user?.approvalStatus === 'pending') {
		const path = event.url.pathname;
		const isAllowed = PENDING_USER_ALLOWED_ROUTES.some(
			(route) => path === route || path.startsWith(route + '/')
		);

		if (!isAllowed) {
			redirect(303, '/pending-approval');
		}
	}

	// Check if user is rejected - redirect to rejected page and clear session
	if (event.locals.user?.approvalStatus === 'rejected') {
		event.cookies.delete(REFRESH_COOKIE_NAME, { path: '/' });
		event.locals.user = null;

		// Only redirect if not already on the rejected page or home
		const path = event.url.pathname;
		if (path !== '/rejected' && path !== '/') {
			redirect(303, '/rejected');
		}
	}

	// Rate limiting for API endpoints
	const pathname = event.url.pathname;
	for (const { pattern, config } of RATE_LIMITED_PATHS) {
		if (pattern.test(pathname)) {
			// Use userId if authenticated, otherwise fall back to IP
			const identifier =
				event.locals.user?.id?.toString() ||
				event.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
				event.getClientAddress();

			const rateLimitConfig = RATE_LIMITS[config];
			const result = checkRateLimit(identifier, config, rateLimitConfig);

			if (!result.allowed) {
				return json(
					{
						error: 'Too many requests. Please try again later.',
						retryAfter: Math.ceil(result.resetIn / 1000)
					},
					{
						status: 429,
						headers: {
							'Retry-After': Math.ceil(result.resetIn / 1000).toString(),
							'X-RateLimit-Limit': rateLimitConfig.limit.toString(),
							'X-RateLimit-Remaining': '0',
							'X-RateLimit-Reset': Math.ceil(result.resetIn / 1000).toString()
						}
					}
				);
			}
			break;
		}
	}

	const response = await resolve(event);

	// If we generated a new access token, include it in the response header
	if (event.locals.newAccessToken) {
		response.headers.set('X-New-Access-Token', event.locals.newAccessToken);
	}

	return response;
};

const i18nHandle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
		event.request = localizedRequest;
		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%lang%', locale)
		});
	});

export const handle = sequence(i18nHandle, authHandle);
