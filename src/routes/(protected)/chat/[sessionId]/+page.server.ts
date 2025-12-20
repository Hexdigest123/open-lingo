import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { chatSessions, chatMessages, users } from '$lib/server/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { hasGlobalApiKey } from '$lib/server/openai/getApiKey';

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const load: PageServerLoad = async ({ params, locals }) => {
	const userId = locals.user!.id;
	const sessionId = params.sessionId;

	if (!UUID_REGEX.test(sessionId)) {
		error(404, 'Session not found');
	}

	// Get session (verify ownership)
	const [session] = await db
		.select()
		.from(chatSessions)
		.where(and(eq(chatSessions.id, sessionId), eq(chatSessions.userId, userId)))
		.limit(1);

	if (!session) {
		error(404, 'Session not found');
	}

	// Get messages
	const messages = await db
		.select()
		.from(chatMessages)
		.where(eq(chatMessages.sessionId, sessionId))
		.orderBy(asc(chatMessages.createdAt));

	// Check if user has API key configured (personal or global)
	const [user] = await db
		.select({ hasPersonalApiKey: users.openaiApiKeyEncrypted })
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	const hasGlobalKey = await hasGlobalApiKey();
	const hasApiKey = !!user?.hasPersonalApiKey || hasGlobalKey;

	return {
		session,
		messages,
		hasApiKey
	};
};
