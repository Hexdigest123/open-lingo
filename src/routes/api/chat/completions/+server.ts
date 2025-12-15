import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { chatSessions, chatMessages, users } from '$lib/server/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { decryptApiKey } from '$lib/server/auth/encryption';

export const POST: RequestHandler = async ({ request, locals }) => {
	const userId = locals.user?.id;

	if (!userId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const body = await request.json();
	const { sessionId, message } = body;

	if (!sessionId || !message) {
		return json({ error: 'Session ID and message are required' }, { status: 400 });
	}

	// Get user's API key
	const [user] = await db
		.select({ apiKey: users.openaiApiKeyEncrypted })
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	if (!user?.apiKey) {
		return json({ error: 'OpenAI API key not configured' }, { status: 400 });
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

	// Save user message
	await db.insert(chatMessages).values({
		sessionId,
		role: 'user',
		content: message
	});

	// Get conversation history
	const history = await db
		.select()
		.from(chatMessages)
		.where(eq(chatMessages.sessionId, sessionId))
		.orderBy(asc(chatMessages.createdAt));

	// Build messages array for OpenAI
	const messages = history.map((m) => ({
		role: m.role as 'system' | 'user' | 'assistant',
		content: m.content
	}));

	try {
		const apiKey = decryptApiKey(user.apiKey);

		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: 'gpt-4o',
				messages,
				temperature: 0.8,
				max_tokens: 500
			})
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error('OpenAI API error:', errorText);
			return json({ error: 'Failed to get response from AI' }, { status: 500 });
		}

		const data = await response.json();
		const assistantMessage = data.choices?.[0]?.message?.content || 'Lo siento, no pude responder.';

		// Save assistant message
		const [savedMessage] = await db
			.insert(chatMessages)
			.values({
				sessionId,
				role: 'assistant',
				content: assistantMessage
			})
			.returning();

		// Update session title if it's the first real exchange
		if (history.length <= 2) {
			// Generate a title from the first user message
			const title = message.length > 50 ? message.substring(0, 47) + '...' : message;
			await db
				.update(chatSessions)
				.set({ title, updatedAt: new Date() })
				.where(eq(chatSessions.id, sessionId));
		} else {
			// Just update the timestamp
			await db
				.update(chatSessions)
				.set({ updatedAt: new Date() })
				.where(eq(chatSessions.id, sessionId));
		}

		return json({ message: savedMessage });
	} catch (error) {
		console.error('Failed to get chat completion:', error);
		return json({ error: 'Failed to get response' }, { status: 500 });
	}
};
