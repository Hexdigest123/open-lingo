import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getEffectiveApiKeyWithSource } from '$lib/server/openai/getApiKey';
import { logApiUsage } from '$lib/server/audit/apiUsage';
import { z } from 'zod';

// Input validation schema
const evaluateSpeechRequestSchema = z.object({
	expectedText: z.string().min(1).max(500),
	audioBase64: z.string().min(1),
	locale: z.enum(['en', 'de']).default('en')
});

// Calculate similarity between two strings (Levenshtein distance based)
function calculateSimilarity(str1: string, str2: string): number {
	const s1 = str1.toLowerCase().trim();
	const s2 = str2.toLowerCase().trim();

	if (s1 === s2) return 1;
	if (s1.length === 0 || s2.length === 0) return 0;

	const matrix: number[][] = [];

	// Initialize matrix
	for (let i = 0; i <= s1.length; i++) {
		matrix[i] = [i];
	}
	for (let j = 0; j <= s2.length; j++) {
		matrix[0][j] = j;
	}

	// Fill matrix
	for (let i = 1; i <= s1.length; i++) {
		for (let j = 1; j <= s2.length; j++) {
			const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
			matrix[i][j] = Math.min(
				matrix[i - 1][j] + 1, // deletion
				matrix[i][j - 1] + 1, // insertion
				matrix[i - 1][j - 1] + cost // substitution
			);
		}
	}

	const maxLen = Math.max(s1.length, s2.length);
	return 1 - matrix[s1.length][s2.length] / maxLen;
}

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

	const parseResult = evaluateSpeechRequestSchema.safeParse(body);
	if (!parseResult.success) {
		return json(
			{ error: 'Invalid request', details: parseResult.error.flatten().fieldErrors },
			{ status: 400 }
		);
	}

	const { expectedText, audioBase64, locale } = parseResult.data;

	// Get effective API key (user's key or global fallback)
	const { key: apiKey, isGlobalKey } = await getEffectiveApiKeyWithSource(userId);

	if (!apiKey) {
		return json(
			{ error: 'OpenAI API key not configured. Please set your API key in settings.' },
			{ status: 400 }
		);
	}

	try {
		// Convert base64 to buffer for upload
		const audioBuffer = Buffer.from(audioBase64, 'base64');

		// Create form data for Whisper API
		const formData = new FormData();
		formData.append('file', new Blob([audioBuffer], { type: 'audio/webm' }), 'audio.webm');
		formData.append('model', 'whisper-1');
		formData.append('language', 'es'); // Spanish transcription

		const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`
			},
			body: formData
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error('OpenAI Whisper API error:', errorText);
			return json({ error: 'Failed to transcribe audio' }, { status: 500 });
		}

		const data = await response.json();
		const transcript = data.text || '';

		// Calculate similarity
		const similarity = calculateSimilarity(transcript, expectedText);
		const isCorrect = similarity >= 0.75; // 75% threshold for "correct"

		// Generate feedback based on similarity
		let feedback: string;
		if (locale === 'de') {
			if (similarity >= 0.9) {
				feedback = 'Ausgezeichnete Aussprache!';
			} else if (similarity >= 0.75) {
				feedback = 'Gute Aussprache! Weiter so.';
			} else if (similarity >= 0.5) {
				feedback = 'Fast richtig! Versuche es noch einmal.';
			} else {
				feedback = 'Versuche es noch einmal. Höre dir das Wort an und wiederhole es langsam.';
			}
		} else {
			if (similarity >= 0.9) {
				feedback = 'Excellent pronunciation!';
			} else if (similarity >= 0.75) {
				feedback = 'Good pronunciation! Keep it up.';
			} else if (similarity >= 0.5) {
				feedback = 'Almost there! Try again.';
			} else {
				feedback = 'Try again. Listen to the word and repeat it slowly.';
			}
		}

		// Log usage if global key was used
		if (isGlobalKey) {
			// Estimate based on audio duration (roughly 1 token per 0.1 seconds)
			const estimatedTokens = Math.ceil(audioBuffer.length / 1000);
			await logApiUsage({
				userId,
				usageType: 'voice',
				promptTokens: estimatedTokens,
				completionTokens: 0,
				totalTokens: estimatedTokens,
				model: 'whisper-1'
			});
		}

		return json({
			transcript,
			similarity,
			isCorrect,
			feedback,
			expectedText
		});
	} catch (error) {
		console.error('Failed to evaluate speech:', error);
		return json({ error: 'Failed to evaluate speech' }, { status: 500 });
	}
};
