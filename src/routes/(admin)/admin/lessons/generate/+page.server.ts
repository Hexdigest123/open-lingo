import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { lessons, units, levels, questions, languages } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getEffectiveApiKey, hasGlobalApiKey } from '$lib/server/openai/getApiKey';

interface GeneratedQuestion {
	type:
		| 'multiple_choice'
		| 'fill_blank'
		| 'translation'
		| 'matching'
		| 'word_order'
		| 'speaking'
		| 'listening';
	content: {
		questionEn?: string;
		questionDe?: string;
		options?: string[];
		sentenceEn?: string;
		sentenceDe?: string;
		hintEn?: string;
		hintDe?: string;
		textEn?: string;
		textDe?: string;
		text?: string;
		direction?: 'native_to_target' | 'target_to_native';
		pairs?: { target: string; english: string; german?: string }[];
		words?: string[];
		instructionEn?: string;
		instructionDe?: string;
		textToSpeak?: string;
		textToHear?: string;
		answerType?: 'type' | 'multiple_choice';
	};
	correctAnswer: string;
}

interface GeneratedLesson {
	title: string;
	titleDe?: string;
	description: string;
	descriptionDe?: string;
	questions: GeneratedQuestion[];
}

export const load: PageServerLoad = async ({ locals }) => {
	// Check if user has API key or global key is available
	const userId = locals.user!.id;
	const apiKey = await getEffectiveApiKey(userId);
	const hasGlobal = await hasGlobalApiKey();

	const unitList = await db
		.select({
			id: units.id,
			title: units.title,
			levelCode: levels.code,
			levelName: levels.name,
			languageCode: levels.languageCode,
			languageName: languages.name
		})
		.from(units)
		.innerJoin(levels, eq(units.levelId, levels.id))
		.innerJoin(languages, eq(levels.languageCode, languages.code))
		.orderBy(languages.order, levels.order, units.order);

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
			return fail(400, {
				error:
					'Please configure your OpenAI API key in Settings, or ask an administrator to set a global key.'
			});
		}

		const [unitInfo] = await db
			.select({
				title: units.title,
				levelCode: levels.code,
				languageCode: levels.languageCode,
				languageName: languages.name
			})
			.from(units)
			.innerJoin(levels, eq(units.levelId, levels.id))
			.innerJoin(languages, eq(levels.languageCode, languages.code))
			.where(eq(units.id, unitId))
			.limit(1);

		if (!unitInfo) {
			return fail(400, { error: 'Unit not found' });
		}

		const langName = unitInfo.languageName;

		try {
			const generatedLesson = await generateLessonWithAI(
				apiKey,
				topic,
				unitInfo.levelCode,
				questionCount,
				difficulty,
				langName
			);

			// Get the highest order for this unit
			const [maxOrder] = await db
				.select({ maxOrder: lessons.order })
				.from(lessons)
				.where(eq(lessons.unitId, unitId))
				.orderBy(desc(lessons.order))
				.limit(1);

			const order = (maxOrder?.maxOrder || 0) + 1;

			// Build JSON objects for translations
			const title = JSON.stringify({
				en: generatedLesson.title,
				de: generatedLesson.titleDe || generatedLesson.title
			});
			const description = generatedLesson.description
				? JSON.stringify({
						en: generatedLesson.description,
						de: generatedLesson.descriptionDe || generatedLesson.description
					})
				: null;

			// Insert the lesson
			const [newLesson] = await db
				.insert(lessons)
				.values({
					title,
					description,
					unitId,
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
	difficulty: string,
	langName: string = 'Spanish'
): Promise<GeneratedLesson> {
	const mcCount = Math.floor(questionCount * 0.2);
	const fillCount = Math.floor(questionCount * 0.2);
	const transCount = Math.floor(questionCount * 0.15);
	const matchCount = Math.floor(questionCount * 0.15);
	const wordOrderCount = Math.floor(questionCount * 0.15);
	const speakingCount = Math.floor(questionCount * 0.08);
	const listeningCount =
		questionCount - mcCount - fillCount - transCount - matchCount - wordOrderCount - speakingCount;

	const prompt = `You are a ${langName} language teacher creating a lesson about "${topic}" for CEFR level ${level} (${difficulty} difficulty).

Generate a complete ${langName} lesson in JSON format with:
1. A lesson title in English (short and descriptive)
2. A lesson title in German (translation of the English title)
3. A brief description in English (1-2 sentences)
4. A brief description in German (translation of the English description)
5. ${questionCount} questions distributed as follows:
   - ${mcCount} multiple_choice questions
   - ${fillCount} fill_blank questions
   - ${transCount} translation questions
   - ${matchCount} matching questions (4 pairs each)
   - ${wordOrderCount} word_order questions
   - ${speakingCount} speaking questions
   - ${listeningCount} listening questions

For level ${level}:
- A1: Very basic vocabulary (greetings, numbers, colors, family)
- A2: Elementary vocabulary (travel, shopping, daily routines)
- B1: Intermediate vocabulary (opinions, experiences, plans)
- B2: Upper-intermediate vocabulary (abstract topics, nuanced expressions)
- C1: Advanced vocabulary (academic, professional, idiomatic)
- C2: Mastery-level vocabulary (idioms, nuances, literary expressions)

Return ONLY valid JSON in this exact format (note the En/De suffixes for bilingual support):
{
  "title": "Lesson Title Here",
  "titleDe": "Lektionstitel hier",
  "description": "Brief description of what students will learn",
  "descriptionDe": "Kurze Beschreibung dessen, was die Schüler lernen werden",
  "questions": [
    {
      "type": "multiple_choice",
      "content": {
        "questionEn": "How do you say 'hello' in ${langName}?",
        "questionDe": "Wie sagt man 'Hallo' auf ${langName}?",
        "options": ["Option1", "Option2", "Option3", "Option4"]
      },
      "correctAnswer": "Option1"
    },
    {
      "type": "fill_blank",
      "content": {
        "sentenceEn": "Complete: _____ ...",
        "sentenceDe": "Vervollständige: _____ ...",
        "hintEn": "English hint",
        "hintDe": "German hint"
      },
      "correctAnswer": "answer"
    },
    {
      "type": "translation",
      "content": {
        "textEn": "English text",
        "textDe": "German text",
        "direction": "native_to_target"
      },
      "correctAnswer": "target language answer"
    },
    {
      "type": "translation",
      "content": {
        "text": "Target language text",
        "direction": "target_to_native"
      },
      "correctAnswer": "English|German"
    },
    {
      "type": "matching",
      "content": {
        "pairs": [
          {"target": "word1", "english": "Hello", "german": "Hallo"},
          {"target": "word2", "english": "Goodbye", "german": "Auf Wiedersehen"},
          {"target": "word3", "english": "Thank you", "german": "Danke"},
          {"target": "word4", "english": "Please", "german": "Bitte"}
        ]
      },
      "correctAnswer": "all_matched"
    },
    {
      "type": "word_order",
      "content": {
        "words": ["word1", "word2", "word3"],
        "instructionEn": "Arrange to say: 'phrase'",
        "instructionDe": "Ordne: 'phrase'"
      },
      "correctAnswer": "word1 word2 word3"
    },
    {
      "type": "speaking",
      "content": {
        "textToSpeak": "target language phrase",
        "hintEn": "English hint",
        "hintDe": "German hint"
      },
      "correctAnswer": "target language phrase"
    },
    {
      "type": "listening",
      "content": {
        "textToHear": "target language phrase",
        "answerType": "type"
      },
      "correctAnswer": "target language phrase"
    }
  ]
}

IMPORTANT RULES:
- All multiple_choice questions must have exactly 4 options
- Fill_blank sentences MUST contain "_____" (5 underscores) for the blank
- Translation direction: use "native_to_target" (English/German to ${langName}) or "target_to_native" (${langName} to English/German)
- For target_to_native translations, correctAnswer can have alternatives separated by | (e.g., "Hello|Hallo")
- Matching questions must have exactly 4 pairs with target, english, and german fields
- Word_order: provide words array and both English and German instructions
- Speaking: textToSpeak is the ${langName} text to pronounce, with English/German hints
- Listening: textToHear is ${langName}, answerType is always "type"
- Make content educational and appropriate for ${level} level
- Use vocabulary related to "${topic}"
- Ensure German translations are accurate and natural`;

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
					content: `You are a helpful ${langName} language teacher. Always respond with valid JSON only, no markdown formatting.`
				},
				{ role: 'user', content: prompt }
			],
			temperature: 0.7,
			max_tokens: 8000
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

	// Transform questions to ensure they match the expected schema
	const transformedQuestions = parsed.questions.map(transformQuestion);

	return {
		title: parsed.title,
		titleDe: parsed.titleDe,
		description: parsed.description,
		descriptionDe: parsed.descriptionDe,
		questions: transformedQuestions
	};
}

/**
 * Transform a question to ensure it matches the expected schema.
 * Handles cases where AI returns old format fields.
 */
function transformQuestion(q: GeneratedQuestion): GeneratedQuestion {
	const content = { ...q.content };

	switch (q.type) {
		case 'multiple_choice':
			// Convert old 'question' field to 'questionEn'
			if ('question' in content && !content.questionEn) {
				content.questionEn = (content as Record<string, unknown>).question as string;
				delete (content as Record<string, unknown>).question;
			}
			break;

		case 'fill_blank':
			// Convert old 'sentence' and 'hint' fields
			if ('sentence' in content && !content.sentenceEn) {
				content.sentenceEn = (content as Record<string, unknown>).sentence as string;
				delete (content as Record<string, unknown>).sentence;
			}
			if ('hint' in content && !content.hintEn) {
				content.hintEn = (content as Record<string, unknown>).hint as string;
				delete (content as Record<string, unknown>).hint;
			}
			break;

		case 'translation': {
			const dir = content.direction as string;
			if (dir === 'en_to_es' || dir === 'native_to_es') {
				content.direction = 'native_to_target';
			} else if (dir === 'es_to_en' || dir === 'es_to_native') {
				content.direction = 'target_to_native';
			}
			if (content.direction === 'native_to_target' && 'text' in content && !content.textEn) {
				content.textEn = content.text as string;
				delete content.text;
			}
			break;
		}

		case 'matching':
			if (content.pairs) {
				content.pairs = content.pairs.map((p: Record<string, string>) => ({
					target: p.target || p.spanish,
					english: p.english,
					german: p.german || ''
				}));
			}
			break;
	}

	return {
		type: q.type,
		content,
		correctAnswer: q.correctAnswer
	};
}
