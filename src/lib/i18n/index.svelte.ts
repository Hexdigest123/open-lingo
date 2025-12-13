import en from './en.json';
import de from './de.json';

export type Locale = 'en' | 'de';

const translations: Record<Locale, typeof en> = {
	en,
	de
};

const STORAGE_KEY = 'open-lingo-locale';

// Get nested value from object using dot notation
function getNestedValue(obj: Record<string, unknown>, path: string): string {
	const keys = path.split('.');
	let current: unknown = obj;

	for (const key of keys) {
		if (current === null || current === undefined || typeof current !== 'object') {
			return path;
		}
		current = (current as Record<string, unknown>)[key];
	}

	return typeof current === 'string' ? current : path;
}

// Detect browser language
function detectLocale(): Locale {
	if (typeof window === 'undefined') return 'en';

	// Check localStorage first
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === 'en' || stored === 'de') {
		return stored;
	}

	// Detect from browser
	const browserLang = navigator.language.toLowerCase();
	if (browserLang.startsWith('de')) {
		return 'de';
	}

	return 'en';
}

// Create reactive locale state
class I18n {
	locale = $state<Locale>('en');
	private initialized = false;

	constructor() {
		// Will be initialized on client side
	}

	init() {
		if (this.initialized || typeof window === 'undefined') return;
		this.locale = detectLocale();
		this.initialized = true;
	}

	setLocale(newLocale: Locale) {
		this.locale = newLocale;
		if (typeof window !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, newLocale);
		}
	}

	t(key: string, params?: Record<string, string | number>): string {
		const translation = getNestedValue(translations[this.locale] as Record<string, unknown>, key);

		if (params) {
			return Object.entries(params).reduce(
				(str, [k, v]) => str.replace(new RegExp(`{${k}}`, 'g'), String(v)),
				translation
			);
		}

		return translation;
	}

	// Get all available locales
	get availableLocales(): { code: Locale; name: string }[] {
		return [
			{ code: 'en', name: 'English' },
			{ code: 'de', name: 'Deutsch' }
		];
	}
}

// Export singleton instance
export const i18n = new I18n();

// Export convenience function
export function t(key: string, params?: Record<string, string | number>): string {
	return i18n.t(key, params);
}

// Export type for translations
export type TranslationKey = string;
