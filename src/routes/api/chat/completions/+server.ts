import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { chatSessions, chatMessages, languages, users } from '$lib/server/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { getEffectiveApiKeyWithSource } from '$lib/server/openai/getApiKey';
import { getMotherLanguage, getChatSystemPrompt } from '$lib/server/openai/prompts';
import { logApiUsage, extractTokenUsage } from '$lib/server/audit/apiUsage';
import { z } from 'zod';

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Input validation schema
const completionRequestSchema = z.object({
	sessionId: z.string().regex(UUID_REGEX, 'Invalid session ID format'),
	message: z.string().min(1).max(4000),
	locale: z.enum(['en', 'de']).default('en')
});

export const POST: RequestHandler = async ({ request, locals }) => {
	const userId = locals.user?.id;

	if (!userId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid JSON' }, { status: 400 });
	}

	const parseResult = completionRequestSchema.safeParse(body);
	if (!parseResult.success) {
		return json(
			{ error: 'Invalid request', details: parseResult.error.flatten().fieldErrors },
			{ status: 400 }
		);
	}

	const { sessionId, message, locale } = parseResult.data;

	// Get effective API key (user's key or global fallback)
	const { key: apiKey, isGlobalKey } = await getEffectiveApiKeyWithSource(userId);

	if (!apiKey) {
		return json(
			{
				error:
					'OpenAI API key not configured. Please set your API key in settings or contact an administrator.'
			},
			{ status: 400 }
		);
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

	// Fetch user's current active language for a fresh system prompt
	const [userLanguage] = await db
		.select({ activeLanguage: users.activeLanguage })
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	const activeLanguageCode = userLanguage?.activeLanguage ?? 'es';

	let [language] = await db
		.select({ name: languages.name, tutorName: languages.tutorName })
		.from(languages)
		.where(eq(languages.code, activeLanguageCode))
		.limit(1);

	if (!language && activeLanguageCode !== 'es') {
		[language] = await db
			.select({ name: languages.name, tutorName: languages.tutorName })
			.from(languages)
			.where(eq(languages.code, 'es'))
			.limit(1);
	}

	const targetLanguageName = language?.name ?? 'Target Language';
	const tutorName = language?.tutorName ?? 'AI Tutor';
	const motherLanguage = getMotherLanguage(locale);

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

	// Build messages with a fresh system prompt reflecting the user's current
	// learning language, replacing any stale stored system message
	const freshSystemPrompt = getChatSystemPrompt(motherLanguage, targetLanguageName, tutorName);

	const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
		{ role: 'system', content: freshSystemPrompt },
		...history
			.filter((m) => m.role !== 'system')
			.map((m) => ({
				role: m.role as 'user' | 'assistant',
				content: m.content
			}))
	];

	try {
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
		const assistantMessage =
			data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

		// Log usage if global key was used
		if (isGlobalKey) {
			const tokenUsage = extractTokenUsage(data);
			await logApiUsage({
				userId,
				usageType: 'chat',
				sessionId,
				...tokenUsage
			});
		}

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
