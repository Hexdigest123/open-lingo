import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { languages, users } from '$lib/server/db/schema';
import { eq, asc } from 'drizzle-orm';
import { encryptApiKey } from '$lib/server/auth/encryption';
import { hasGlobalApiKey } from '$lib/server/openai/getApiKey';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user!.id;

	if (locals.user!.onboardingCompleted) {
		redirect(303, '/dashboard');
	}

	const availableLanguages = await db
		.select({
			code: languages.code,
			name: languages.name,
			nativeName: languages.nativeName,
			flagEmoji: languages.flagEmoji
		})
		.from(languages)
		.where(eq(languages.isActive, true))
		.orderBy(asc(languages.order));

	const [[user], globalKeyAvailable] = await Promise.all([
		db
			.select({ activeLanguage: users.activeLanguage })
			.from(users)
			.where(eq(users.id, userId))
			.limit(1),
		hasGlobalApiKey()
	]);

	return {
		availableLanguages,
		activeLanguage: user?.activeLanguage ?? null,
		hasGlobalKey: globalKeyAvailable
	};
};

export const actions: Actions = {
	setLanguage: async ({ request, locals }) => {
		const userId = locals.user!.id;
		const data = await request.formData();
		const languageCode = data.get('languageCode')?.toString().trim();

		if (!languageCode) {
			return fail(400, { languageError: 'Please select a language' });
		}

		const [language] = await db
			.select({ code: languages.code })
			.from(languages)
			.where(eq(languages.code, languageCode))
			.limit(1);

		if (!language) {
			return fail(400, { languageError: 'Invalid language' });
		}

		await db
			.update(users)
			.set({ activeLanguage: languageCode, updatedAt: new Date() })
			.where(eq(users.id, userId));

		return { languageSuccess: true };
	},

	setApiKey: async ({ request, locals }) => {
		const userId = locals.user!.id;
		const data = await request.formData();
		const apiKey = data.get('apiKey')?.toString().trim();

		if (!apiKey) {
			return fail(400, { apiKeyError: 'API key is required' });
		}

		if (!apiKey.startsWith('sk-')) {
			return fail(400, { apiKeyError: 'Invalid API key format. Key should start with sk-' });
		}

		try {
			const encrypted = encryptApiKey(apiKey);
			await db
				.update(users)
				.set({ openaiApiKeyEncrypted: encrypted, updatedAt: new Date() })
				.where(eq(users.id, userId));

			return { apiKeySuccess: true };
		} catch {
			return fail(500, { apiKeyError: 'Failed to save API key' });
		}
	},

	complete: async ({ locals }) => {
		const userId = locals.user!.id;

		await db
			.update(users)
			.set({ onboardingCompleted: true, updatedAt: new Date() })
			.where(eq(users.id, userId));

		redirect(303, '/dashboard');
	}
};
