<script lang="ts">
	import { i18n, t } from '$lib/i18n/index.svelte';
	import MultipleChoiceQuestion from '../lessons/MultipleChoiceQuestion.svelte';
	import FillBlankQuestion from '../lessons/FillBlankQuestion.svelte';
	import TranslationQuestion from '../lessons/TranslationQuestion.svelte';
	import MatchingQuestion from '../lessons/MatchingQuestion.svelte';
	import WordOrderQuestion from '../lessons/WordOrderQuestion.svelte';
	import SpeakingQuestion from '../lessons/SpeakingQuestion.svelte';
	import ListeningQuestion from '../lessons/ListeningQuestion.svelte';

	interface ReviewQuestion {
		id: number;
		type: string;
		content: Record<string, unknown>;
		correctAnswer: string;
	}

	interface ReviewItem {
		conceptId: number;
		conceptTitle: string;
		question: ReviewQuestion;
	}

	interface ReviewResult {
		conceptId: number;
		isCorrect: boolean;
	}

	interface Props {
		reviews: ReviewItem[];
		hasApiKey?: boolean;
		onAnswer: (conceptId: number, questionId: number, answer: string, isCorrect: boolean) => void;
		onComplete: (results: ReviewResult[]) => void;
	}

	let { reviews, hasApiKey = false, onAnswer, onComplete }: Props = $props();

	let currentIndex = $state(0);
	let showFeedback = $state(false);
	let isCorrect = $state(false);
	let userAnswer = $state('');
	let feedbackMessage = $state('');
	let results = $state<ReviewResult[]>([]);

	const currentReview = $derived(reviews[currentIndex]);
	const progress = $derived(((currentIndex + (showFeedback ? 1 : 0)) / reviews.length) * 100);
	const correctCount = $derived(results.filter((r) => r.isCorrect).length);

	function getLocalized(content: Record<string, unknown>, keyPrefix: string) {
		const en = content[`${keyPrefix}En`] as string;
		const de = content[`${keyPrefix}De`] as string;
		return i18n.locale === 'de' && de ? de : en;
	}

	function handleAnswer(answer: string) {
		if (showFeedback) return;

		userAnswer = answer;

		const normalizedUser = answer.trim().toLowerCase();
		const normalizedCorrect = currentReview.question.correctAnswer.trim().toLowerCase();

		isCorrect = normalizedUser === normalizedCorrect;

		if (currentReview.question.type === 'matching' && answer === 'all_matched') {
			isCorrect = true;
		}

		feedbackMessage = isCorrect ? t('lesson.correct') : t('lesson.incorrect');

		showFeedback = true;

		results = [...results, { conceptId: currentReview.conceptId, isCorrect }];

		onAnswer(currentReview.conceptId, currentReview.question.id, answer, isCorrect);
	}

	function nextReview() {
		showFeedback = false;
		userAnswer = '';

		if (currentIndex < reviews.length - 1) {
			currentIndex++;
		} else {
			onComplete(results);
		}
	}
</script>

<div class="mx-auto max-w-2xl pb-24">
	<div class="mb-6">
		<div class="mb-2 flex items-center justify-between">
			<h2 class="text-lg font-bold text-text-light">
				{t('review.reviewOf')}
				{currentIndex + 1} / {reviews.length}
			</h2>
			<span class="text-sm font-medium text-success">
				{correctCount}
				{t('review.correct')}
			</span>
		</div>
		<div class="bg-surface-200 h-3 w-full overflow-hidden rounded-full">
			<div
				class="h-full bg-primary transition-all duration-500 ease-out"
				style="width: {progress}%"
			></div>
		</div>
	</div>

	{#if currentReview}
		<div class="mb-4">
			<span
				class="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
			>
				{currentReview.conceptTitle}
			</span>
		</div>

		<div class="mb-8">
			{#if currentReview.question.type === 'multiple_choice'}
				<MultipleChoiceQuestion
					questionText={getLocalized(currentReview.question.content, 'question')}
					options={currentReview.question.content.options as string[]}
					disabled={showFeedback}
					onAnswer={handleAnswer}
				/>
			{:else if currentReview.question.type === 'fill_blank'}
				<FillBlankQuestion
					sentence={getLocalized(currentReview.question.content, 'sentence')}
					hint={getLocalized(currentReview.question.content, 'hint')}
					disabled={showFeedback}
					onAnswer={handleAnswer}
				/>
			{:else if currentReview.question.type === 'translation'}
				<TranslationQuestion
					textEn={currentReview.question.content.textEn as string}
					textDe={currentReview.question.content.textDe as string}
					text={currentReview.question.content.text as string}
					direction={currentReview.question.content.direction as string}
					targetLanguageName={currentReview.question.content.targetLanguageName as string}
					disabled={showFeedback}
					onAnswer={handleAnswer}
				/>
			{:else if currentReview.question.type === 'matching'}
				<MatchingQuestion
					pairs={currentReview.question.content.pairs as any[]}
					targetLanguageName={currentReview.question.content.targetLanguageName as string}
					disabled={showFeedback}
					onAnswer={handleAnswer}
				/>
			{:else if currentReview.question.type === 'word_order'}
				<WordOrderQuestion
					words={currentReview.question.content.words as string[]}
					instructionEn={currentReview.question.content.instructionEn as string}
					instructionDe={currentReview.question.content.instructionDe as string}
					disabled={showFeedback}
					onAnswer={handleAnswer}
				/>
			{:else if currentReview.question.type === 'speaking'}
				<SpeakingQuestion
					textToSpeak={currentReview.question.content.textToSpeak as string}
					hintEn={currentReview.question.content.hintEn as string}
					hintDe={currentReview.question.content.hintDe as string}
					disabled={showFeedback}
					{hasApiKey}
					onAnswer={handleAnswer}
				/>
			{:else if currentReview.question.type === 'listening'}
				<ListeningQuestion
					textToHear={currentReview.question.content.textToHear as string}
					answerType={currentReview.question.content.answerType as 'type' | 'multiple_choice'}
					options={currentReview.question.content.options as string[]}
					disabled={showFeedback}
					{hasApiKey}
					onAnswer={handleAnswer}
				/>
			{:else}
				<div class="rounded-xl border-2 border-dashed border-text-muted/30 p-8 text-center">
					<p class="text-lg font-medium text-text-light">
						{t('lesson.unsupportedType')}: {currentReview.question.type}
					</p>
					<button
						onclick={() => handleAnswer(currentReview.question.correctAnswer)}
						class="btn btn-secondary mt-4"
					>
						{t('lesson.skip')}
					</button>
				</div>
			{/if}
		</div>
	{/if}

	{#if showFeedback}
		<div
			class="fixed right-0 bottom-0 left-0 z-50 border-t-2 p-6 shadow-2xl transition-transform duration-300
			{isCorrect
				? 'border-success bg-success/10 text-success-dark'
				: 'border-error bg-error/10 text-error-dark'}
			bg-surface-100"
		>
			<div class="mx-auto max-w-2xl">
				<div class="mb-4 flex items-center gap-3">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-full
						{isCorrect ? 'bg-success text-white' : 'bg-error text-white'}"
					>
						{#if isCorrect}
							<span class="text-xl">&#x2713;</span>
						{:else}
							<span class="text-xl">&#x2715;</span>
						{/if}
					</div>
					<h3 class="text-xl font-bold">{feedbackMessage}</h3>
				</div>

				{#if !isCorrect && currentReview}
					<div class="mb-6">
						<p class="text-sm font-medium uppercase opacity-70">
							{t('lesson.correctAnswer')}:
						</p>
						<p class="text-lg font-medium">{currentReview.question.correctAnswer}</p>
					</div>
				{/if}

				<button
					onclick={nextReview}
					class="btn btn-lg w-full shadow-md
					{isCorrect ? 'btn-success' : 'btn-error'}"
				>
					{t('lesson.continue')}
				</button>
			</div>
		</div>
	{/if}
</div>
