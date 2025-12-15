import { describe, expect, it } from 'vitest';
import { isAnswerCorrect, normalizeAnswer } from './answers';

describe('normalizeAnswer', () => {
	it('removes diacritics, punctuation, and extra whitespace', () => {
		expect(normalizeAnswer('  ¿Cómó   estás?  ')).toBe('como estas');
	});

	it('keeps numbers and letters only', () => {
		expect(normalizeAnswer('Lesson #1: Cinco!')).toBe('lesson 1 cinco');
	});
});

describe('isAnswerCorrect', () => {
	it('matches case-insensitively with diacritic differences', () => {
		expect(isAnswerCorrect('buenos dias', 'Buenos días')).toBe(true);
	});

	it('handles multiple acceptable answers separated by pipes', () => {
		expect(isAnswerCorrect('good day', 'Good morning|Good day')).toBe(true);
	});

	it('ignores punctuation differences', () => {
		expect(isAnswerCorrect('como estas', '¿Cómo estás?')).toBe(true);
	});

	it('requires non-empty answers', () => {
		expect(isAnswerCorrect('', 'hola')).toBe(false);
	});
});
