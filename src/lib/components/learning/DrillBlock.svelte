<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';
import MultipleChoiceQuestion from '../lessons/MultipleChoiceQuestion.svelte';
	import FillBlankQuestion from '../lessons/FillBlankQuestion.svelte';
	import TranslationQuestion from '../lessons/TranslationQuestion.svelte';
	import MatchingQuestion from '../lessons/MatchingQuestion.svelte';
	import WordOrderQuestion from '../lessons/WordOrderQuestion.svelte';
	import SpeakingQuestion from '../lessons/SpeakingQuestion.svelte';
	import ListeningQuestion from '../lessons/ListeningQuestion.svelte';
	import CharacterRecognitionQuestion from '../lessons/CharacterRecognitionQuestion.svelte';
	import CharacterWritingQuestion from '../lessons/CharacterWritingQuestion.svelte';
	import ScriptTransliterationQuestion from '../lessons/ScriptTransliterationQuestion.svelte';

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
			feedbackMessage = m["lesson.correct"]();
		} else {
			feedbackMessage = m["lesson.incorrect"]();
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

	// Helper to get localized content
	function getLocalized(content: Record<string, unknown>, keyPrefix: string) {
		const en = content[`${keyPrefix}En`] as string;
		const de = content[`${keyPrefix}De`] as string;
		return getLocale() === 'de' && de ? de : en;
	}
</script>

<div class="mx-auto max-w-2xl pb-24">
	<!-- Progress Bar -->
	<div class="mb-8">
		<div class="mb-2 flex justify-between text-sm font-medium text-text-light">
			<span>{m["lesson.progress"]()}</span>
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
			{#if currentQuestion.type === 'multiple_choice'}
				<MultipleChoiceQuestion
					questionText={getLocalized(currentQuestion.content, 'question')}
					options={currentQuestion.content.options as string[]}
					disabled={showFeedback || disabled}
					onAnswer={handleAnswer}
				/>
			{:else if currentQuestion.type === 'fill_blank'}
				<FillBlankQuestion
					sentence={getLocalized(currentQuestion.content, 'sentence')}
					hint={getLocalized(currentQuestion.content, 'hint')}
					disabled={showFeedback || disabled}
					onAnswer={handleAnswer}
				/>
			{:else if currentQuestion.type === 'translation'}
				<TranslationQuestion
					textEn={currentQuestion.content.textEn as string}
					textDe={currentQuestion.content.textDe as string}
					text={currentQuestion.content.text as string}
					direction={currentQuestion.content.direction as string}
					targetLanguageName={currentQuestion.content.targetLanguageName as string}
					disabled={showFeedback || disabled}
					onAnswer={handleAnswer}
				/>
			{:else if currentQuestion.type === 'matching'}
				<MatchingQuestion
					pairs={currentQuestion.content.pairs as any[]}
					targetLanguageName={currentQuestion.content.targetLanguageName as string}
					disabled={showFeedback || disabled}
					onAnswer={handleAnswer}
				/>
			{:else if currentQuestion.type === 'word_order'}
				<WordOrderQuestion
					words={currentQuestion.content.words as string[]}
					instructionEn={currentQuestion.content.instructionEn as string}
					instructionDe={currentQuestion.content.instructionDe as string}
					disabled={showFeedback || disabled}
					onAnswer={handleAnswer}
				/>
			{:else if currentQuestion.type === 'speaking'}
				<SpeakingQuestion
					textToSpeak={currentQuestion.content.textToSpeak as string}
					hintEn={currentQuestion.content.hintEn as string}
					hintDe={currentQuestion.content.hintDe as string}
					disabled={showFeedback || disabled}
					{hasApiKey}
					onAnswer={handleAnswer}
				/>
			{:else if currentQuestion.type === 'listening'}
				<ListeningQuestion
					textToHear={currentQuestion.content.textToHear as string}
					answerType={currentQuestion.content.answerType as 'type' | 'multiple_choice'}
					options={currentQuestion.content.options as string[]}
					disabled={showFeedback || disabled}
					{hasApiKey}
					onAnswer={handleAnswer}
				/>
			{:else if currentQuestion.type === 'character_recognition'}
				<CharacterRecognitionQuestion
					character={currentQuestion.content.character as string}
					characterType={currentQuestion.content.characterType as string}
					options={currentQuestion.content.options as string[]}
					disabled={showFeedback || disabled}
					onAnswer={handleAnswer}
				/>
			{:else if currentQuestion.type === 'character_writing'}
				<CharacterWritingQuestion
					reading={currentQuestion.content.reading as string}
					characterType={currentQuestion.content.characterType as string}
					hintEn={currentQuestion.content.hintEn as string}
					hintDe={currentQuestion.content.hintDe as string}
					disabled={showFeedback || disabled}
					onAnswer={handleAnswer}
				/>
			{:else if currentQuestion.type === 'script_transliteration'}
				<ScriptTransliterationQuestion
					sourceText={currentQuestion.content.sourceText as string}
					sourceScript={currentQuestion.content.sourceScript as string}
					targetScript={currentQuestion.content.targetScript as string}
					disabled={showFeedback || disabled}
					onAnswer={handleAnswer}
				/>
			{:else}
				<div class="rounded-xl border-2 border-dashed border-text-muted/30 p-8 text-center">
					<p class="text-lg font-medium text-text-light">
						{m["lesson.unsupportedType"]()}: {currentQuestion.type}
					</p>
					<button
						onclick={() => handleAnswer(currentQuestion.correctAnswer)}
						class="btn btn-secondary mt-4"
					>
						{m["lesson.skip"]()}
					</button>
				</div>
			{/if}
		{/if}
	</div>

	<!-- Feedback Sheet -->
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
							{m["lesson.correctAnswer"]()}:
						</p>
						<p class="text-lg font-medium">{currentQuestion.correctAnswer}</p>
					</div>
				{/if}

				<button
					onclick={nextQuestion}
					class="btn btn-lg w-full shadow-md
					{isCorrect ? 'btn-success' : 'btn-error'}"
				>
					{m["lesson.continue"]()}
				</button>
			</div>
		</div>
	{/if}
</div>
