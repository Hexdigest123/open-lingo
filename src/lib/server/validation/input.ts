/**
 * Input validation helpers for ensuring ASCII-only input with allowed symbols.
 * Allowed characters: a-z, A-Z, 0-9, !@#$%^&*()-_./
 */

// Maximum length for all user input fields
export const MAX_INPUT_LENGTH = 50;

// Regex pattern for allowed characters
const ALLOWED_PATTERN = /^[a-zA-Z0-9!@#$%^&*()\-_./]+$/;

// Regex pattern for allowed characters with spaces (for display names)
const ALLOWED_PATTERN_WITH_SPACES = /^[a-zA-Z0-9!@#$%^&*()\-_./ ]+$/;

// Email validation regex - RFC 5322 simplified, ASCII only
const EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

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
 * Validate email format - ASCII only with proper structure.
 * Must be a valid email format and not exceed MAX_INPUT_LENGTH.
 */
export function isValidEmail(value: string): boolean {
	if (!value || value.length === 0) return false;
	if (value.length > MAX_INPUT_LENGTH) return false;
	return EMAIL_PATTERN.test(value);
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
