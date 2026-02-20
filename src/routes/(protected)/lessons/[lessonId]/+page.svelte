<script lang="ts">
	import type { PageData } from './$types';
	import { i18n, t } from '$lib/i18n/index.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { getBilingualText } from '$lib/utils/bilingual';
	import { deserialize } from '$app/forms';
	import MultipleChoiceQuestion from '$lib/components/lessons/MultipleChoiceQuestion.svelte';
	import FillBlankQuestion from '$lib/components/lessons/FillBlankQuestion.svelte';
	import TranslationQuestion from '$lib/components/lessons/TranslationQuestion.svelte';
	import MatchingQuestion from '$lib/components/lessons/MatchingQuestion.svelte';
	import WordOrderQuestion from '$lib/components/lessons/WordOrderQuestion.svelte';
	import SpeakingQuestion from '$lib/components/lessons/SpeakingQuestion.svelte';
	import ListeningQuestion from '$lib/components/lessons/ListeningQuestion.svelte';
	import AiExplanation from '$lib/components/lessons/AiExplanation.svelte';
	import { PartyPopper, HeartCrack, Heart, CircleCheck, CircleX, Bot, X } from 'lucide-svelte';
	import {
		celebrateFirstCorrectToday,
		celebrateAchievement
	} from '$lib/stores/celebrations.svelte';

	type SubmitActionData = {
		success: boolean;
		isCorrect: boolean;
		correctAnswer: string;
		freezeEarned?: boolean;
		hearts?: number;
		xpAwarded?: number;
		firstCorrectToday?: boolean;
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

	const questions = data.questions;
	const totalQuestions = questions.length;

	const currentQuestion = $derived(questions[currentIndex]);
	const questionContent = $derived(currentQuestion?.content as Record<string, unknown>);

	// Helper to get locale-specific content with fallback
	function getLocalizedText(enKey: string, deKey: string, fallbackKey?: string): string {
		const content = questionContent;
		if (!content) return '';

		if (i18n.locale === 'de' && content[deKey]) {
			return content[deKey] as string;
		}
		if (content[enKey]) {
			return content[enKey] as string;
		}
		// Fallback for legacy questions that have a single key
		if (fallbackKey && content[fallbackKey]) {
			return content[fallbackKey] as string;
		}
		return '';
	}

	// Locale-aware question text for multiple choice
	const localizedQuestionText = $derived(getLocalizedText('questionEn', 'questionDe', 'question'));

	// Locale-aware sentence and hint for fill blank
	const localizedSentence = $derived(getLocalizedText('sentenceEn', 'sentenceDe', 'sentence'));
	const localizedHint = $derived(getLocalizedText('hintEn', 'hintDe', 'hint'));

	// Locale-aware pairs for matching (transform to use correct language)
	function getLocalizedPairs(): Array<{ target: string; english: string }> {
		if (!questionContent?.pairs) return [];
		const pairs = questionContent.pairs as Array<{
			target?: string;
			spanish: string;
			english: string;
			german?: string;
		}>;
		return pairs.map((p) => ({
			target: p.target || p.spanish,
			english: i18n.locale === 'de' && p.german ? p.german : p.english
		}));
	}
	const localizedPairs = $derived(getLocalizedPairs());

	// Locale-aware options for listening questions (and other multiple choice)
	function getLocalizedOptions(): string[] | undefined {
		// Check for locale-specific options first
		if (i18n.locale === 'de' && questionContent?.optionsDe) {
			return questionContent.optionsDe as string[];
		}
		if (questionContent?.optionsEn) {
			return questionContent.optionsEn as string[];
		}
		// Fallback to legacy single 'options' field
		return questionContent?.options as string[] | undefined;
	}
	const localizedOptions = $derived(getLocalizedOptions());

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
					locale: i18n.locale
				})
			});

			const result = await response.json();

			if (!response.ok) {
				explanationError = result.error || t('lesson.explanation.error');
			} else {
				aiExplanation = result.explanation;
			}
		} catch (error) {
			console.error('Failed to fetch explanation:', error);
			explanationError = t('lesson.explanation.error');
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
		formData.append('questionId', question.id.toString());
		formData.append('answer', answer);
		formData.append('isRevision', data.isRevision ? 'true' : 'false');
		formData.append('locale', i18n.locale);

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
				xpEarned += actionData.xpAwarded ?? 0;
				correctCount++;

				if (actionData.firstCorrectToday) {
					celebrateFirstCorrectToday(
						t('celebration.firstCorrectToday'),
						t('celebration.firstCorrectTodayMessage')
					);
				}
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

		try {
			const response = await fetch(`?/complete`, {
				method: 'POST',
				body: formData
			});
			const result = deserialize(await response.text());
			if (result.type !== 'success') {
				console.error('Failed to complete lesson:', result);
			} else {
				const completeData = result.data as {
					newAchievements?: string[];
				};
				if (completeData?.newAchievements?.length) {
					for (const name of completeData.newAchievements) {
						celebrateAchievement(name);
					}
				}
			}
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
	<title>{getBilingualText(data.lesson.title)} - OpenLingo</title>
</svelte:head>

{#if isComplete}
	<!-- Lesson Complete Screen -->
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-md card text-center">
			<div class="flex justify-center">
				<PartyPopper size={64} class="text-success" />
			</div>
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
{:else if showOutOfHeartsModal}
	<!-- Out of Hearts Screen -->
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-md card text-center">
			<div class="flex justify-center">
				<HeartCrack size={64} class="text-error" />
			</div>
			<h2 class="mt-4 text-2xl font-bold text-error">{t('lesson.outOfHearts.title')}</h2>
			<p class="mt-2 text-text-muted">{t('lesson.outOfHearts.message')}</p>

			<button
				onclick={() => (window.location.href = '/dashboard')}
				class="btn btn-primary btn-lg mt-6 w-full"
			>
				{t('common.back')}
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
			{t('lesson.question')}
			{currentIndex + 1}
			{t('lesson.of')}
			{totalQuestions}
		</div>

		<!-- Question Content -->
		{#key currentQuestion.id}
			{#if currentQuestion.type === 'multiple_choice'}
				<MultipleChoiceQuestion
					questionText={localizedQuestionText}
					options={questionContent.options as string[]}
					disabled={showFeedback || isSubmitting}
					onAnswer={handleAnswer}
				/>
			{:else if currentQuestion.type === 'fill_blank'}
				<FillBlankQuestion
					sentence={localizedSentence}
					hint={localizedHint}
					disabled={showFeedback || isSubmitting}
					onAnswer={handleAnswer}
				/>
			{:else if currentQuestion.type === 'translation'}
				<TranslationQuestion
					text={questionContent.text as string}
					textEn={questionContent.textEn as string}
					textDe={questionContent.textDe as string}
					direction={questionContent.direction as string}
					targetLanguageName={data.activeLanguage?.name || t('lesson.languages.targetLanguage')}
					disabled={showFeedback || isSubmitting}
					onAnswer={handleAnswer}
				/>
			{:else if currentQuestion.type === 'matching'}
				<MatchingQuestion
					pairs={localizedPairs}
					targetLanguageName={data.activeLanguage?.name || t('lesson.languages.targetLanguage')}
					disabled={showFeedback || isSubmitting}
					onAnswer={handleAnswer}
					onWrongMatch={handleWrongMatch}
				/>
			{:else if currentQuestion.type === 'word_order'}
				<WordOrderQuestion
					words={questionContent.words as string[]}
					instructionEn={questionContent.instructionEn as string | undefined}
					instructionDe={questionContent.instructionDe as string | undefined}
					disabled={showFeedback || isSubmitting}
					onAnswer={handleAnswer}
				/>
			{:else if currentQuestion.type === 'speaking'}
				<SpeakingQuestion
					textToSpeak={questionContent.textToSpeak as string}
					hintEn={questionContent.hintEn as string | undefined}
					hintDe={questionContent.hintDe as string | undefined}
					disabled={showFeedback || isSubmitting}
					hasApiKey={data.hasApiKey}
					onAnswer={handleAnswer}
					onSkip={handleSkip}
				/>
			{:else if currentQuestion.type === 'listening'}
				<ListeningQuestion
					textToHear={questionContent.textToHear as string}
					answerType={(questionContent.answerType as 'type' | 'multiple_choice') || 'type'}
					options={localizedOptions}
					disabled={showFeedback || isSubmitting}
					hasApiKey={data.hasApiKey}
					onAnswer={handleAnswer}
					onSkip={handleSkip}
				/>
			{:else}
				<div class="card text-center">
					<p class="text-text-muted">Unknown question type: {currentQuestion.type}</p>
				</div>
			{/if}
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
							{lastAnswer.isCorrect ? t('lesson.correct') : t('lesson.incorrect')}
						</p>
						{#if !lastAnswer.isCorrect}
							<p class="text-sm text-text-muted">
								{t('lesson.correctAnswer')}:
								<span class="font-medium">{lastAnswer.correctAnswer}</span>
							</p>
							{#if data.hasApiKey && !aiExplanation && !isLoadingExplanation}
								<button
									onclick={fetchExplanation}
									class="btn btn-ghost mt-3 -ml-2 flex items-center gap-2 px-2 text-sm text-primary hover:bg-primary/10"
								>
									<Bot size={16} />
									{t('lesson.explain')}
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
					{t('lesson.continue')}
				</button>
			</div>
		{/if}
	</div>
{/if}
