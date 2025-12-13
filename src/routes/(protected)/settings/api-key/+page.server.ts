import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { encryptApiKey } from '$lib/server/auth/encryption';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user!.id;

	const [user] = await db
		.select({ hasApiKey: users.openaiApiKeyEncrypted })
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	return {
		hasApiKey: !!user?.hasApiKey
	};
};

export const actions: Actions = {
	save: async ({ request, locals }) => {
		const userId = locals.user!.id;
		const data = await request.formData();
		const apiKey = data.get('apiKey')?.toString().trim();

		if (!apiKey) {
			return fail(400, { error: 'API key is required' });
		}

		// Validate API key format (starts with sk-)
		if (!apiKey.startsWith('sk-')) {
			return fail(400, { error: 'Invalid API key format. Key should start with sk-' });
		}

		try {
			const encrypted = encryptApiKey(apiKey);

			await db
				.update(users)
				.set({ openaiApiKeyEncrypted: encrypted })
				.where(eq(users.id, userId));

			return { success: true, message: 'API key saved successfully' };
		} catch (error) {
			console.error('Failed to save API key:', error);
			return fail(500, { error: 'Failed to save API key' });
		}
	},

	remove: async ({ locals }) => {
		const userId = locals.user!.id;

		try {
			await db
				.update(users)
				.set({ openaiApiKeyEncrypted: null })
				.where(eq(users.id, userId));

			return { success: true, message: 'API key removed' };
		} catch (error) {
			console.error('Failed to remove API key:', error);
			return fail(500, { error: 'Failed to remove API key' });
		}
	}
};
