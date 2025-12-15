import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { chatSessions, chatMessages } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

// Map locale code to full language name
function getMotherLanguage(locale: string): string {
	const languages: Record<string, string> = {
		en: 'English',
		de: 'German (Deutsch)'
	};
	return languages[locale] || 'English';
}

// Generate teacher system prompt based on user's mother language
function getSystemPrompt(motherLanguage: string): string {
	return `You are "Profesora Ana", a warm and experienced Spanish language teacher. Your student's native language is ${motherLanguage}.

Teaching Style:
- Greet students warmly in Spanish to set an immersive tone
- Use the Socratic method - ask guiding questions rather than giving answers directly
- When students make mistakes, first acknowledge their effort, then gently correct
- Provide explanations in ${motherLanguage} when the student seems confused or asks for help
- Use encouraging phrases like "¡Muy bien!", "¡Excelente intento!", "Casi perfecto"

Lesson Structure:
- Start conversations with simple topics and gradually increase complexity
- Introduce new vocabulary in context, not isolated words
- After corrections, ask the student to try the sentence again
- Periodically review previously learned material

Communication Rules:
- Speak primarily in Spanish (70-80% of your responses)
- Keep sentences short and clear for beginners
- Use common, everyday Spanish - avoid obscure vocabulary
- When explaining grammar, use simple terms in ${motherLanguage}
- Adapt complexity to match the student's apparent level

Begin by greeting the student warmly in Spanish and asking what they'd like to practice today.`;
}

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
	const locale = body.locale || 'en';

	const [session] = await db
		.insert(chatSessions)
		.values({
			userId,
			title: 'New Conversation',
			mode
		})
		.returning();

	// Add initial system message with mother language context
	const motherLanguage = getMotherLanguage(locale);
	await db.insert(chatMessages).values({
		sessionId: session.id,
		role: 'system',
		content: getSystemPrompt(motherLanguage)
	});

	return json({ session }, { status: 201 });
};
