<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import type { PageData } from './$types';
	import { deserialize } from '$app/forms';
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
			title: string;
		};
		question: ReviewQuestion;
	};

	let { data }: { data: PageData } = $props();

	const reviews = data.reviews as unknown as ReviewItem[];

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
		return item.concept.title;
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
	<title>{m['review.title']()} - OpenLingo</title>
</svelte:head>

{#if reviews.length === 0}
	<div class="mx-auto max-w-2xl card py-12 text-center">
		<div
			class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-10 w-10"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
					clip-rule="evenodd"
				/>
			</svg>
		</div>
		<h1 class="mt-4 text-2xl font-bold text-text-light">
			{m['review.noDue']()}
		</h1>
		<a href="/skills" class="btn btn-primary mt-6">{m['learn.backToSkills']()}</a>
	</div>
{:else if reviewDone}
	<div class="mx-auto max-w-2xl space-y-4 card text-center">
		<div
			class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-10 w-10"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
					clip-rule="evenodd"
				/>
			</svg>
		</div>
		<h1 class="text-2xl font-bold text-text-light">
			{m['review.complete']()}
		</h1>
		<p class="text-text-muted">
			{m['review.reviewed']({ count: reviews.length })}
		</p>
		<p class="text-lg font-semibold text-success">
			{m['review.accuracy']({ percent: accuracy })}
		</p>
		<p class="text-sm text-text-muted">
			{m['review.nextReview']({ time: m['common.tomorrow']() })}
		</p>
		<a href="/skills" class="btn btn-primary">{m['learn.backToSkills']()}</a>
	</div>
{:else if currentItem && currentQuestion}
	<div class="mx-auto max-w-2xl space-y-6">
		<div class="flex items-center justify-between">
			<a href="/skills" class="text-sm text-text-muted hover:text-text-light"
				>← {m['learn.backToSkills']()}</a
			>
			<p class="text-sm text-text-muted">
				{m['review.reviewOf']({ current: currentIndex + 1, total: reviews.length })}
			</p>
		</div>

		<div class="card">
			<p class="text-xs tracking-wide text-text-muted uppercase">
				{m['review.concept']({ name: getConceptTitle(currentItem) })}
			</p>
			<h2 class="mt-1 text-lg font-bold text-text-light">{getConceptTitle(currentItem)}</h2>
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
				<p class="mt-1 text-sm text-text-muted">
					{m['skills.mastery']({ percent: Math.round(feedback.mastery * 100) })}
				</p>
				<button class="btn btn-primary mt-4 w-full" onclick={nextReview}
					>{m['learn.continue']()}</button
				>
			</div>
		{/if}
	</div>
{/if}
