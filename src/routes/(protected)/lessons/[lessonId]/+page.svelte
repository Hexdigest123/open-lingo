<script lang="ts">
	import type { PageData } from './$types';
	import { t } from '$lib/i18n/index.svelte';
	import { goto } from '$app/navigation';
	import MultipleChoiceQuestion from '$lib/components/lessons/MultipleChoiceQuestion.svelte';
	import FillBlankQuestion from '$lib/components/lessons/FillBlankQuestion.svelte';
	import TranslationQuestion from '$lib/components/lessons/TranslationQuestion.svelte';
	import MatchingQuestion from '$lib/components/lessons/MatchingQuestion.svelte';

	let { data }: { data: PageData } = $props();

	let currentIndex = $state(0);
	let hearts = $state(data.hearts);
	let xpEarned = $state(0);
	let correctCount = $state(0);
	let showFeedback = $state(false);
	let lastAnswer = $state<{ isCorrect: boolean; correctAnswer: string } | null>(null);
	let isComplete = $state(false);
	let isSubmitting = $state(false);

	const questions = data.questions;
	const totalQuestions = questions.length;

	const currentQuestion = $derived(questions[currentIndex]);
	const questionContent = $derived(currentQuestion?.content as Record<string, unknown>);

	$effect(() => {
		if (hearts <= 0 && !isComplete) {
			// Out of hearts - could show modal or redirect
		}
	});

	async function handleAnswer(answer: string) {
		if (isSubmitting || showFeedback) return;

		isSubmitting = true;
		const question = questions[currentIndex];

		const formData = new FormData();
		formData.append('questionId', question.id.toString());
		formData.append('answer', answer);

		try {
			const response = await fetch(`?/submit`, {
				method: 'POST',
				body: formData
			});

			const result = await response.json();
			const actionData = result.data ? JSON.parse(result.data) : result;

			lastAnswer = {
				isCorrect: actionData[1] || actionData.isCorrect,
				correctAnswer: actionData[2] || actionData.correctAnswer
			};

			if (lastAnswer.isCorrect) {
				xpEarned += 10;
				correctCount++;
			} else {
				hearts = Math.max(0, hearts - 1);
			}

			showFeedback = true;
		} catch (error) {
			console.error('Failed to submit answer:', error);
		} finally {
			isSubmitting = false;
		}
	}

	function nextQuestion() {
		showFeedback = false;
		lastAnswer = null;

		if (currentIndex < totalQuestions - 1) {
			currentIndex++;
		} else {
			completeLesson();
		}
	}

	async function completeLesson() {
		isComplete = true;

		const formData = new FormData();
		formData.append('score', Math.round((correctCount / totalQuestions) * 100).toString());
		formData.append('xpEarned', xpEarned.toString());

		try {
			await fetch(`?/complete`, {
				method: 'POST',
				body: formData
			});
		} catch (error) {
			console.error('Failed to complete lesson:', error);
		}
	}

	function getAccuracyMessage(accuracy: number): string {
		if (accuracy === 100) return t('lesson.complete.perfect');
		if (accuracy >= 80) return t('lesson.complete.great');
		if (accuracy >= 60) return t('lesson.complete.good');
		return t('lesson.complete.keepPracticing');
	}

	function exitLesson() {
		goto('/lessons');
	}
</script>

<svelte:head>
	<title>{data.lesson.title} - OpenLingo</title>
</svelte:head>

{#if isComplete}
	<!-- Lesson Complete Screen -->
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="card w-full max-w-md text-center">
			<div class="text-6xl">🎉</div>
			<h2 class="mt-4 text-2xl font-bold text-text-light">{t('lesson.complete.title')}</h2>
			<p class="mt-2 text-lg text-text-muted">
				{getAccuracyMessage(Math.round((correctCount / totalQuestions) * 100))}
			</p>

			<div class="mt-6 grid grid-cols-2 gap-4">
				<div class="rounded-xl bg-yellow/10 p-4">
					<div class="text-2xl font-bold text-yellow-dark">+{xpEarned}</div>
					<div class="text-sm text-text-muted">{t('lesson.complete.xpEarned')}</div>
				</div>
				<div class="rounded-xl bg-success/10 p-4">
					<div class="text-2xl font-bold text-success">
						{Math.round((correctCount / totalQuestions) * 100)}%
					</div>
					<div class="text-sm text-text-muted">{t('lesson.complete.accuracy')}</div>
				</div>
			</div>

			<button onclick={exitLesson} class="btn btn-success btn-lg mt-6 w-full">
				{t('lesson.complete.continueButton')}
			</button>
		</div>
	</div>
{:else if hearts <= 0}
	<!-- Out of Hearts Screen -->
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="card w-full max-w-md text-center">
			<div class="text-6xl">💔</div>
			<h2 class="mt-4 text-2xl font-bold text-error">{t('lesson.outOfHearts.title')}</h2>
			<p class="mt-2 text-text-muted">{t('lesson.outOfHearts.message')}</p>

			<button onclick={exitLesson} class="btn btn-primary btn-lg mt-6 w-full">
				{t('common.back')}
			</button>
		</div>
	</div>
{:else}
	<div class="mx-auto max-w-2xl">
		<!-- Header -->
		<div class="mb-6 flex items-center justify-between">
			<button onclick={exitLesson} class="text-text-muted hover:text-text-light">
				✕
			</button>

			<!-- Progress Bar -->
			<div class="flex-1 mx-4">
				<div class="progress-bar">
					<div
						class="progress-bar-fill"
						style="width: {((currentIndex + (showFeedback ? 1 : 0)) / totalQuestions) * 100}%"
					></div>
				</div>
			</div>

			<!-- Hearts -->
			<div class="flex items-center gap-1">
				<span class="text-error">❤️</span>
				<span class="font-bold text-error">{hearts}</span>
			</div>
		</div>

		<!-- Question Counter -->
		<div class="mb-4 text-center text-sm text-text-muted">
			{t('lesson.question')} {currentIndex + 1} {t('lesson.of')} {totalQuestions}
		</div>

		<!-- Question Content -->
		{#key currentQuestion.id}
			{#if currentQuestion.type === 'multiple_choice'}
				<MultipleChoiceQuestion
					questionText={questionContent.question as string}
					options={questionContent.options as string[]}
					disabled={showFeedback || isSubmitting}
					onAnswer={handleAnswer}
				/>
			{:else if currentQuestion.type === 'fill_blank'}
				<FillBlankQuestion
					sentence={questionContent.sentence as string}
					hint={questionContent.hint as string}
					disabled={showFeedback || isSubmitting}
					onAnswer={handleAnswer}
				/>
			{:else if currentQuestion.type === 'translation'}
				<TranslationQuestion
					text={questionContent.text as string}
					direction={questionContent.direction as string}
					disabled={showFeedback || isSubmitting}
					onAnswer={handleAnswer}
				/>
			{:else if currentQuestion.type === 'matching'}
				<MatchingQuestion
					pairs={questionContent.pairs as Array<{ spanish: string; english: string }>}
					disabled={showFeedback || isSubmitting}
					onAnswer={handleAnswer}
				/>
			{:else}
				<div class="card text-center">
					<p class="text-text-muted">Unknown question type: {currentQuestion.type}</p>
				</div>
			{/if}
		{/key}

		<!-- Feedback -->
		{#if showFeedback && lastAnswer}
			<div
				class="mt-6 rounded-xl p-4 {lastAnswer.isCorrect ? 'bg-success/10' : 'bg-error/10'}"
			>
				<div class="flex items-center gap-3">
					<span class="text-2xl">{lastAnswer.isCorrect ? '✅' : '❌'}</span>
					<div>
						<p class="font-bold {lastAnswer.isCorrect ? 'text-success' : 'text-error'}">
							{lastAnswer.isCorrect ? t('lesson.correct') : t('lesson.incorrect')}
						</p>
						{#if !lastAnswer.isCorrect}
							<p class="text-sm text-text-muted">
								{t('lesson.correctAnswer')}: <span class="font-medium">{lastAnswer.correctAnswer}</span>
							</p>
						{/if}
					</div>
				</div>

				<button
					onclick={nextQuestion}
					class="btn {lastAnswer.isCorrect ? 'btn-success' : 'btn-primary'} btn-lg mt-4 w-full"
				>
					{t('lesson.continue')}
				</button>
			</div>
		{/if}
	</div>
{/if}
