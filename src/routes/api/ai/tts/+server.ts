import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getEffectiveApiKeyWithSource } from '$lib/server/openai/getApiKey';
import { logApiUsage } from '$lib/server/audit/apiUsage';
import { z } from 'zod';

// Input validation schema
const ttsRequestSchema = z.object({
	text: z.string().min(1).max(500),
	voice: z.enum(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']).default('nova'),
	speed: z.number().min(0.25).max(4.0).default(1.0)
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

	const parseResult = ttsRequestSchema.safeParse(body);
	if (!parseResult.success) {
		return json(
			{ error: 'Invalid request', details: parseResult.error.flatten().fieldErrors },
			{ status: 400 }
		);
	}

	const { text, voice, speed } = parseResult.data;

	// Get effective API key (user's key or global fallback)
	const { key: apiKey, isGlobalKey } = await getEffectiveApiKeyWithSource(userId);

	if (!apiKey) {
		return json(
			{ error: 'OpenAI API key not configured. Please set your API key in settings.' },
			{ status: 400 }
		);
	}

	try {
		const response = await fetch('https://api.openai.com/v1/audio/speech', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: 'tts-1',
				input: text,
				voice: voice,
				speed: speed,
				response_format: 'mp3'
			})
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error('OpenAI TTS API error:', errorText);
			return json({ error: 'Failed to generate audio' }, { status: 500 });
		}

		// Log usage if global key was used (estimate tokens based on text length)
		if (isGlobalKey) {
			// TTS pricing is per character, roughly estimate as tokens
			const estimatedTokens = Math.ceil(text.length / 4);
			await logApiUsage({
				userId,
				usageType: 'voice',
				promptTokens: estimatedTokens,
				completionTokens: 0,
				totalTokens: estimatedTokens,
				model: 'tts-1'
			});
		}

		// Return audio as base64
		const audioBuffer = await response.arrayBuffer();
		const base64Audio = Buffer.from(audioBuffer).toString('base64');

		return json({
			audio: base64Audio,
			contentType: 'audio/mpeg'
		});
	} catch (error) {
		console.error('Failed to generate TTS:', error);
		return json({ error: 'Failed to generate audio' }, { status: 500 });
	}
};
