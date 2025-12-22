import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getEffectiveApiKeyWithSource } from '$lib/server/openai/getApiKey';
import { logApiUsage } from '$lib/server/audit/apiUsage';

// Map locale code to full language name
function getMotherLanguage(locale: string): string {
	const languages: Record<string, string> = {
		en: 'English',
		de: 'German (Deutsch)'
	};
	return languages[locale] || 'English';
}

// Generate voice teacher system prompt based on user's mother language
function getVoiceSystemPrompt(motherLanguage: string): string {
	return `You are "Profesora Ana", a warm and experienced Spanish language teacher conducting a voice conversation. Your student's native language is ${motherLanguage}.

Voice Teaching Style:
- Speak clearly and at a moderate pace - this is a spoken conversation
- Greet students warmly in Spanish to set an immersive tone
- When students make mistakes, first acknowledge their effort, then gently correct
- Provide explanations in ${motherLanguage} when the student seems confused or asks for help
- Use encouraging phrases like "¡Muy bien!", "¡Excelente intento!", "Casi perfecto"
- Keep responses concise - aim for 2-3 sentences to maintain natural conversation flow

Teaching Approach:
- Focus on conversational Spanish and pronunciation practice
- Introduce new vocabulary naturally within context
- After corrections, invite the student to try the phrase again
- Ask follow-up questions to keep the conversation flowing

Communication Rules:
- Speak primarily in Spanish (70-80% of your responses)
- Keep sentences short and clear
- Use common, everyday Spanish - avoid obscure vocabulary
- When explaining grammar, use simple terms in ${motherLanguage}
- Adapt your pace and complexity to the student's level

Begin by greeting the student warmly in Spanish and asking what they'd like to practice today.`;
}

export const POST: RequestHandler = async ({ locals, request }) => {
	const userId = locals.user?.id;
	if (!userId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	// Get locale from request body
	const body = await request.json().catch(() => ({}));
	const locale = body.locale || 'en';
	const motherLanguage = getMotherLanguage(locale);

	// Get effective API key (user's key or global fallback)
	const { key: apiKey, isGlobalKey } = await getEffectiveApiKeyWithSource(userId);

	if (!apiKey) {
		return json({ error: 'OpenAI API key not configured. Please set your API key in settings or contact an administrator.' }, { status: 400 });
	}

	try {
		// Create ephemeral token via OpenAI REST API
		const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${apiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: 'gpt-4o-mini-realtime-preview-2024-12-17',
				voice: 'verse',
				instructions: getVoiceSystemPrompt(motherLanguage),
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
