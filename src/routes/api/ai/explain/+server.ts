import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { users, questions, userQuestionAttempts } from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { decryptApiKey } from '$lib/server/auth/encryption';

export const POST: RequestHandler = async ({ request, locals }) => {
	const userId = locals.user?.id;

	if (!userId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const body = await request.json();
	const { questionId, userAnswer } = body;

	if (!questionId || !userAnswer) {
		return json({ error: 'Question ID and user answer are required' }, { status: 400 });
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

	// Get the question details
	const [question] = await db
		.select()
		.from(questions)
		.where(eq(questions.id, questionId))
		.limit(1);

	if (!question) {
		return json({ error: 'Question not found' }, { status: 404 });
	}

	// Build context based on question type
	const content = question.content as Record<string, unknown>;
	let questionContext = '';

	switch (question.type) {
		case 'multiple_choice':
			questionContext = `Question: ${content.question}\nOptions: ${(content.options as string[]).join(', ')}`;
			break;
		case 'fill_blank':
			questionContext = `Fill in the blank: ${content.sentence}${content.hint ? `\nHint: ${content.hint}` : ''}`;
			break;
		case 'translation':
			questionContext = `Translate from ${content.direction === 'en_to_es' ? 'English to Spanish' : 'Spanish to English'}: "${content.text}"`;
			break;
		case 'matching':
			questionContext = `Match Spanish words with English translations`;
			break;
		default:
			questionContext = `Question type: ${question.type}`;
	}

	try {
		const apiKey = decryptApiKey(user.apiKey);

		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: 'gpt-4o-mini',
				messages: [
					{
						role: 'system',
						content: `You are a helpful Spanish language tutor. A student got a question wrong and needs help understanding why. Provide a brief, encouraging explanation (2-3 sentences) about:
1. Why their answer was incorrect
2. Why the correct answer is right
3. A helpful tip to remember this concept

Be concise, friendly, and educational. Use simple language.`
					},
					{
						role: 'user',
						content: `${questionContext}

Student's answer: "${userAnswer}"
Correct answer: "${question.correctAnswer}"

Please explain why this was wrong and help me understand the correct answer.`
					}
				],
				temperature: 0.7,
				max_tokens: 200
			})
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error('OpenAI API error:', errorText);
			return json({ error: 'Failed to get explanation from AI' }, { status: 500 });
		}

		const data = await response.json();
		const explanation = data.choices?.[0]?.message?.content || 'Unable to generate explanation.';

		// Store the explanation in the most recent attempt for this question
		const [latestAttempt] = await db
			.select()
			.from(userQuestionAttempts)
			.where(
				and(eq(userQuestionAttempts.userId, userId), eq(userQuestionAttempts.questionId, questionId))
			)
			.orderBy(desc(userQuestionAttempts.createdAt))
			.limit(1);

		if (latestAttempt) {
			await db
				.update(userQuestionAttempts)
				.set({ aiFeedback: explanation })
				.where(eq(userQuestionAttempts.id, latestAttempt.id));
		}

		return json({ explanation });
	} catch (error) {
		console.error('Failed to get AI explanation:', error);
		return json({ error: 'Failed to get explanation' }, { status: 500 });
	}
};
