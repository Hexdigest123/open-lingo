import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { chatSessions, users } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { hasGlobalApiKey } from '$lib/server/openai/getApiKey';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user!.id;

	// Get user's chat sessions
	const sessions = await db
		.select()
		.from(chatSessions)
		.where(eq(chatSessions.userId, userId))
		.orderBy(desc(chatSessions.updatedAt));

	// Check if user has API key configured (personal or global)
	const [user] = await db
		.select({ hasPersonalApiKey: users.openaiApiKeyEncrypted })
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	const hasGlobalKey = await hasGlobalApiKey();
	const hasApiKey = !!user?.hasPersonalApiKey || hasGlobalKey;

	return {
		sessions,
		hasApiKey
	};
};
