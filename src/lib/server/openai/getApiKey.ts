import { db } from '$lib/server/db';
import { appSettings, users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { decryptApiKey } from '$lib/server/auth/encryption';

const GLOBAL_OPENAI_API_KEY_SETTING = 'global_openai_api_key';

export interface ApiKeyResult {
	key: string | null;
	isGlobalKey: boolean;
}

/**
 * Get the effective OpenAI API key for a user with source information.
 * Priority: User's personal key > Global admin key
 * @param userId The user ID to get the API key for
 * @returns Object containing the decrypted API key and whether it's the global key
 */
export async function getEffectiveApiKeyWithSource(userId: number): Promise<ApiKeyResult> {
	// First, try to get the user's personal API key
	const [user] = await db
		.select({ openaiApiKeyEncrypted: users.openaiApiKeyEncrypted })
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	if (user?.openaiApiKeyEncrypted) {
		try {
			const key = decryptApiKey(user.openaiApiKeyEncrypted);
			return { key, isGlobalKey: false };
		} catch (error) {
			console.error(`[Security] Failed to decrypt API key for user ${userId}:`, error);
			// Fall through to global key
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
			const key = decryptApiKey(globalSetting.value);
			return { key, isGlobalKey: true };
		} catch (error) {
			console.error('[Security] Failed to decrypt global API key:', error);
			return { key: null, isGlobalKey: false };
		}
	}

	return { key: null, isGlobalKey: false };
}

/**
 * Get the effective OpenAI API key for a user.
 * Priority: User's personal key > Global admin key
 * @param userId The user ID to get the API key for
 * @returns The decrypted API key or null if none is available
 */
export async function getEffectiveApiKey(userId: number): Promise<string | null> {
	const result = await getEffectiveApiKeyWithSource(userId);
	return result.key;
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
