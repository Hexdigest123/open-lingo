import { describe, expect, it } from 'vitest';
import { extractTokenUsage } from './apiUsage';

describe('extractTokenUsage', () => {
	it('extracts token usage from a complete OpenAI response', () => {
		const response = {
			model: 'gpt-4',
			usage: {
				prompt_tokens: 100,
				completion_tokens: 50,
				total_tokens: 150
			}
		};

		const result = extractTokenUsage(response);

		expect(result).toEqual({
			promptTokens: 100,
			completionTokens: 50,
			totalTokens: 150,
			model: 'gpt-4'
		});
	});

	it('returns defaults for missing usage data', () => {
		const response = {
			model: 'gpt-3.5-turbo'
		};

		const result = extractTokenUsage(response);

		expect(result).toEqual({
			promptTokens: 0,
			completionTokens: 0,
			totalTokens: 0,
			model: 'gpt-3.5-turbo'
		});
	});

	it('returns defaults for missing model', () => {
		const response = {
			usage: {
				prompt_tokens: 25,
				completion_tokens: 10,
				total_tokens: 35
			}
		};

		const result = extractTokenUsage(response);

		expect(result).toEqual({
			promptTokens: 25,
			completionTokens: 10,
			totalTokens: 35,
			model: 'unknown'
		});
	});

	it('handles empty object', () => {
		const result = extractTokenUsage({});

		expect(result).toEqual({
			promptTokens: 0,
			completionTokens: 0,
			totalTokens: 0,
			model: 'unknown'
		});
	});

	it('handles partial usage data', () => {
		const response = {
			model: 'gpt-4-turbo',
			usage: {
				prompt_tokens: 200
				// missing completion_tokens and total_tokens
			}
		};

		const result = extractTokenUsage(response);

		expect(result).toEqual({
			promptTokens: 200,
			completionTokens: 0,
			totalTokens: 0,
			model: 'gpt-4-turbo'
		});
	});

	it('handles null/undefined values in usage', () => {
		const response = {
			model: 'gpt-4',
			usage: {
				prompt_tokens: null,
				completion_tokens: undefined,
				total_tokens: 0
			}
		};

		const result = extractTokenUsage(response as unknown);

		expect(result.totalTokens).toBe(0);
	});
});
