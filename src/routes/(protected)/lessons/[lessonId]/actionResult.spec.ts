import { describe, expect, it } from 'vitest';
import { extractSubmitActionPayload } from './actionResult';

describe('extractSubmitActionPayload', () => {
	it('reads payload from success action response shape', () => {
		const result = extractSubmitActionPayload({
			type: 'success',
			data: { isCorrect: true, correctAnswer: 'hola' }
		});

		expect(result).toEqual({ isCorrect: true, correctAnswer: 'hola', freezeEarned: undefined });
	});

	it('rejects failure responses', () => {
		const result = extractSubmitActionPayload({
			type: 'failure',
			data: { isCorrect: true, correctAnswer: 'hola' }
		});

		expect(result).toBeNull();
	});

	it('handles legacy array payloads', () => {
		const result = extractSubmitActionPayload([null, false, 'adios']);
		expect(result).toEqual({ isCorrect: false, correctAnswer: 'adios', freezeEarned: undefined });
	});
});
