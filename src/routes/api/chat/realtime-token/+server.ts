import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { decryptApiKey } from '$lib/server/auth/encryption';

const SYSTEM_PROMPT = `You are a friendly Spanish language teacher helping users practice conversational Spanish.

Guidelines:
- Speak primarily in Spanish, but explain in English when the user seems confused or asks for help
- Correct pronunciation and grammar gently - don't be harsh about mistakes
- Keep responses conversational and encouraging
- Focus on practical, everyday Spanish that would be useful for beginners and intermediate learners
- If the user makes a mistake, correct it naturally by using the correct form in your response
- Ask follow-up questions to keep the conversation going
- Occasionally praise good usage of Spanish
- Adapt your language complexity to match the user's apparent level

Start by greeting the user in Spanish and asking how you can help them practice today.`;

export const POST: RequestHandler = async ({ locals }) => {
	const userId = locals.user?.id;
	if (!userId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	// Get user's encrypted API key
	const [user] = await db
		.select({ openaiApiKeyEncrypted: users.openaiApiKeyEncrypted })
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	if (!user?.openaiApiKeyEncrypted) {
		return json({ error: 'OpenAI API key not configured' }, { status: 400 });
	}

	const apiKey = decryptApiKey(user.openaiApiKeyEncrypted);

	try {
		// Create ephemeral token via OpenAI REST API
		const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${apiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: 'gpt-4o-realtime-preview-2024-12-17',
				voice: 'verse',
				instructions: SYSTEM_PROMPT,
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

		return json({
			client_secret: session.client_secret,
			expires_at: session.expires_at
		});
	} catch (error) {
		console.error('Realtime token error:', error);
		return json({ error: 'Failed to create realtime session' }, { status: 500 });
	}
};
