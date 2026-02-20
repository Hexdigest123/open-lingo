<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import type { PageData } from './$types';
	import { deserialize } from '$app/forms';
	import { goto } from '$app/navigation';
	import MultipleChoiceQuestion from '$lib/components/lessons/MultipleChoiceQuestion.svelte';
	import FillBlankQuestion from '$lib/components/lessons/FillBlankQuestion.svelte';
	import TranslationQuestion from '$lib/components/lessons/TranslationQuestion.svelte';
	import MatchingQuestion from '$lib/components/lessons/MatchingQuestion.svelte';
	import WordOrderQuestion from '$lib/components/lessons/WordOrderQuestion.svelte';
	import SpeakingQuestion from '$lib/components/lessons/SpeakingQuestion.svelte';
	import ListeningQuestion from '$lib/components/lessons/ListeningQuestion.svelte';
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

		{#if currentQuestion.type === 'multiple_choice'}
			<MultipleChoiceQuestion
				questionText={(currentQuestion.content.question as string) ?? ''}
				options={(currentQuestion.content.options as string[]) ?? []}
				disabled={showFeedback || isSubmitting}
				onAnswer={submitAnswer}
			/>
		{:else if currentQuestion.type === 'fill_blank'}
			<FillBlankQuestion
				sentence={(currentQuestion.content.sentence as string) ?? ''}
				hint={(currentQuestion.content.hint as string) ?? ''}
				disabled={showFeedback || isSubmitting}
				onAnswer={submitAnswer}
			/>
		{:else if currentQuestion.type === 'translation'}
			<TranslationQuestion
				text={typeof currentQuestion.content.text === 'string' ? currentQuestion.content.text : ''}
				direction={typeof currentQuestion.content.direction === 'string'
					? currentQuestion.content.direction
					: ''}
				targetLanguageName={data.languageCode.toUpperCase()}
				disabled={showFeedback || isSubmitting}
				onAnswer={submitAnswer}
			/>
		{:else if currentQuestion.type === 'matching'}
			<MatchingQuestion
				pairs={Array.isArray(currentQuestion.content.pairs)
					? (currentQuestion.content.pairs as any[])
					: []}
				targetLanguageName={data.languageCode.toUpperCase()}
				disabled={showFeedback || isSubmitting}
				onAnswer={submitAnswer}
			/>
		{:else if currentQuestion.type === 'word_order'}
			<WordOrderQuestion
				words={Array.isArray(currentQuestion.content.words)
					? currentQuestion.content.words.filter(
							(value): value is string => typeof value === 'string'
						)
					: []}
				instruction={typeof currentQuestion.content.instruction === 'string'
					? currentQuestion.content.instruction
					: ''}
				disabled={showFeedback || isSubmitting}
				onAnswer={submitAnswer}
			/>
		{:else if currentQuestion.type === 'speaking'}
			<SpeakingQuestion
				textToSpeak={typeof currentQuestion.content.textToSpeak === 'string'
					? currentQuestion.content.textToSpeak
					: ''}
				hint={typeof currentQuestion.content.hint === 'string' ? currentQuestion.content.hint : ''}
				hasApiKey={false}
				disabled={showFeedback || isSubmitting}
				onAnswer={submitAnswer}
			/>
		{:else if currentQuestion.type === 'listening'}
			<ListeningQuestion
				textToHear={typeof currentQuestion.content.textToHear === 'string'
					? currentQuestion.content.textToHear
					: ''}
				answerType={typeof currentQuestion.content.answerType === 'string' &&
				(currentQuestion.content.answerType === 'type' ||
					currentQuestion.content.answerType === 'multiple_choice')
					? currentQuestion.content.answerType
					: 'type'}
				options={(currentQuestion.content.options as string[]) ?? []}
				hasApiKey={false}
				disabled={showFeedback || isSubmitting}
				onAnswer={submitAnswer}
			/>
		{:else}
			<div class="card text-center">
				<p class="text-text-muted">
					{m['learn.unsupportedType']()}
				</p>
				<button
					class="btn btn-primary mt-4"
					onclick={() => submitAnswer(currentQuestion.correctAnswer)}
					>{m['learn.continue']()}</button
				>
			</div>
		{/if}

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
