<script lang="ts">
	import type { PageData } from './$types';
	import { deserialize } from '$app/forms';
	import { goto } from '$app/navigation';
	import { i18n, t } from '$lib/i18n/index.svelte';
	import MultipleChoiceQuestion from '$lib/components/lessons/MultipleChoiceQuestion.svelte';
	import FillBlankQuestion from '$lib/components/lessons/FillBlankQuestion.svelte';
	import TranslationQuestion from '$lib/components/lessons/TranslationQuestion.svelte';
	import MatchingQuestion from '$lib/components/lessons/MatchingQuestion.svelte';
	import WordOrderQuestion from '$lib/components/lessons/WordOrderQuestion.svelte';
	import SpeakingQuestion from '$lib/components/lessons/SpeakingQuestion.svelte';
	import ListeningQuestion from '$lib/components/lessons/ListeningQuestion.svelte';

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

	function getLocalized(content: Record<string, unknown>, keyPrefix: string): string {
		const en = content[`${keyPrefix}En`];
		const de = content[`${keyPrefix}De`];
		const fallback = content[keyPrefix];

		if (i18n.locale === 'de' && typeof de === 'string') return de;
		if (typeof en === 'string') return en;
		return typeof fallback === 'string' ? fallback : '';
	}

	function getOptions(content: Record<string, unknown>): string[] {
		const deOptions = content.optionsDe;
		const enOptions = content.optionsEn;
		const fallback = content.options;

		if (i18n.locale === 'de' && Array.isArray(deOptions)) {
			return deOptions.filter((value): value is string => typeof value === 'string');
		}
		if (Array.isArray(enOptions)) {
			return enOptions.filter((value): value is string => typeof value === 'string');
		}
		if (Array.isArray(fallback)) {
			return fallback.filter((value): value is string => typeof value === 'string');
		}
		return [];
	}

	function getPairs(content: Record<string, unknown>): Array<{ target: string; english: string }> {
		const pairs = content.pairs;
		if (!Array.isArray(pairs)) return [];

		return pairs
			.filter(
				(value): value is Record<string, unknown> => typeof value === 'object' && value !== null
			)
			.map((pair) => ({
				target:
					typeof pair.target === 'string'
						? pair.target
						: typeof pair.spanish === 'string'
							? pair.spanish
							: '',
				english:
					i18n.locale === 'de' && typeof pair.german === 'string'
						? pair.german
						: typeof pair.english === 'string'
							? pair.english
							: ''
			}));
	}

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
	<title>{t('placement.title')} - OpenLingo</title>
</svelte:head>

{#if isComplete}
	<div class="mx-auto max-w-2xl space-y-4 card text-center">
		<div class="text-6xl">🏁</div>
		<h1 class="text-2xl font-bold text-text-light">
			{t('placement.complete')}
		</h1>
		<p class="text-lg text-text-light">
			{t('placement.yourLevel', { level: completedLevel || estimatedLevel })}
		</p>
		<p class="text-sm text-text-muted">
			{t('placement.explanation')}
		</p>
		<button class="btn btn-primary" onclick={() => goto('/skills')}
			>{t('placement.goToSkills')}</button
		>
	</div>
{:else if !activeSession}
	<div class="mx-auto max-w-2xl space-y-6 card text-center">
		<div class="text-6xl">🧭</div>
		<h1 class="text-2xl font-bold text-text-light">
			{t('placement.title')}
		</h1>
		<p class="text-text-muted">
			{t('placement.description')}
		</p>
		<button class="btn btn-primary" onclick={beginPlacement} disabled={isSubmitting}
			>{t('placement.start')}</button
		>
	</div>
{:else if currentQuestion}
	<div class="mx-auto max-w-2xl space-y-6">
		<div class="card">
			<div class="flex items-center justify-between gap-3">
				<p class="text-sm text-text-muted">
					{t('placement.questionOf', {
						current: Math.min(questionsAnswered + 1, maxQuestions),
						total: maxQuestions
					})}
				</p>
				<p class="rounded-full bg-primary/15 px-3 py-1 text-sm font-semibold text-primary">
					{t('placement.estimatedLevel', { level: estimatedLevel })}
				</p>
			</div>
		</div>

		{#if currentQuestion.type === 'multiple_choice'}
			<MultipleChoiceQuestion
				questionText={getLocalized(currentQuestion.content, 'question')}
				options={getOptions(currentQuestion.content)}
				disabled={showFeedback || isSubmitting}
				onAnswer={submitAnswer}
			/>
		{:else if currentQuestion.type === 'fill_blank'}
			<FillBlankQuestion
				sentence={getLocalized(currentQuestion.content, 'sentence')}
				hint={getLocalized(currentQuestion.content, 'hint')}
				disabled={showFeedback || isSubmitting}
				onAnswer={submitAnswer}
			/>
		{:else if currentQuestion.type === 'translation'}
			<TranslationQuestion
				text={typeof currentQuestion.content.text === 'string' ? currentQuestion.content.text : ''}
				textEn={typeof currentQuestion.content.textEn === 'string'
					? currentQuestion.content.textEn
					: ''}
				textDe={typeof currentQuestion.content.textDe === 'string'
					? currentQuestion.content.textDe
					: ''}
				direction={typeof currentQuestion.content.direction === 'string'
					? currentQuestion.content.direction
					: ''}
				targetLanguageName={data.languageCode.toUpperCase()}
				disabled={showFeedback || isSubmitting}
				onAnswer={submitAnswer}
			/>
		{:else if currentQuestion.type === 'matching'}
			<MatchingQuestion
				pairs={getPairs(currentQuestion.content)}
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
				instructionEn={typeof currentQuestion.content.instructionEn === 'string'
					? currentQuestion.content.instructionEn
					: ''}
				instructionDe={typeof currentQuestion.content.instructionDe === 'string'
					? currentQuestion.content.instructionDe
					: ''}
				disabled={showFeedback || isSubmitting}
				onAnswer={submitAnswer}
			/>
		{:else if currentQuestion.type === 'speaking'}
			<SpeakingQuestion
				textToSpeak={typeof currentQuestion.content.textToSpeak === 'string'
					? currentQuestion.content.textToSpeak
					: ''}
				hintEn={typeof currentQuestion.content.hintEn === 'string'
					? currentQuestion.content.hintEn
					: ''}
				hintDe={typeof currentQuestion.content.hintDe === 'string'
					? currentQuestion.content.hintDe
					: ''}
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
				options={getOptions(currentQuestion.content)}
				hasApiKey={false}
				disabled={showFeedback || isSubmitting}
				onAnswer={submitAnswer}
			/>
		{:else}
			<div class="card text-center">
				<p class="text-text-muted">
					{t('learn.unsupportedType')}
				</p>
				<button
					class="btn btn-primary mt-4"
					onclick={() => submitAnswer(currentQuestion.correctAnswer)}>{t('learn.continue')}</button
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
					{feedback.isCorrect ? t('learn.correct') : t('learn.incorrect')}
				</p>
				{#if !feedback.isCorrect}
					<p class="mt-1 text-sm text-text-muted">
						{t('learn.correctAnswerWas', { answer: feedback.correctAnswer })}
					</p>
				{/if}
				{#if !isComplete}
					<button class="btn btn-primary mt-4 w-full" onclick={nextStep}
						>{t('learn.continue')}</button
					>
				{/if}
			</div>
		{/if}
	</div>
{/if}
