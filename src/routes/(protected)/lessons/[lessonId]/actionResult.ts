export type SubmitActionPayload = {
	isCorrect: boolean;
	correctAnswer: string;
	freezeEarned?: boolean;
};

type ActionResponse = {
	type?: string;
	data?: unknown;
};

function isPayloadShape(payload: unknown): payload is SubmitActionPayload {
	return Boolean(
		payload && typeof payload === 'object' && 'isCorrect' in payload && 'correctAnswer' in payload
	);
}

export function extractSubmitActionPayload(result: unknown): SubmitActionPayload | null {
	const response = (result ?? {}) as ActionResponse;

	if (response.type === 'failure' || response.type === 'error') {
		return null;
	}

	const payload = response.data ?? result;

	if (Array.isArray(payload)) {
		if (payload.length >= 3) {
			return {
				isCorrect: Boolean(payload[1]),
				correctAnswer: String(payload[2])
			};
		}
		return null;
	}

	if (isPayloadShape(payload)) {
		return {
			isCorrect: Boolean(payload.isCorrect),
			correctAnswer: String(payload.correctAnswer),
			freezeEarned: 'freezeEarned' in payload ? Boolean(payload.freezeEarned) : undefined
		};
	}

	return null;
}
