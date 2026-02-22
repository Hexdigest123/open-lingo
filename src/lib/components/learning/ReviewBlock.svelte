<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import QuestionRenderer from '../lessons/QuestionRenderer.svelte';

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

	function handleAnswer(answer: string) {
		if (showFeedback) return;

		userAnswer = answer;

		const normalizedUser = answer.trim().toLowerCase();
		const normalizedCorrect = currentReview.question.correctAnswer.trim().toLowerCase();

		isCorrect = normalizedUser === normalizedCorrect;

		if (currentReview.question.type === 'matching' && answer === 'all_matched') {
			isCorrect = true;
		}

		feedbackMessage = isCorrect ? m['lesson.correct']() : m['lesson.incorrect']();

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
				{m['review.reviewOf']({ current: String(currentIndex + 1), total: String(reviews.length) })}
			</h2>
			<span class="text-sm font-medium text-success">
				{correctCount}
				{m['review.correct']()}
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
			<QuestionRenderer
				type={currentReview.question.type}
				content={currentReview.question.content}
				disabled={showFeedback}
				{hasApiKey}
				targetLanguageName={currentReview.question.content.targetLanguageName as string}
				correctAnswer={currentReview.question.correctAnswer}
				onAnswer={handleAnswer}
			/>
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
							{m['lesson.correctAnswer']()}:
						</p>
						<p class="text-lg font-medium">{currentReview.question.correctAnswer}</p>
					</div>
				{/if}

				<button
					onclick={nextReview}
					class="btn btn-lg w-full shadow-md
					{isCorrect ? 'btn-success' : 'btn-error'}"
				>
					{m['lesson.continue']()}
				</button>
			</div>
		</div>
	{/if}
</div>
