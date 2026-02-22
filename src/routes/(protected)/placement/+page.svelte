<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import type { PageData } from './$types';
	import { deserialize } from '$app/forms';
	import { goto } from '$app/navigation';
	import QuestionRenderer from '$lib/components/lessons/QuestionRenderer.svelte';
	import { Flag, Compass } from 'lucide-svelte';

	type PlacementQuestion = {
		id: number;
		type: string;
		content: Record<string, unknown>;
		correctAnswer: string;
	};

	type NextQuestionPayload = {
		question: PlacementQuestion;
		estimatedLevel: string;
	};

	type ActiveSession = {
		id: number;
		currentLevel: string;
		questionsAnswered: number;
	};

	let { data }: { data: PageData } = $props();

	let activeSession = $state((data.activeSession as ActiveSession | null) ?? null);
	let nextQuestionPayload = $state((data.nextQuestion as NextQuestionPayload | null) ?? null);
	let estimatedLevel = $state(
		nextQuestionPayload?.estimatedLevel ?? activeSession?.currentLevel ?? 'A2'
	);
	let questionsAnswered = $state(activeSession?.questionsAnswered ?? 0);
	let showFeedback = $state(false);
	let feedback = $state<{ isCorrect: boolean; correctAnswer: string } | null>(null);
	let isSubmitting = $state(false);
	let completedLevel = $state('');
	let isComplete = $state(false);

	const maxQuestions = data.maxQuestions ?? 25;
	const currentQuestion = $derived(nextQuestionPayload?.question ?? null);

	async function beginPlacement() {
		if (isSubmitting) return;
		isSubmitting = true;

		const response = await fetch('?/start', {
			method: 'POST',
			body: new FormData()
		});

		const result = deserialize(await response.text());
		if (result.type === 'success') {
			const payload = result.data as {
				sessionId: number;
				nextQuestion?: NextQuestionPayload;
				estimatedLevel: string;
				questionsAnswered: number;
			};

			activeSession = {
				id: payload.sessionId,
				currentLevel: payload.estimatedLevel,
				questionsAnswered: payload.questionsAnswered
			};
			nextQuestionPayload = payload.nextQuestion ?? null;
			estimatedLevel = payload.estimatedLevel;
			questionsAnswered = payload.questionsAnswered;
		}

		isSubmitting = false;
	}

	async function submitAnswer(answer: string) {
		if (!activeSession || !currentQuestion || isSubmitting || showFeedback) return;

		isSubmitting = true;
		const formData = new FormData();
		formData.append('sessionId', String(activeSession.id));
		formData.append('questionId', String(currentQuestion.id));
		formData.append('answer', answer);

		const response = await fetch('?/answer', {
			method: 'POST',
			body: formData
		});

		const result = deserialize(await response.text());
		if (result.type === 'success') {
			const payload = result.data as {
				isCorrect: boolean;
				correctAnswer: string;
				nextQuestion: NextQuestionPayload | null;
				estimatedLevel: string;
				questionsAnswered: number;
			};

			feedback = {
				isCorrect: payload.isCorrect,
				correctAnswer: payload.correctAnswer
			};
			showFeedback = true;
			nextQuestionPayload = payload.nextQuestion;
			estimatedLevel = payload.estimatedLevel;
			questionsAnswered = payload.questionsAnswered;

			if (!payload.nextQuestion) {
				await completePlacement();
			}
		}

		isSubmitting = false;
	}

	async function completePlacement() {
		if (!activeSession) return;

		const formData = new FormData();
		formData.append('sessionId', String(activeSession.id));

		const response = await fetch('?/complete', {
			method: 'POST',
			body: formData
		});

		const result = deserialize(await response.text());
		if (result.type === 'success') {
			const payload = result.data as { estimatedLevel: string };
			completedLevel = payload.estimatedLevel;
			isComplete = true;
		}
	}

	function nextStep() {
		showFeedback = false;
		feedback = null;
	}
</script>

<svelte:head>
	<title>{m['placement.title']()} - OpenLingo</title>
</svelte:head>

{#if isComplete}
	<div class="mx-auto max-w-2xl space-y-4 card text-center">
		<div class="flex justify-center">
			<Flag size={64} class="text-success" />
		</div>
		<h1 class="text-2xl font-bold text-text-light">
			{m['placement.complete']()}
		</h1>
		<p class="text-lg text-text-light">
			{m['placement.yourLevel']({ level: completedLevel || estimatedLevel })}
		</p>
		<p class="text-sm text-text-muted">
			{m['placement.explanation']()}
		</p>
		<button class="btn btn-primary" onclick={() => goto('/skills')}
			>{m['placement.goToSkills']()}</button
		>
	</div>
{:else if !activeSession}
	<div class="mx-auto max-w-2xl space-y-6 card text-center">
		<div class="flex justify-center">
			<Compass size={64} class="text-primary" />
		</div>
		<h1 class="text-2xl font-bold text-text-light">
			{m['placement.title']()}
		</h1>
		<p class="text-text-muted">
			{m['placement.description']()}
		</p>
		<button class="btn btn-primary" onclick={beginPlacement} disabled={isSubmitting}
			>{m['placement.start']()}</button
		>
	</div>
{:else if currentQuestion}
	<div class="mx-auto max-w-2xl space-y-6">
		<div class="card">
			<div class="flex items-center justify-between gap-3">
				<p class="text-sm text-text-muted">
					{m['placement.questionOf']({
						current: Math.min(questionsAnswered + 1, maxQuestions),
						total: maxQuestions
					})}
				</p>
				<p class="rounded-full bg-primary/15 px-3 py-1 text-sm font-semibold text-primary">
					{m['placement.estimatedLevel']({ level: estimatedLevel })}
				</p>
			</div>
		</div>

		<QuestionRenderer
			type={currentQuestion.type}
			content={currentQuestion.content}
			disabled={showFeedback || isSubmitting}
			hasApiKey={false}
			targetLanguageName={data.languageCode.toUpperCase()}
			correctAnswer={currentQuestion.correctAnswer}
			onAnswer={submitAnswer}
		/>

		{#if showFeedback && feedback}
			<div
				class="rounded-xl border p-4 {feedback.isCorrect
					? 'border-success bg-success/10'
					: 'border-error bg-error/10'}"
			>
				<p class="font-semibold {feedback.isCorrect ? 'text-success' : 'text-error'}">
					{feedback.isCorrect ? m['learn.correct']() : m['learn.incorrect']()}
				</p>
				{#if !feedback.isCorrect}
					<p class="mt-1 text-sm text-text-muted">
						{m['learn.correctAnswerWas']({ answer: feedback.correctAnswer })}
					</p>
				{/if}
				{#if !isComplete}
					<button class="btn btn-primary mt-4 w-full" onclick={nextStep}
						>{m['learn.continue']()}</button
					>
				{/if}
			</div>
		{/if}
	</div>
{/if}
