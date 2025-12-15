import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { chatSessions, chatMessages, users } from '$lib/server/db/schema';
import { eq, and, asc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params, locals }) => {
	const userId = locals.user!.id;
	const sessionId = parseInt(params.sessionId);

	if (isNaN(sessionId)) {
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

	// Check if user has API key configured
	const [user] = await db
		.select({ hasApiKey: users.openaiApiKeyEncrypted })
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	return {
		session,
		messages,
		hasApiKey: !!user?.hasApiKey
	};
};
