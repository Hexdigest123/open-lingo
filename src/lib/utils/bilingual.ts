import { i18n, type Locale } from '$lib/i18n/index.svelte';

export type BilingualText = {
	en: string;
	de: string;
};

/**
 * Parses a bilingual text field and returns the correct language version.
 * Supports both JSON format `{"en":"...","de":"..."}` and plain strings for backwards compatibility.
 *
 * @param value - JSON string with bilingual text or plain string
 * @param fallback - Default value if parsing fails or value is null
 * @param locale - Optional locale override (defaults to current i18n locale)
 * @returns The localized string
 */
export function getBilingualText(
	value: string | null | undefined,
	fallback = '',
	locale?: Locale
): string {
	if (!value) return fallback;

	const currentLocale = locale ?? i18n.locale;

	try {
		const parsed = JSON.parse(value) as BilingualText;
		if (typeof parsed === 'object' && parsed !== null) {
			// Return the locale-specific text, falling back to English, then to fallback
			return parsed[currentLocale] ?? parsed.en ?? fallback;
		}
		// If parsed is not an object, treat as plain string
		return value;
	} catch {
		// Not valid JSON, return as plain string (backwards compatibility)
		return value;
	}
}

/**
 * Creates a bilingual text JSON string from English and German values.
 *
 * @param en - English text
 * @param de - German text
 * @returns JSON string in format `{"en":"...","de":"..."}`
 */
export function createBilingualText(en: string, de: string): string {
	return JSON.stringify({ en, de });
}

/**
 * Parses a bilingual text field and returns both language versions.
 * Useful for admin forms where both versions need to be edited.
 *
 * @param value - JSON string with bilingual text or plain string
 * @returns Object with en and de fields
 */
export function parseBilingualText(value: string | null | undefined): BilingualText {
	if (!value) return { en: '', de: '' };

	try {
		const parsed = JSON.parse(value) as BilingualText;
		if (typeof parsed === 'object' && parsed !== null) {
			return {
				en: parsed.en ?? '',
				de: parsed.de ?? ''
			};
		}
		// If parsed is not an object, use as English with empty German
		return { en: value, de: '' };
	} catch {
		// Not valid JSON, use as English with empty German (backwards compatibility)
		return { en: value, de: '' };
	}
}
