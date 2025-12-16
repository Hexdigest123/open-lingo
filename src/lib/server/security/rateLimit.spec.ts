import { describe, expect, it, beforeEach, vi } from 'vitest';
import { checkRateLimit, RATE_LIMITS, type RateLimitConfig } from './rateLimit';

describe('checkRateLimit', () => {
	const testConfig: RateLimitConfig = {
		limit: 3,
		windowMs: 1000
	};

	beforeEach(() => {
		// Reset the rate limit store by advancing time past the window
		vi.useFakeTimers();
	});

	it('allows first request and returns correct remaining count', () => {
		vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));

		const result = checkRateLimit('user1', 'test-endpoint', testConfig);

		expect(result.allowed).toBe(true);
		expect(result.remaining).toBe(2);
		expect(result.resetIn).toBe(1000);
	});

	it('decrements remaining count on subsequent requests', () => {
		vi.setSystemTime(new Date('2024-01-01T00:01:00Z'));

		const first = checkRateLimit('user2', 'test-endpoint', testConfig);
		const second = checkRateLimit('user2', 'test-endpoint', testConfig);

		expect(first.remaining).toBe(2);
		expect(second.remaining).toBe(1);
	});

	it('blocks requests after limit is reached', () => {
		vi.setSystemTime(new Date('2024-01-01T00:02:00Z'));

		checkRateLimit('user3', 'test-endpoint', testConfig);
		checkRateLimit('user3', 'test-endpoint', testConfig);
		checkRateLimit('user3', 'test-endpoint', testConfig);
		const fourth = checkRateLimit('user3', 'test-endpoint', testConfig);

		expect(fourth.allowed).toBe(false);
		expect(fourth.remaining).toBe(0);
	});

	it('resets after window expires', () => {
		vi.setSystemTime(new Date('2024-01-01T00:03:00Z'));

		// Exhaust the limit
		checkRateLimit('user4', 'test-endpoint', testConfig);
		checkRateLimit('user4', 'test-endpoint', testConfig);
		checkRateLimit('user4', 'test-endpoint', testConfig);
		const blocked = checkRateLimit('user4', 'test-endpoint', testConfig);
		expect(blocked.allowed).toBe(false);

		// Advance time past the window
		vi.advanceTimersByTime(1001);

		const afterReset = checkRateLimit('user4', 'test-endpoint', testConfig);
		expect(afterReset.allowed).toBe(true);
		expect(afterReset.remaining).toBe(2);
	});

	it('tracks different endpoints separately', () => {
		vi.setSystemTime(new Date('2024-01-01T00:04:00Z'));

		checkRateLimit('user5', 'endpoint-a', testConfig);
		checkRateLimit('user5', 'endpoint-a', testConfig);
		checkRateLimit('user5', 'endpoint-a', testConfig);

		const endpointA = checkRateLimit('user5', 'endpoint-a', testConfig);
		const endpointB = checkRateLimit('user5', 'endpoint-b', testConfig);

		expect(endpointA.allowed).toBe(false);
		expect(endpointB.allowed).toBe(true);
	});

	it('tracks different users separately', () => {
		vi.setSystemTime(new Date('2024-01-01T00:05:00Z'));

		// Exhaust user6's limit
		checkRateLimit('user6', 'shared-endpoint', testConfig);
		checkRateLimit('user6', 'shared-endpoint', testConfig);
		checkRateLimit('user6', 'shared-endpoint', testConfig);

		const user6 = checkRateLimit('user6', 'shared-endpoint', testConfig);
		const user7 = checkRateLimit('user7', 'shared-endpoint', testConfig);

		expect(user6.allowed).toBe(false);
		expect(user7.allowed).toBe(true);
	});
});

describe('RATE_LIMITS', () => {
	it('has ai rate limit configured', () => {
		expect(RATE_LIMITS.ai.limit).toBe(10);
		expect(RATE_LIMITS.ai.windowMs).toBe(60000);
	});

	it('has chatCompletions rate limit configured', () => {
		expect(RATE_LIMITS.chatCompletions.limit).toBe(20);
		expect(RATE_LIMITS.chatCompletions.windowMs).toBe(60000);
	});

	it('has realtimeToken rate limit configured', () => {
		expect(RATE_LIMITS.realtimeToken.limit).toBe(5);
		expect(RATE_LIMITS.realtimeToken.windowMs).toBe(60000);
	});

	it('has general rate limit configured', () => {
		expect(RATE_LIMITS.general.limit).toBe(100);
		expect(RATE_LIMITS.general.windowMs).toBe(60000);
	});
});
