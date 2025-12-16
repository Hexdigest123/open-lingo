import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { lessons, units, levels, questions } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getEffectiveApiKey, hasGlobalApiKey } from '$lib/server/openai/getApiKey';

interface GeneratedQuestion {
	type: 'multiple_choice' | 'fill_blank' | 'translation' | 'matching';
	content: {
		question?: string;
		options?: string[];
		sentence?: string;
		hint?: string;
		text?: string;
		direction?: string;
		pairs?: { spanish: string; english: string }[];
	};
	correctAnswer: string;
}

interface GeneratedLesson {
	title: string;
	description: string;
	questions: GeneratedQuestion[];
}

export const load: PageServerLoad = async ({ locals }) => {
	// Check if user has API key or global key is available
	const userId = locals.user!.id;
	const apiKey = await getEffectiveApiKey(userId);
	const hasGlobal = await hasGlobalApiKey();

	// Get all units for selection
	const unitList = await db
		.select({
			id: units.id,
			title: units.title,
			levelCode: levels.code,
			levelName: levels.name
		})
		.from(units)
		.innerJoin(levels, eq(units.levelId, levels.id))
		.orderBy(levels.order, units.order);

	return {
		hasApiKey: !!apiKey,
		hasGlobalApiKey: hasGlobal,
		units: unitList
	};
};

export const actions: Actions = {
	generate: async ({ request, locals }) => {
		const userId = locals.user!.id;
		const data = await request.formData();

		const unitId = parseInt(data.get('unitId')?.toString() || '0');
		const topic = data.get('topic')?.toString().trim();
		const questionCount = parseInt(data.get('questionCount')?.toString() || '50');
		const difficulty = data.get('difficulty')?.toString() || 'intermediate';

		if (!unitId || !topic) {
			return fail(400, { error: 'Unit and topic are required' });
		}

		// Get effective API key (user's key or global fallback)
		const apiKey = await getEffectiveApiKey(userId);

		if (!apiKey) {
			return fail(400, { error: 'Please configure your OpenAI API key in Settings, or ask an administrator to set a global key.' });
		}

		// Get unit info for context
		const [unitInfo] = await db
			.select({
				title: units.title,
				levelCode: levels.code
			})
			.from(units)
			.innerJoin(levels, eq(units.levelId, levels.id))
			.where(eq(units.id, unitId))
			.limit(1);

		if (!unitInfo) {
			return fail(400, { error: 'Unit not found' });
		}

		try {
			// Generate lesson content using OpenAI
			const generatedLesson = await generateLessonWithAI(
				apiKey,
				topic,
				unitInfo.levelCode,
				questionCount,
				difficulty
			);

			// Get the highest order for this unit
			const [maxOrder] = await db
				.select({ maxOrder: lessons.order })
				.from(lessons)
				.where(eq(lessons.unitId, unitId))
				.orderBy(desc(lessons.order))
				.limit(1);

			const order = (maxOrder?.maxOrder || 0) + 1;

			// Insert the lesson
			const [newLesson] = await db
				.insert(lessons)
				.values({
					title: generatedLesson.title,
					description: generatedLesson.description,
					unitId,
					type: 'vocabulary',
					xpReward: Math.ceil(questionCount / 5) * 5, // 10 XP per 5 questions
					order,
					isPublished: false // Start as draft
				})
				.returning();

			// Insert all questions
			const questionInserts = generatedLesson.questions.map((q, index) => ({
				lessonId: newLesson.id,
				type: q.type,
				content: q.content,
				correctAnswer: q.correctAnswer,
				order: index + 1
			}));

			await db.insert(questions).values(questionInserts);

			return {
				success: true,
				lessonId: newLesson.id,
				message: `Successfully generated "${generatedLesson.title}" with ${generatedLesson.questions.length} questions`
			};
		} catch (error) {
			console.error('Failed to generate lesson:', error);
			const message = error instanceof Error ? error.message : 'Failed to generate lesson';
			return fail(500, { error: message });
		}
	}
};

async function generateLessonWithAI(
	apiKey: string,
	topic: string,
	level: string,
	questionCount: number,
	difficulty: string
): Promise<GeneratedLesson> {
	const mcCount = Math.floor(questionCount * 0.3); // 30% multiple choice
	const fillCount = Math.floor(questionCount * 0.3); // 30% fill in blank
	const transCount = Math.floor(questionCount * 0.2); // 20% translation
	const matchCount = questionCount - mcCount - fillCount - transCount; // Rest matching

	const prompt = `You are a Spanish language teacher creating a lesson about "${topic}" for CEFR level ${level} (${difficulty} difficulty).

Generate a complete Spanish lesson in JSON format with:
1. A lesson title (in English)
2. A brief description (in English)
3. ${questionCount} questions distributed as follows:
   - ${mcCount} multiple choice questions (asking how to say English words in Spanish)
   - ${fillCount} fill in the blank questions (Spanish sentences with one word blanked out)
   - ${transCount} translation questions (mix of English to Spanish and Spanish to English)
   - ${matchCount} matching questions (groups of 4 Spanish-English word pairs each)

For level ${level}:
- A1: Use very basic vocabulary (greetings, numbers, colors, family)
- A2: Use elementary vocabulary (travel, shopping, daily routines)
- B1: Use intermediate vocabulary (opinions, experiences, plans)
- B2: Use upper-intermediate vocabulary (abstract topics, nuanced expressions)
- C1: Use advanced vocabulary (academic, professional, idiomatic)
- C2: Use mastery-level vocabulary (idioms, nuances, literary expressions)

Return ONLY valid JSON in this exact format:
{
  "title": "Lesson Title Here",
  "description": "Brief description of what students will learn",
  "questions": [
    {
      "type": "multiple_choice",
      "content": {
        "question": "How do you say 'hello' in Spanish?",
        "options": ["Hola", "Adiós", "Gracias", "Por favor"]
      },
      "correctAnswer": "Hola"
    },
    {
      "type": "fill_blank",
      "content": {
        "sentence": "_____ días, señor.",
        "hint": "Good morning"
      },
      "correctAnswer": "Buenos"
    },
    {
      "type": "translation",
      "content": {
        "text": "Good night",
        "direction": "en_to_es"
      },
      "correctAnswer": "Buenas noches"
    },
    {
      "type": "matching",
      "content": {
        "pairs": [
          {"spanish": "Hola", "english": "Hello"},
          {"spanish": "Adiós", "english": "Goodbye"},
          {"spanish": "Gracias", "english": "Thank you"},
          {"spanish": "Por favor", "english": "Please"}
        ]
      },
      "correctAnswer": "all_matched"
    }
  ]
}

Important:
- All multiple choice questions must have exactly 4 options
- Fill in blank sentences should use "_____" for the blank
- Translation questions should have "direction" as either "en_to_es" or "es_to_en"
- Matching questions should have exactly 4 pairs each
- Make the content educational and appropriate for the ${level} level
- Use vocabulary related to "${topic}"`;

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
					content:
						'You are a helpful Spanish language teacher. Always respond with valid JSON only, no markdown formatting.'
				},
				{ role: 'user', content: prompt }
			],
			temperature: 0.7,
			max_tokens: 4000
		})
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(
			errorData.error?.message || `OpenAI API error: ${response.status} ${response.statusText}`
		);
	}

	const result = await response.json();
	const content = result.choices?.[0]?.message?.content;

	if (!content) {
		throw new Error('No content returned from OpenAI');
	}

	// Parse the JSON response (handle potential markdown code blocks)
	let jsonContent = content.trim();
	if (jsonContent.startsWith('```json')) {
		jsonContent = jsonContent.slice(7);
	}
	if (jsonContent.startsWith('```')) {
		jsonContent = jsonContent.slice(3);
	}
	if (jsonContent.endsWith('```')) {
		jsonContent = jsonContent.slice(0, -3);
	}

	const parsed = JSON.parse(jsonContent.trim()) as GeneratedLesson;

	// Validate the response
	if (!parsed.title || !parsed.questions || !Array.isArray(parsed.questions)) {
		throw new Error('Invalid response format from OpenAI');
	}

	return parsed;
}
