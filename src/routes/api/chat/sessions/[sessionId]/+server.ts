import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { chatSessions, chatMessages } from '$lib/server/db/schema';
import { eq, and, asc } from 'drizzle-orm';

// GET: Get a specific session with its messages
export const GET: RequestHandler = async ({ params, locals }) => {
	const userId = locals.user?.id;
	const sessionId = parseInt(params.sessionId);

	if (!userId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	if (isNaN(sessionId)) {
		return json({ error: 'Invalid session ID' }, { status: 400 });
	}

	// Get session (verify ownership)
	const [session] = await db
		.select()
		.from(chatSessions)
		.where(and(eq(chatSessions.id, sessionId), eq(chatSessions.userId, userId)))
		.limit(1);

	if (!session) {
		return json({ error: 'Session not found' }, { status: 404 });
	}

	// Get messages
	const messages = await db
		.select()
		.from(chatMessages)
		.where(eq(chatMessages.sessionId, sessionId))
		.orderBy(asc(chatMessages.createdAt));

	return json({ session, messages });
};

// POST: Add a message to a session
export const POST: RequestHandler = async ({ params, locals, request }) => {
	const userId = locals.user?.id;
	const sessionId = parseInt(params.sessionId);

	if (!userId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	if (isNaN(sessionId)) {
		return json({ error: 'Invalid session ID' }, { status: 400 });
	}

	// Verify session ownership
	const [session] = await db
		.select()
		.from(chatSessions)
		.where(and(eq(chatSessions.id, sessionId), eq(chatSessions.userId, userId)))
		.limit(1);

	if (!session) {
		return json({ error: 'Session not found' }, { status: 404 });
	}

	const { role, content } = await request.json();

	if (!role || !content) {
		return json({ error: 'Role and content are required' }, { status: 400 });
	}

	if (!['user', 'assistant', 'system'].includes(role)) {
		return json({ error: 'Invalid role' }, { status: 400 });
	}

	// Insert message
	const [message] = await db
		.insert(chatMessages)
		.values({
			sessionId,
			role,
			content
		})
		.returning();

	// Update session timestamp
	await db
		.update(chatSessions)
		.set({ updatedAt: new Date() })
		.where(eq(chatSessions.id, sessionId));

	return json({ message });
};

// DELETE: Delete a session
export const DELETE: RequestHandler = async ({ params, locals }) => {
	const userId = locals.user?.id;
	const sessionId = parseInt(params.sessionId);

	if (!userId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	if (isNaN(sessionId)) {
		return json({ error: 'Invalid session ID' }, { status: 400 });
	}

	// Delete session (cascade will delete messages)
	const result = await db
		.delete(chatSessions)
		.where(and(eq(chatSessions.id, sessionId), eq(chatSessions.userId, userId)))
		.returning();

	if (result.length === 0) {
		return json({ error: 'Session not found' }, { status: 404 });
	}

	return json({ success: true });
};
