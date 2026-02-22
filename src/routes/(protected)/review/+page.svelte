<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import type { PageData } from './$types';
	import { deserialize } from '$app/forms';
	import QuestionRenderer from '$lib/components/lessons/QuestionRenderer.svelte';
	import {
		celebrateFirstCorrectToday,
		celebrateLevelUp,
		celebrateStreakMilestone
	} from '$lib/stores/celebrations.svelte';
	import {
		playCombo,
		playCorrect,
		playIncorrect,
		playLevelUp,
		playStreakMilestone
	} from '$lib/stores/sounds.svelte';

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
	let reviewStreak = $state(0);
	let xpEarned = $state(0);
	let streakAnimationTick = $state(0);
	let showFeedback = $state(false);
	let feedback = $state<{
		isCorrect: boolean;
		correctAnswer: string;
		mastery: number;
		xpGain: number;
	} | null>(null);
	let isSubmitting = $state(false);
	let reviewDone = $state(reviews.length === 0);

	const currentItem = $derived(reviews[currentIndex]);
	const currentQuestion = $derived(currentItem?.question);

	function getConceptTitle(item: ReviewItem): string {
		return item.concept.title;
	}

	function getComboMultiplierForNextCorrect(): number {
		return Math.max(1, Math.min(5, Math.floor((reviewStreak + 1) / 3) + 1));
	}

	async function submitAnswer(answer: string) {
		if (!currentItem || isSubmitting || showFeedback) return;

		isSubmitting = true;
		const comboMultiplier = getComboMultiplierForNextCorrect();
		const formData = new FormData();
		formData.append('conceptId', String(currentItem.concept.id));
		formData.append('questionId', String(currentItem.question.id));
		formData.append('answer', answer);
		formData.append('comboMultiplier', String(comboMultiplier));
		formData.append('isSessionComplete', currentIndex === reviews.length - 1 ? 'true' : 'false');

		try {
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
					firstCorrectToday: boolean;
					xpGain: number;
					streakMilestone: number | null;
					previousLevel: number;
					newLevel: number;
				};

				feedback = {
					isCorrect: payload.isCorrect,
					correctAnswer: payload.correctAnswer,
					mastery: payload.mastery,
					xpGain: payload.xpGain
				};

				if (payload.isCorrect) {
					correctCount += 1;
					reviewStreak += 1;
					xpEarned += payload.xpGain;
					playCorrect();

					if (comboMultiplier > 1) {
						playCombo(comboMultiplier);
					}

					if (payload.firstCorrectToday) {
						celebrateFirstCorrectToday(
							m['celebration.firstCorrectToday'](),
							m['celebration.firstCorrectTodayMessage']()
						);
					}

					if (payload.streakMilestone) {
						celebrateStreakMilestone(payload.streakMilestone);
						playStreakMilestone();
					}

					if (payload.newLevel > payload.previousLevel) {
						celebrateLevelUp(payload.newLevel);
						playLevelUp();
					}

					if (reviewStreak >= 2) {
						streakAnimationTick += 1;
					}
				} else {
					reviewStreak = 0;
					playIncorrect();
				}

				showFeedback = true;
			}
		} finally {
			isSubmitting = false;
		}
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
	const comboMultiplier = $derived(Math.max(1, Math.min(5, Math.floor(reviewStreak / 3) + 1)));
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
		<p class="animate-pulse text-lg font-semibold text-success">{m['review.allCleared']()}</p>
		<p class="text-text-muted">
			{m['review.reviewed']({ count: reviews.length })}
		</p>
		<p class="text-lg font-semibold text-yellow-dark">
			{m['review.xpEarned']({ amount: xpEarned })}
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

		{#if reviewStreak >= 2}
			{#key streakAnimationTick}
				<div
					class="animate-bounce rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-center"
				>
					<p class="font-semibold text-success">{m['review.streak']({ count: reviewStreak })}</p>
					{#if comboMultiplier > 1}
						<p class="mt-1 text-xs font-medium text-text-muted">{comboMultiplier}x combo</p>
					{/if}
				</div>
			{/key}
		{/if}

		<div class="card">
			<p class="text-xs tracking-wide text-text-muted uppercase">
				{m['review.concept']({ name: getConceptTitle(currentItem) })}
			</p>
			<h2 class="mt-1 text-lg font-bold text-text-light">{getConceptTitle(currentItem)}</h2>
		</div>

		<QuestionRenderer
			type={currentQuestion.type}
			content={currentQuestion.content}
			disabled={showFeedback || isSubmitting}
			hasApiKey={false}
			targetLanguageName={data.languageCode.toUpperCase()}
			correctAnswer={currentQuestion.correctAnswer}
			onAnswer={submitAnswer}
		/>

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
				{#if feedback.isCorrect && feedback.xpGain > 0}
					<p class="mt-1 text-sm font-semibold text-yellow-dark">
						{m['review.xpEarned']({ amount: feedback.xpGain })}
					</p>
				{/if}
				<button class="btn btn-primary mt-4 w-full" onclick={nextReview}
					>{m['learn.continue']()}</button
				>
			</div>
		{/if}
	</div>
{/if}
