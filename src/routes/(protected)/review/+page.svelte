<script lang="ts">
	import type { PageData } from './$types';
	import { deserialize } from '$app/forms';
	import { i18n, t } from '$lib/i18n/index.svelte';
	import MultipleChoiceQuestion from '$lib/components/lessons/MultipleChoiceQuestion.svelte';
	import FillBlankQuestion from '$lib/components/lessons/FillBlankQuestion.svelte';
	import TranslationQuestion from '$lib/components/lessons/TranslationQuestion.svelte';
	import MatchingQuestion from '$lib/components/lessons/MatchingQuestion.svelte';
	import WordOrderQuestion from '$lib/components/lessons/WordOrderQuestion.svelte';
	import SpeakingQuestion from '$lib/components/lessons/SpeakingQuestion.svelte';
	import ListeningQuestion from '$lib/components/lessons/ListeningQuestion.svelte';

	type ReviewQuestion = {
		id: number;
		type: string;
		content: Record<string, unknown>;
		correctAnswer: string;
	};

	type ReviewItem = {
		concept: {
			id: number;
			titleEn: string;
			titleDe: string;
		};
		question: ReviewQuestion;
	};

	let { data }: { data: PageData } = $props();

	const reviews = data.reviews as ReviewItem[];

	let currentIndex = $state(0);
	let correctCount = $state(0);
	let showFeedback = $state(false);
	let feedback = $state<{ isCorrect: boolean; correctAnswer: string; mastery: number } | null>(
		null
	);
	let isSubmitting = $state(false);
	let reviewDone = $state(reviews.length === 0);

	const currentItem = $derived(reviews[currentIndex]);
	const currentQuestion = $derived(currentItem?.question);

	function getConceptTitle(item: ReviewItem): string {
		return i18n.locale === 'de' ? item.concept.titleDe : item.concept.titleEn;
	}

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

	async function submitAnswer(answer: string) {
		if (!currentItem || isSubmitting || showFeedback) return;

		isSubmitting = true;
		const formData = new FormData();
		formData.append('conceptId', String(currentItem.concept.id));
		formData.append('questionId', String(currentItem.question.id));
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
				mastery: number;
			};

			feedback = {
				isCorrect: payload.isCorrect,
				correctAnswer: payload.correctAnswer,
				mastery: payload.mastery
			};

			if (payload.isCorrect) {
				correctCount += 1;
			}

			showFeedback = true;
		}

		isSubmitting = false;
	}

	function nextReview() {
		showFeedback = false;
		feedback = null;

		if (currentIndex < reviews.length - 1) {
			currentIndex += 1;
			return;
		}

		reviewDone = true;
	}

	const accuracy = $derived(
		reviews.length > 0 ? Math.round((correctCount / reviews.length) * 100) : 100
	);
</script>

<svelte:head>
	<title>{t('review.title', { defaultValue: 'Review Session' })} - OpenLingo</title>
</svelte:head>

{#if reviews.length === 0}
	<div class="mx-auto max-w-2xl card py-12 text-center">
		<div class="text-6xl">✅</div>
		<h1 class="mt-4 text-2xl font-bold text-text-light">
			{t('review.noDue', { defaultValue: 'All caught up!' })}
		</h1>
		<a href="/skills" class="btn btn-primary mt-6"
			>{t('learn.backToSkills', { defaultValue: 'Back to Skill Tree' })}</a
		>
	</div>
{:else if reviewDone}
	<div class="mx-auto max-w-2xl space-y-4 card text-center">
		<div class="text-6xl">🎯</div>
		<h1 class="text-2xl font-bold text-text-light">
			{t('review.complete', { defaultValue: 'Review Complete!' })}
		</h1>
		<p class="text-text-muted">
			{t('review.reviewed', { count: reviews.length, defaultValue: 'Reviewed concepts' })}
		</p>
		<p class="text-lg font-semibold text-success">
			{t('review.accuracy', { percent: accuracy, defaultValue: 'Accuracy' })}
		</p>
		<p class="text-sm text-text-muted">
			{t('review.nextReview', {
				time: t('common.tomorrow', { defaultValue: 'tomorrow' }),
				defaultValue: 'Next review soon'
			})}
		</p>
		<a href="/skills" class="btn btn-primary"
			>{t('learn.backToSkills', { defaultValue: 'Back to Skill Tree' })}</a
		>
	</div>
{:else if currentItem && currentQuestion}
	<div class="mx-auto max-w-2xl space-y-6">
		<div class="flex items-center justify-between">
			<a href="/skills" class="text-sm text-text-muted hover:text-text-light"
				>← {t('learn.backToSkills', { defaultValue: 'Back to Skill Tree' })}</a
			>
			<p class="text-sm text-text-muted">
				{t('review.reviewOf', {
					current: currentIndex + 1,
					total: reviews.length,
					defaultValue: 'Review progress'
				})}
			</p>
		</div>

		<div class="card">
			<p class="text-xs tracking-wide text-text-muted uppercase">
				{t('review.concept', { name: getConceptTitle(currentItem), defaultValue: 'Concept' })}
			</p>
			<h2 class="mt-1 text-lg font-bold text-text-light">{getConceptTitle(currentItem)}</h2>
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
					{t('learn.unsupportedType', { defaultValue: 'Unsupported question type' })}
				</p>
				<button
					class="btn btn-primary mt-4"
					onclick={() => submitAnswer(currentQuestion.correctAnswer)}
					>{t('learn.continue', { defaultValue: 'Continue' })}</button
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
					{feedback.isCorrect
						? t('learn.correct', { defaultValue: 'Correct!' })
						: t('learn.incorrect', { defaultValue: 'Not quite' })}
				</p>
				{#if !feedback.isCorrect}
					<p class="mt-1 text-sm text-text-muted">
						{t('learn.correctAnswerWas', {
							answer: feedback.correctAnswer,
							defaultValue: 'Correct answer'
						})}
					</p>
				{/if}
				<p class="mt-1 text-sm text-text-muted">
					{t('skills.mastery', {
						percent: Math.round(feedback.mastery * 100),
						defaultValue: 'Mastery'
					})}
				</p>
				<button class="btn btn-primary mt-4 w-full" onclick={nextReview}
					>{t('learn.continue', { defaultValue: 'Continue' })}</button
				>
			</div>
		{/if}
	</div>
{/if}
