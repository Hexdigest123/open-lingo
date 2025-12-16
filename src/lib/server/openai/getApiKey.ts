import { db } from '$lib/server/db';
import { appSettings, users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { decryptApiKey } from '$lib/server/auth/encryption';

const GLOBAL_OPENAI_API_KEY_SETTING = 'global_openai_api_key';

/**
 * Get the effective OpenAI API key for a user.
 * Priority: User's personal key > Global admin key
 * @param userId The user ID to get the API key for
 * @returns The decrypted API key or null if none is available
 */
export async function getEffectiveApiKey(userId: number): Promise<string | null> {
	// First, try to get the user's personal API key
	const [user] = await db
		.select({ openaiApiKeyEncrypted: users.openaiApiKeyEncrypted })
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	if (user?.openaiApiKeyEncrypted) {
		try {
			return decryptApiKey(user.openaiApiKeyEncrypted);
		} catch {
			// If decryption fails, fall through to global key
		}
	}

	// Fall back to global API key
	const [globalSetting] = await db
		.select({ value: appSettings.value })
		.from(appSettings)
		.where(eq(appSettings.key, GLOBAL_OPENAI_API_KEY_SETTING))
		.limit(1);

	if (globalSetting?.value) {
		try {
			return decryptApiKey(globalSetting.value);
		} catch {
			return null;
		}
	}

	return null;
}

/**
 * Get the global OpenAI API key (encrypted value) from app settings.
 * @returns The encrypted global API key or null if not set
 */
export async function getGlobalApiKeyEncrypted(): Promise<string | null> {
	const [setting] = await db
		.select({ value: appSettings.value })
		.from(appSettings)
		.where(eq(appSettings.key, GLOBAL_OPENAI_API_KEY_SETTING))
		.limit(1);

	return setting?.value ?? null;
}

/**
 * Set or update the global OpenAI API key.
 * @param encryptedKey The encrypted API key to store
 */
export async function setGlobalApiKey(encryptedKey: string): Promise<void> {
	const existing = await getGlobalApiKeyEncrypted();

	if (existing !== null) {
		await db
			.update(appSettings)
			.set({ value: encryptedKey, updatedAt: new Date() })
			.where(eq(appSettings.key, GLOBAL_OPENAI_API_KEY_SETTING));
	} else {
		await db.insert(appSettings).values({
			key: GLOBAL_OPENAI_API_KEY_SETTING,
			value: encryptedKey
		});
	}
}

/**
 * Remove the global OpenAI API key.
 */
export async function removeGlobalApiKey(): Promise<void> {
	await db
		.update(appSettings)
		.set({ value: null, updatedAt: new Date() })
		.where(eq(appSettings.key, GLOBAL_OPENAI_API_KEY_SETTING));
}

/**
 * Check if a global API key is configured.
 */
export async function hasGlobalApiKey(): Promise<boolean> {
	const encrypted = await getGlobalApiKeyEncrypted();
	return encrypted !== null && encrypted.length > 0;
}
