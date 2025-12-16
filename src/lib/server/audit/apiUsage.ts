import { db } from '$lib/server/db';
import { apiUsageLogs } from '$lib/server/db/schema';

export type ApiUsageType = 'chat' | 'voice' | 'explain';

export interface ApiUsageData {
	userId: number;
	usageType: ApiUsageType;
	sessionId?: number | null;
	promptTokens?: number;
	completionTokens?: number;
	totalTokens?: number;
	model?: string;
}

/**
 * Log API usage to the database for auditing.
 * Only call this when the global API key is being used.
 */
export async function logApiUsage(data: ApiUsageData): Promise<void> {
	try {
		await db.insert(apiUsageLogs).values({
			userId: data.userId,
			usageType: data.usageType,
			sessionId: data.sessionId ?? null,
			promptTokens: data.promptTokens ?? 0,
			completionTokens: data.completionTokens ?? 0,
			totalTokens: data.totalTokens ?? 0,
			model: data.model ?? null
		});
	} catch (error) {
		// Don't let audit logging failures break the main flow
		console.error('[Audit] Failed to log API usage:', error);
	}
}

/**
 * Extract token usage from OpenAI API response
 */
export function extractTokenUsage(data: unknown): {
	promptTokens: number;
	completionTokens: number;
	totalTokens: number;
	model: string;
} {
	const response = data as {
		usage?: {
			prompt_tokens?: number;
			completion_tokens?: number;
			total_tokens?: number;
		};
		model?: string;
	};

	return {
		promptTokens: response.usage?.prompt_tokens ?? 0,
		completionTokens: response.usage?.completion_tokens ?? 0,
		totalTokens: response.usage?.total_tokens ?? 0,
		model: response.model ?? 'unknown'
	};
}
