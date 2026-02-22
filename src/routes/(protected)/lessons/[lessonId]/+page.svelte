<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';
	import type { PageData } from './$types';
	import { goto, invalidateAll } from '$app/navigation';
	import { deserialize } from '$app/forms';
	import QuestionRenderer from '$lib/components/lessons/QuestionRenderer.svelte';
	import AiExplanation from '$lib/components/lessons/AiExplanation.svelte';
	import AnimatedCounter from '$lib/components/ui/AnimatedCounter.svelte';
	import { PartyPopper, HeartCrack, Heart, CircleCheck, CircleX, Bot, X } from 'lucide-svelte';
	import {
		celebrateFirstCorrectToday,
		celebrateAchievement
	} from '$lib/stores/celebrations.svelte';
	import {
		playCorrect,
		playIncorrect,
		playCombo,
		playAchievement,
		playStreak,
		playLevelUp,
		playStreakMilestone
	} from '$lib/stores/sounds.svelte';

	type SubmitActionData = {
		success: boolean;
		isCorrect: boolean;
		correctAnswer: string;
		freezeEarned?: boolean;
		hearts?: number;
		xpAwarded?: number;
		firstCorrectToday?: boolean;
		streakMilestone?: number | null;
		previousLevel?: number;
		newLevel?: number;
	};

	type CompleteActionData = {
		completed: boolean;
		xpEarned: number;
		score: number;
		accuracy: number;
		timeTakenSeconds: number | null;
		previousScore: number | null;
		gemsEarned: number;
		newAchievements?: string[];
	};

	type ActiveLanguage = {
		code: string;
		name: string;
		nativeName: string;
		flagEmoji: string;
		whisperCode: string;
		tutorName: string;
		tutorGreeting: string | null;
	};

	let { data }: { data: PageData & { activeLanguage?: ActiveLanguage } } = $props();

	let currentIndex = $state(0);
	let hearts = $state(data.hearts);
	let xpEarned = $state(0);
	let correctCount = $state(0);
	let showFeedback = $state(false);
	let lastAnswer = $state<{ isCorrect: boolean; correctAnswer: string } | null>(null);
	let isComplete = $state(false);
	let isSubmitting = $state(false);
	let lastUserAnswer = $state<string>('');
	let aiExplanation = $state<string | null>(null);
	let isLoadingExplanation = $state(false);
	let explanationError = $state<string | null>(null);
	let showOutOfHeartsModal = $state(data.hearts <= 0 && !data.isRevision && data.heartsEnabled);
	let startTime = $state(Date.now());
	let consecutiveCorrect = $state(0);
	let comboMultiplier = $state(1);
	let comboPulse = $state(false);
	let baseXpEarned = $state(0);
	let comboBonusXpEarned = $state(0);
	let completionData = $state<CompleteActionData | null>(null);

	const questions = data.questions;
	const totalQuestions = questions.length;

	const currentQuestion = $derived(questions[currentIndex]);
	const questionContent = $derived(currentQuestion?.content as Record<string, unknown>);
	const accuracyPercent = $derived(Math.round((correctCount / totalQuestions) * 100));
	const improvementAmount = $derived(
		completionData?.previousScore !== null && completionData?.previousScore !== undefined
			? accuracyPercent - completionData.previousScore
			: 0
	);
	const improvementBonusXp = $derived(improvementAmount > 0 ? 5 : 0);
	const totalCompletionXp = $derived(xpEarned + improvementBonusXp);
	const completionTimeLabel = $derived(formatTimeTaken(completionData?.timeTakenSeconds));

	// Modal is shown directly when hearts hit 0, not via effect (to avoid timing issues)

	async function fetchExplanation() {
		if (isLoadingExplanation || !lastUserAnswer) return;

		isLoadingExplanation = true;
		explanationError = null;

		try {
			const response = await fetch('/api/ai/explain', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					questionId: currentQuestion.id,
					userAnswer: lastUserAnswer,
					locale: getLocale()
				})
			});

			const result = await response.json();

			if (!response.ok) {
				explanationError = result.error || m['lesson.explanation.error']();
			} else {
				aiExplanation = result.explanation;
			}
		} catch (error) {
			console.error('Failed to fetch explanation:', error);
			explanationError = m['lesson.explanation.error']();
		} finally {
			isLoadingExplanation = false;
		}
	}

	async function handleAnswer(answer: string) {
		if (isSubmitting || showFeedback || (hearts <= 0 && !data.isRevision)) return;

		isSubmitting = true;
		lastUserAnswer = answer;
		const question = questions[currentIndex];

		const formData = new FormData();
		const multiplierForSubmission = comboMultiplier;
		formData.append('questionId', question.id.toString());
		formData.append('answer', answer);
		formData.append('isRevision', data.isRevision ? 'true' : 'false');
		formData.append('locale', getLocale());
		formData.append('comboMultiplier', multiplierForSubmission.toString());

		try {
			const response = await fetch(`?/submit`, {
				method: 'POST',
				body: formData
			});

			const result = deserialize(await response.text());

			if (result.type !== 'success') {
				throw new Error('Submission failed');
			}

			const actionData = result.data as SubmitActionData;

			lastAnswer = {
				isCorrect: actionData.isCorrect,
				correctAnswer: actionData.correctAnswer
			};

			// Sync hearts from server if provided
			if (actionData.hearts !== undefined) {
				hearts = actionData.hearts;
			} else if (!lastAnswer.isCorrect) {
				hearts = Math.max(0, hearts - 1);
			}

			// Check if out of hearts immediately after updating
			if (hearts <= 0 && !data.isRevision && data.heartsEnabled) {
				showOutOfHeartsModal = true;
				isSubmitting = false;
				return; // Don't show feedback, show out-of-hearts modal instead
			}

			// Only refresh layout data if we still have hearts
			if (actionData.hearts !== undefined && hearts > 0) {
				invalidateAll();
			}

			if (lastAnswer.isCorrect) {
				playCorrect();
				xpEarned += actionData.xpAwarded ?? 0;
				if ((actionData.xpAwarded ?? 0) > 0) {
					const baseIncrement = Math.round((actionData.xpAwarded ?? 0) / multiplierForSubmission);
					baseXpEarned += baseIncrement;
					comboBonusXpEarned += (actionData.xpAwarded ?? 0) - baseIncrement;
				}
				correctCount++;
				consecutiveCorrect += 1;
				const nextMultiplier = getComboMultiplier(consecutiveCorrect);
				if (nextMultiplier > comboMultiplier) {
					comboMultiplier = nextMultiplier;
					comboPulse = true;
					setTimeout(() => {
						comboPulse = false;
					}, 420);
					playCombo(nextMultiplier);
				}

				if (actionData.firstCorrectToday) {
					celebrateFirstCorrectToday(
						m['celebration.firstCorrectToday'](),
						m['celebration.firstCorrectTodayMessage']()
					);
				}

				if ((actionData.newLevel ?? 1) > (actionData.previousLevel ?? 1)) {
					playLevelUp();
				}

				if (actionData.streakMilestone) {
					playStreak();
					playStreakMilestone();
				}
			} else {
				playIncorrect();
				consecutiveCorrect = 0;
				comboMultiplier = 1;
				comboPulse = false;
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
		lastUserAnswer = '';
		aiExplanation = null;
		explanationError = null;

		if (currentIndex < totalQuestions - 1) {
			currentIndex++;
		} else {
			completeLesson();
		}
	}

	function handleSkip() {
		// Skip voice questions when no API key - doesn't count as correct or incorrect
		if (currentIndex < totalQuestions - 1) {
			currentIndex++;
		} else {
			completeLesson();
		}
	}

	async function handleWrongMatch() {
		// Deduct heart for wrong match in matching questions (unless in revision mode or hearts disabled)
		if (!data.isRevision && data.heartsEnabled && hearts > 0) {
			hearts = hearts - 1;

			// Persist heart deduction to server
			try {
				await fetch('/api/lessons/wrong-match', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ lessonId: data.lesson.id })
				});

				// Refresh layout data to sync header hearts display
				if (hearts > 0) {
					invalidateAll();
				}
			} catch (error) {
				console.error('Failed to persist heart deduction:', error);
			}

			// Check if out of hearts
			if (hearts <= 0) {
				showOutOfHeartsModal = true;
			}
		}
	}

	async function completeLesson() {
		isComplete = true;

		const formData = new FormData();
		formData.append('score', Math.round((correctCount / totalQuestions) * 100).toString());
		formData.append('xpEarned', xpEarned.toString());
		formData.append('startTime', startTime.toString());

		try {
			const response = await fetch(`?/complete`, {
				method: 'POST',
				body: formData
			});
			const result = deserialize(await response.text());
			if (result.type !== 'success') {
				console.error('Failed to complete lesson:', result);
			} else {
				const completeData = result.data as CompleteActionData;
				completionData = completeData;
				if (completeData?.newAchievements?.length) {
					for (const name of completeData.newAchievements) {
						celebrateAchievement(name);
						playAchievement();
					}
				}
			}
		} catch (error) {
			console.error('Failed to complete lesson:', error);
		}
	}

	function getAccuracyMessage(accuracy: number): string {
		if (accuracy === 100) return m['lesson.complete.perfect']();
		if (accuracy >= 80) return m['lesson.complete.great']();
		if (accuracy >= 60) return m['lesson.complete.good']();
		return m['lesson.complete.keepPracticing']();
	}

	function getComboMultiplier(streakCount: number): number {
		if (streakCount >= 8) return 4;
		if (streakCount >= 5) return 3;
		if (streakCount >= 3) return 2;
		return 1;
	}

	function formatTimeTaken(totalSeconds: number | null | undefined): string {
		if (!totalSeconds || totalSeconds <= 0) return '00:00';
		const minutes = Math.floor(totalSeconds / 60)
			.toString()
			.padStart(2, '0');
		const seconds = Math.floor(totalSeconds % 60)
			.toString()
			.padStart(2, '0');
		return `${minutes}:${seconds}`;
	}

	function retryLesson() {
		window.location.reload();
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
		<div class="w-full max-w-md card text-center">
			<div class="flex justify-center">
				<PartyPopper size={64} class="text-success" />
			</div>
			<h2 class="mt-4 text-2xl font-bold text-text-light">{m['lesson.complete.title']()}</h2>
			<p class="mt-2 text-lg text-text-muted">
				{getAccuracyMessage(accuracyPercent)}
			</p>

			<div class="mt-6 grid grid-cols-2 gap-4">
				<div class="rounded-xl bg-yellow/10 p-4">
					<div class="text-2xl font-bold text-yellow-dark">
						+<AnimatedCounter value={totalCompletionXp} duration={900} />
					</div>
					<div class="text-sm text-text-muted">{m['lesson.complete.xpEarned']()}</div>
				</div>
				<div class="rounded-xl bg-success/10 p-4">
					<div class="text-2xl font-bold text-success">
						{accuracyPercent}%
					</div>
					<div class="text-sm text-text-muted">{m['lesson.complete.accuracy']()}</div>
				</div>
			</div>

			<div class="bg-bg-secondary mt-4 space-y-2 rounded-xl p-4 text-left text-sm text-text-muted">
				<p>{m['lesson.complete.timeTaken']({ time: completionTimeLabel })}</p>
				<p>
					{m['lesson.complete.xpBreakdown']({
						base: baseXpEarned,
						bonus: comboBonusXpEarned + improvementBonusXp
					})}
				</p>
				{#if completionData?.gemsEarned}
					<p class="font-semibold text-primary">
						{m['lesson.complete.gemsEarned']({ count: completionData.gemsEarned })}
					</p>
				{/if}
				{#if completionData?.previousScore !== null && completionData?.previousScore !== undefined}
					<p>{m['lesson.complete.previousScore']({ score: completionData.previousScore })}</p>
					<p class="font-medium text-text-light">
						Previous: {completionData.previousScore}% -> Now: {accuracyPercent}%
					</p>
					{#if improvementAmount > 0}
						<p class="font-semibold text-success">
							{m['lesson.complete.improved']({ amount: improvementAmount })}
						</p>
					{/if}
				{/if}
			</div>

			{#if completionData?.previousScore !== null && completionData?.previousScore !== undefined && accuracyPercent <= completionData.previousScore}
				<button onclick={retryLesson} class="btn btn-primary btn-lg mt-4 w-full">
					{m['lesson.complete.beatYourScore']()}
				</button>
				<button onclick={retryLesson} class="btn btn-ghost mt-2 w-full">
					{m['lesson.complete.tryAgain']()}
				</button>
			{/if}

			<button onclick={exitLesson} class="btn btn-success btn-lg mt-6 w-full">
				{m['lesson.complete.continueButton']()}
			</button>
		</div>
	</div>
{:else if showOutOfHeartsModal}
	<!-- Out of Hearts Screen -->
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-md card text-center">
			<div class="flex justify-center">
				<HeartCrack size={64} class="text-error" />
			</div>
			<h2 class="mt-4 text-2xl font-bold text-error">{m['lesson.outOfHearts.title']()}</h2>
			<p class="mt-2 text-text-muted">{m['lesson.outOfHearts.message']()}</p>

			<button
				onclick={() => (window.location.href = '/dashboard')}
				class="btn btn-primary btn-lg mt-6 w-full"
			>
				{m['common.back']()}
			</button>
		</div>
	</div>
{:else}
	<div class="mx-auto max-w-2xl">
		<!-- Header -->
		<div class="mb-6 flex items-center justify-between">
			<button onclick={exitLesson} class="text-text-muted hover:text-text-light">
				<X size={24} />
			</button>

			<!-- Progress Bar -->
			<div class="mx-4 flex-1">
				<div class="progress-bar">
					<div
						class="progress-bar-fill"
						style="width: {((currentIndex + (showFeedback ? 1 : 0)) / totalQuestions) * 100}%"
					></div>
				</div>
			</div>

			<!-- Hearts -->
			<div class="flex items-center gap-1">
				<Heart size={20} class="text-error" />
				<span class="font-bold text-error">{hearts}</span>
			</div>
		</div>

		<!-- Question Counter -->
		<div class="mb-4 text-center text-sm text-text-muted">
			{m['lesson.question']()}
			{currentIndex + 1}
			{m['lesson.of']()}
			{totalQuestions}
		</div>

		{#if data.isRevision}
			<div class="mb-4 rounded-xl bg-primary/10 p-3 text-center text-sm font-medium text-primary">
				{m['lesson.complete.beatYourScore']()}
			</div>
		{/if}

		{#if comboMultiplier > 1}
			<div class="mb-4 flex justify-center">
				<div
					class="rounded-full bg-yellow-dark/15 px-4 py-2 text-sm font-bold text-yellow-dark {comboPulse
						? 'animate-combo-pulse'
						: ''}"
				>
					{m['lesson.combo.active']({ multiplier: comboMultiplier })}
					<span class="ml-2 text-text-muted"
						>{m['lesson.combo.streak']({ count: consecutiveCorrect })}</span
					>
				</div>
			</div>
		{/if}

		<!-- Question Content -->
		{#key currentQuestion.id}
			<QuestionRenderer
				type={currentQuestion.type}
				content={questionContent}
				disabled={showFeedback || isSubmitting}
				hasApiKey={data.hasApiKey}
				targetLanguageName={data.activeLanguage?.name || ''}
				onAnswer={handleAnswer}
				onSkip={handleSkip}
				onWrongMatch={handleWrongMatch}
			/>
		{/key}

		<!-- Feedback -->
		{#if showFeedback && lastAnswer}
			<div class="mt-6 rounded-xl p-4 {lastAnswer.isCorrect ? 'bg-success/10' : 'bg-error/10'}">
				<div class="flex items-start gap-3">
					<span class="text-2xl">
						{#if lastAnswer.isCorrect}
							<CircleCheck size={24} class="text-success" />
						{:else}
							<CircleX size={24} class="text-error" />
						{/if}
					</span>
					<div class="flex-1">
						<p class="font-bold {lastAnswer.isCorrect ? 'text-success' : 'text-error'}">
							{lastAnswer.isCorrect ? m['lesson.correct']() : m['lesson.incorrect']()}
						</p>
						{#if !lastAnswer.isCorrect}
							<p class="text-sm text-text-muted">
								{m['lesson.correctAnswer']()}:
								<span class="font-medium">{lastAnswer.correctAnswer}</span>
							</p>
							{#if data.hasApiKey && !aiExplanation && !isLoadingExplanation}
								<button
									onclick={fetchExplanation}
									class="btn btn-ghost mt-3 -ml-2 flex items-center gap-2 px-2 text-sm text-primary hover:bg-primary/10"
								>
									<Bot size={16} />
									{m['lesson.explain']()}
								</button>
							{/if}
						{/if}
					</div>
				</div>

				<AiExplanation
					explanation={aiExplanation}
					isLoading={isLoadingExplanation}
					error={explanationError}
				/>

				<button
					onclick={nextQuestion}
					class="btn {lastAnswer.isCorrect ? 'btn-success' : 'btn-primary'} btn-lg mt-4 w-full"
				>
					{m['lesson.continue']()}
				</button>
			</div>
		{/if}
	</div>
{/if}
