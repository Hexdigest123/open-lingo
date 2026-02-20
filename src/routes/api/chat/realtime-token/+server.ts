import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { languages, users } from '$lib/server/db/schema';
import { getEffectiveApiKeyWithSource } from '$lib/server/openai/getApiKey';
import { logApiUsage } from '$lib/server/audit/apiUsage';
import { eq } from 'drizzle-orm';
import { getMotherLanguage, getVoiceSystemPrompt } from '$lib/server/openai/prompts';

export const POST: RequestHandler = async ({ locals, request }) => {
	const userId = locals.user?.id;
	if (!userId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	// Get locale from request body
	const body = await request.json().catch(() => ({}));
	const locale = body.locale || 'en';
	const motherLanguage = getMotherLanguage(locale);

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

	try {
		// Create ephemeral token via OpenAI REST API
		const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: 'gpt-4o-mini-realtime-preview-2024-12-17',
				voice: 'verse',
				instructions: getVoiceSystemPrompt(motherLanguage, targetLanguageName, tutorName),
				input_audio_transcription: {
					model: 'whisper-1'
				},
				turn_detection: {
					type: 'server_vad',
					threshold: 0.5,
					prefix_padding_ms: 300,
					silence_duration_ms: 500
				}
			})
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
			console.error('OpenAI Realtime session error:', error);
			return json(
				{ error: error.error?.message || 'Failed to create realtime session' },
				{ status: response.status }
			);
		}

		const session = await response.json();

		// Log voice session if global key was used
		// Note: We can't track actual token usage for realtime sessions
		if (isGlobalKey) {
			await logApiUsage({
				userId,
				usageType: 'voice',
				model: 'gpt-4o-mini-realtime-preview'
			});
		}

		return json({
			client_secret: session.client_secret,
			expires_at: session.expires_at
		});
	} catch (error) {
		console.error('Realtime token error:', error);
		return json({ error: 'Failed to create realtime session' }, { status: 500 });
	}
};
