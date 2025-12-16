import { db } from '$lib/server/db';
import { appSettings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

// Setting keys
const SIGNUP_MODE_KEY = 'signup_mode';
const ALLOWED_DOMAINS_KEY = 'allowed_domains';
const HEARTS_DISABLED_GLOBAL_KEY = 'hearts_disabled_global';

export type SignupMode = 'open' | 'invitation' | 'approval';

/**
 * Get a setting value by key
 */
export async function getSetting(key: string): Promise<string | null> {
	const [setting] = await db
		.select({ value: appSettings.value })
		.from(appSettings)
		.where(eq(appSettings.key, key))
		.limit(1);

	return setting?.value ?? null;
}

/**
 * Set or update a setting value
 */
export async function setSetting(key: string, value: string | null): Promise<void> {
	const existing = await getSetting(key);

	if (existing !== null) {
		await db
			.update(appSettings)
			.set({ value, updatedAt: new Date() })
			.where(eq(appSettings.key, key));
	} else {
		await db.insert(appSettings).values({
			key,
			value
		});
	}
}

/**
 * Get the current signup mode
 * @returns 'open' | 'invitation' | 'approval' (defaults to 'open')
 */
export async function getSignupMode(): Promise<SignupMode> {
	const mode = await getSetting(SIGNUP_MODE_KEY);
	if (mode === 'invitation' || mode === 'approval') {
		return mode;
	}
	return 'open';
}

/**
 * Set the signup mode
 */
export async function setSignupMode(mode: SignupMode): Promise<void> {
	await setSetting(SIGNUP_MODE_KEY, mode);
}

/**
 * Get the list of allowed email domains
 * @returns Array of allowed domains (empty array means all domains allowed)
 */
export async function getAllowedDomains(): Promise<string[]> {
	const domains = await getSetting(ALLOWED_DOMAINS_KEY);
	if (!domains || domains.trim() === '') {
		return [];
	}
	return domains
		.split(',')
		.map((d) => d.trim().toLowerCase())
		.filter((d) => d.length > 0);
}

/**
 * Set the list of allowed email domains
 * @param domains Array of allowed domains (empty array removes restriction)
 */
export async function setAllowedDomains(domains: string[]): Promise<void> {
	const value = domains
		.map((d) => d.trim().toLowerCase())
		.filter((d) => d.length > 0)
		.join(',');
	await setSetting(ALLOWED_DOMAINS_KEY, value || null);
}

/**
 * Check if hearts are disabled globally
 */
export async function isHeartsDisabledGlobal(): Promise<boolean> {
	const value = await getSetting(HEARTS_DISABLED_GLOBAL_KEY);
	return value === 'true';
}

/**
 * Set global hearts disabled status
 */
export async function setHeartsDisabledGlobal(disabled: boolean): Promise<void> {
	await setSetting(HEARTS_DISABLED_GLOBAL_KEY, disabled ? 'true' : 'false');
}

/**
 * Validate if an email domain is allowed
 * @returns true if allowed, false if restricted
 */
export async function isEmailDomainAllowed(email: string): Promise<boolean> {
	const allowedDomains = await getAllowedDomains();
	if (allowedDomains.length === 0) {
		return true; // No restrictions
	}

	const emailDomain = email.split('@')[1]?.toLowerCase();
	if (!emailDomain) {
		return false; // Invalid email
	}

	return allowedDomains.includes(emailDomain);
}
