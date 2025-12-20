/**
 * Input validation helpers for ensuring ASCII-only input with allowed symbols.
 * Allowed characters: a-z, A-Z, 0-9, !@#$%^&*()-_./
 */

// Regex pattern for allowed characters
const ALLOWED_PATTERN = /^[a-zA-Z0-9!@#$%^&*()\-_./]+$/;

// Regex pattern for allowed characters with spaces (for display names)
const ALLOWED_PATTERN_WITH_SPACES = /^[a-zA-Z0-9!@#$%^&*()\-_./ ]+$/;

/**
 * Check if a string contains only allowed ASCII characters.
 * Does not allow spaces.
 */
export function isValidInput(value: string): boolean {
	if (!value || value.length === 0) return false;
	return ALLOWED_PATTERN.test(value);
}

/**
 * Check if a string contains only allowed ASCII characters.
 * Allows spaces (for display names).
 */
export function isValidInputWithSpaces(value: string): boolean {
	if (!value || value.length === 0) return false;
	return ALLOWED_PATTERN_WITH_SPACES.test(value);
}

/**
 * Get the HTML pattern attribute for input validation.
 * Does not include spaces.
 */
export const INPUT_PATTERN = '[a-zA-Z0-9!@#$%^&*()\\-_./]+';

/**
 * Get the HTML pattern attribute for input validation with spaces.
 */
export const INPUT_PATTERN_WITH_SPACES = '[a-zA-Z0-9!@#$%^&*()\\-_./ ]+';
