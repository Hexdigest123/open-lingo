import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { chatSessions, chatMessages } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

// GET: List all chat sessions for the current user
export const GET: RequestHandler = async ({ locals }) => {
	const userId = locals.user?.id;

	if (!userId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const sessions = await db
		.select()
		.from(chatSessions)
		.where(eq(chatSessions.userId, userId))
		.orderBy(desc(chatSessions.updatedAt));

	return json({ sessions });
};

// POST: Create a new chat session
export const POST: RequestHandler = async ({ request, locals }) => {
	const userId = locals.user?.id;

	if (!userId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const body = await request.json();
	const mode = body.mode || 'text';

	const [session] = await db
		.insert(chatSessions)
		.values({
			userId,
			title: 'New Conversation',
			mode
		})
		.returning();

	// Add initial system message
	await db.insert(chatMessages).values({
		sessionId: session.id,
		role: 'system',
		content: `You are a friendly Spanish language teacher helping users practice conversational Spanish.
- Speak primarily in Spanish but explain in English when needed
- Correct pronunciation and grammar gently
- Keep responses conversational and encouraging
- Focus on practical, everyday Spanish
- Start by greeting the user in Spanish and asking how you can help them practice today.`
	});

	return json({ session }, { status: 201 });
};
