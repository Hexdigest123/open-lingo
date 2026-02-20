import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { chatSessions, chatMessages, languages, users } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

// Input validation schema for session creation
const createSessionSchema = z.object({
	mode: z.enum(['text', 'voice']).default('text'),
	locale: z.enum(['en', 'de']).default('en')
});

// Map locale code to full language name
function getMotherLanguage(locale: string): string {
	const languages: Record<string, string> = {
		en: 'English',
		de: 'German (Deutsch)'
	};
	return languages[locale] || 'English';
}

// Generate teacher system prompt based on user's mother language
function getSystemPrompt(
	motherLanguage: string,
	targetLanguage: string,
	tutorName: string
): string {
	return `You are "${tutorName}", a friendly and helpful ${targetLanguage} language tutor. Your student's native language is ${motherLanguage}.

Primary Language Rules:
- ALWAYS respond primarily in ${motherLanguage} (the student's native language)
- Only use ${targetLanguage} when providing examples, translations, or when the student explicitly asks
- EXCEPTION: If the student writes their message in ${targetLanguage}, respond primarily in ${targetLanguage} to match their preference

Response Style:
- Be helpful and directly answer what the student asks
- If they ask "How do I say X in ${targetLanguage}?" - give them the ${targetLanguage} translation with pronunciation tips
- If they ask about grammar - explain it clearly in ${motherLanguage} with ${targetLanguage} examples
- If they want to practice conversation - engage in the topic they choose
- Use encouraging phrases in ${targetLanguage} when appropriate

Examples of good responses:
- User: "How do I greet my mother in ${targetLanguage}?"
  → Respond in ${motherLanguage} explaining the greeting, then provide a ${targetLanguage} example
- User writes in ${targetLanguage}
  → Since user wrote in ${targetLanguage}, respond in ${targetLanguage}

Teaching approach:
- Be patient and supportive
- Correct mistakes gently by showing the correct form
- Adapt to the student's level based on their messages
- Keep ${targetLanguage} examples simple and practical`;
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

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid JSON' }, { status: 400 });
	}

	const parseResult = createSessionSchema.safeParse(body);
	if (!parseResult.success) {
		return json(
			{ error: 'Invalid request', details: parseResult.error.flatten().fieldErrors },
			{ status: 400 }
		);
	}

	const { mode, locale } = parseResult.data;

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
		content: getSystemPrompt(motherLanguage, targetLanguageName, tutorName)
	});

	// Add assistant intro message to kick off the conversation (in user's native language)
	const introMessages: Record<string, { text: string; voice: string }> = {
		en: {
			text: `Hi! I'm ${tutorName}, your ${targetLanguageName} tutor. How can I help you today? You can ask me things like:\n• "How do I say 'hello' in ${targetLanguageName}?"\n• "Explain this ${targetLanguageName} grammar rule"\n• "I want to practice ordering food"\n\nWhat would you like to learn?`,
			voice: `Hi! I'm ${tutorName}, your ${targetLanguageName} tutor. When you're ready, click the microphone button to start speaking. What would you like to practice today?`
		},
		de: {
			text: `Hallo! Ich bin ${tutorName}, deine ${targetLanguageName}-Lehrkraft. Wie kann ich dir heute helfen? Du kannst mich zum Beispiel fragen:\n- "Wie sagt man 'Guten Tag' auf ${targetLanguageName}?"\n- "Erkläre mir diese ${targetLanguageName}-Grammatikregel"\n- "Ich möchte üben, Essen zu bestellen"\n\nWas möchtest du lernen?`,
			voice: `Hallo! Ich bin ${tutorName}, deine ${targetLanguageName}-Lehrkraft. Wenn du bereit bist, klicke auf den Mikrofon-Button, um zu sprechen. Was möchtest du heute üben?`
		}
	};

	const messages = introMessages[locale] || introMessages.en;
	const introMessage = mode === 'voice' ? messages.voice : messages.text;

	await db.insert(chatMessages).values({
		sessionId: session.id,
		role: 'assistant',
		content: introMessage
	});

	return json({ session }, { status: 201 });
};
