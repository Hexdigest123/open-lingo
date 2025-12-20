import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { chatSessions, chatMessages, users } from '$lib/server/db/schema';
import { eq, asc } from 'drizzle-orm';

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const load: PageServerLoad = async ({ params }) => {
	const sessionId = params.sessionId;

	if (!UUID_REGEX.test(sessionId)) {
		error(400, 'Invalid session ID');
	}

	// Get session with user info
	const [session] = await db
		.select({
			id: chatSessions.id,
			title: chatSessions.title,
			mode: chatSessions.mode,
			createdAt: chatSessions.createdAt,
			updatedAt: chatSessions.updatedAt,
			userId: chatSessions.userId,
			userEmail: users.email,
			userDisplayName: users.displayName
		})
		.from(chatSessions)
		.innerJoin(users, eq(chatSessions.userId, users.id))
		.where(eq(chatSessions.id, sessionId))
		.limit(1);

	if (!session) {
		error(404, 'Session not found');
	}

	// Get all messages
	const messages = await db
		.select({
			id: chatMessages.id,
			role: chatMessages.role,
			content: chatMessages.content,
			createdAt: chatMessages.createdAt
		})
		.from(chatMessages)
		.where(eq(chatMessages.sessionId, sessionId))
		.orderBy(asc(chatMessages.createdAt));

	return {
		session,
		messages
	};
};
