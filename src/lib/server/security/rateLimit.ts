/**
 * Simple in-memory rate limiter for API endpoints
 * For production, consider using Redis-based rate limiting
 */

interface RateLimitEntry {
	count: number;
	resetTime: number;
}

// In-memory store for rate limiting (per user/IP)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(
	() => {
		const now = Date.now();
		for (const [key, entry] of rateLimitStore.entries()) {
			if (entry.resetTime < now) {
				rateLimitStore.delete(key);
			}
		}
	},
	5 * 60 * 1000
);

export interface RateLimitConfig {
	/** Maximum number of requests allowed in the window */
	limit: number;
	/** Time window in milliseconds */
	windowMs: number;
}

export interface RateLimitResult {
	allowed: boolean;
	remaining: number;
	resetIn: number;
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier for the requester (userId or IP)
 * @param endpoint - The endpoint being accessed
 * @param config - Rate limit configuration
 */
export function checkRateLimit(
	identifier: string,
	endpoint: string,
	config: RateLimitConfig
): RateLimitResult {
	const key = `${identifier}:${endpoint}`;
	const now = Date.now();
	const entry = rateLimitStore.get(key);

	// If no entry or window expired, create new entry
	if (!entry || entry.resetTime < now) {
		rateLimitStore.set(key, {
			count: 1,
			resetTime: now + config.windowMs
		});
		return {
			allowed: true,
			remaining: config.limit - 1,
			resetIn: config.windowMs
		};
	}

	// Check if limit exceeded
	if (entry.count >= config.limit) {
		return {
			allowed: false,
			remaining: 0,
			resetIn: entry.resetTime - now
		};
	}

	// Increment count
	entry.count++;
	return {
		allowed: true,
		remaining: config.limit - entry.count,
		resetIn: entry.resetTime - now
	};
}

// Predefined rate limit configurations
export const RATE_LIMITS = {
	// AI endpoints - more expensive, stricter limits
	ai: {
		limit: 10,
		windowMs: 60 * 1000 // 10 requests per minute
	},
	// Chat completions - moderate limits
	chatCompletions: {
		limit: 20,
		windowMs: 60 * 1000 // 20 requests per minute
	},
	// Realtime token - very limited
	realtimeToken: {
		limit: 5,
		windowMs: 60 * 1000 // 5 requests per minute
	},
	// General API - relaxed limits
	general: {
		limit: 100,
		windowMs: 60 * 1000 // 100 requests per minute
	}
} as const;
