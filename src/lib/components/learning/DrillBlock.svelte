<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import QuestionRenderer from '../lessons/QuestionRenderer.svelte';

	interface Question {
		id: number;
		type: string;
		content: Record<string, unknown>;
		correctAnswer: string;
	}

	interface Props {
		questions: Question[];
		disabled?: boolean;
		hasApiKey?: boolean;
		onAnswer?: (questionId: number, answer: string) => void;
		onComplete: (correct: number, total: number) => void;
	}

	let { questions, disabled = false, hasApiKey = false, onAnswer, onComplete }: Props = $props();

	let currentIndex = $state(0);
	let correctCount = $state(0);
	let showFeedback = $state(false);
	let isCorrect = $state(false);
	let userAnswer = $state('');
	let feedbackMessage = $state('');

	const currentQuestion = $derived(questions[currentIndex]);
	const progress = $derived((currentIndex / questions.length) * 100);

	function handleAnswer(answer: string) {
		if (showFeedback) return;

		userAnswer = answer;

		// Simple normalization for comparison
		const normalizedUser = answer.trim().toLowerCase();
		const normalizedCorrect = currentQuestion.correctAnswer.trim().toLowerCase();

		// Special handling for different types if needed
		// For now, simple string comparison
		isCorrect = normalizedUser === normalizedCorrect;

		// For matching, 'all_matched' is the success signal
		if (currentQuestion.type === 'matching' && answer === 'all_matched') {
			isCorrect = true;
		}

		if (isCorrect) {
			correctCount++;
			feedbackMessage = m['lesson.correct']();
		} else {
			feedbackMessage = m['lesson.incorrect']();
		}

		showFeedback = true;
		onAnswer?.(currentQuestion.id, answer);
	}

	function nextQuestion() {
		showFeedback = false;
		userAnswer = '';

		if (currentIndex < questions.length - 1) {
			currentIndex++;
		} else {
			onComplete(correctCount, questions.length);
		}
	}
</script>

<div class="mx-auto max-w-2xl pb-24">
	<!-- Progress Bar -->
	<div class="mb-8">
		<div class="mb-2 flex justify-between text-sm font-medium text-text-light">
			<span>{m['lesson.progress']()}</span>
			<span>{currentIndex + 1} / {questions.length}</span>
		</div>
		<div class="bg-surface-200 h-3 w-full overflow-hidden rounded-full">
			<div
				class="h-full bg-primary transition-all duration-500 ease-out"
				style="width: {progress}%"
			></div>
		</div>
	</div>

	<!-- Question Component -->
	<div class="mb-8">
		{#if currentQuestion}
			<QuestionRenderer
				type={currentQuestion.type}
				content={currentQuestion.content}
				disabled={showFeedback || disabled}
				{hasApiKey}
				targetLanguageName={currentQuestion.content.targetLanguageName as string}
				correctAnswer={currentQuestion.correctAnswer}
				onAnswer={handleAnswer}
			/>
		{/if}
	</div>

	<!-- Feedback Sheet -->
	{#if showFeedback}
		<div
			class="fixed right-0 bottom-0 left-0 z-[60] border-t-2 p-6 shadow-2xl transition-transform duration-300
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
							<span class="text-xl">✓</span>
						{:else}
							<span class="text-xl">✕</span>
						{/if}
					</div>
					<h3 class="text-xl font-bold">{feedbackMessage}</h3>
				</div>

				{#if !isCorrect}
					<div class="mb-6">
						<p class="text-sm font-medium uppercase opacity-70">
							{m['lesson.correctAnswer']()}:
						</p>
						<p class="text-lg font-medium">{currentQuestion.correctAnswer}</p>
					</div>
				{/if}

				<button
					onclick={nextQuestion}
					class="btn btn-lg w-full shadow-md
					{isCorrect ? 'btn-success' : 'btn-error'}"
				>
					{m['lesson.continue']()}
				</button>
			</div>
		</div>
	{/if}
</div>
