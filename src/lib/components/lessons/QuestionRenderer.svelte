<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import MultipleChoiceQuestion from './MultipleChoiceQuestion.svelte';
	import FillBlankQuestion from './FillBlankQuestion.svelte';
	import TranslationQuestion from './TranslationQuestion.svelte';
	import MatchingQuestion from './MatchingQuestion.svelte';
	import WordOrderQuestion from './WordOrderQuestion.svelte';
	import SpeakingQuestion from './SpeakingQuestion.svelte';
	import ListeningQuestion from './ListeningQuestion.svelte';
	import CharacterRecognitionQuestion from './CharacterRecognitionQuestion.svelte';
	import CharacterWritingQuestion from './CharacterWritingQuestion.svelte';
	import ScriptTransliterationQuestion from './ScriptTransliterationQuestion.svelte';
	import ConjugationClozeQuestion from '../learning/question-types/ConjugationClozeQuestion.svelte';
	import ParticleSelectionQuestion from '../learning/question-types/ParticleSelectionQuestion.svelte';
	import GrammarTransformationQuestion from '../learning/question-types/GrammarTransformationQuestion.svelte';
	import KanjiCompositionQuestion from '../learning/question-types/KanjiCompositionQuestion.svelte';
	import MinimalPairQuestion from '../learning/question-types/MinimalPairQuestion.svelte';

	interface Props {
		type: string;
		content: Record<string, unknown>;
		disabled: boolean;
		hasApiKey?: boolean;
		targetLanguageName?: string;
		correctAnswer?: string;
		onAnswer: (answer: string) => void;
		onSkip?: () => void;
		onWrongMatch?: () => void;
	}

	let {
		type,
		content,
		disabled,
		hasApiKey = false,
		targetLanguageName = '',
		correctAnswer,
		onAnswer,
		onSkip,
		onWrongMatch
	}: Props = $props();
</script>

{#if type === 'multiple_choice'}
	<MultipleChoiceQuestion
		questionText={(content.question as string) ?? ''}
		options={(content.options as string[]) ?? []}
		{disabled}
		{onAnswer}
	/>
{:else if type === 'fill_blank'}
	<FillBlankQuestion
		sentence={(content.sentence as string) ?? ''}
		hint={(content.hint as string) ?? ''}
		{disabled}
		{onAnswer}
	/>
{:else if type === 'translation'}
	<TranslationQuestion
		text={(content.text as string) ?? ''}
		direction={content.direction as string}
		targetLanguageName={targetLanguageName || m['lesson.languages.targetLanguage']()}
		{disabled}
		{onAnswer}
	/>
{:else if type === 'matching'}
	<MatchingQuestion
		pairs={Array.isArray(content.pairs) ? (content.pairs as any[]) : []}
		targetLanguageName={targetLanguageName || m['lesson.languages.targetLanguage']()}
		{disabled}
		{onAnswer}
		onWrongMatch={onWrongMatch ?? (() => {})}
	/>
{:else if type === 'word_order'}
	<WordOrderQuestion
		words={content.words as string[]}
		instruction={(content.instruction as string) ?? ''}
		{disabled}
		{onAnswer}
	/>
{:else if type === 'speaking'}
	<SpeakingQuestion
		textToSpeak={content.textToSpeak as string}
		hint={content.hint as string | undefined}
		{disabled}
		{hasApiKey}
		{onAnswer}
		{onSkip}
	/>
{:else if type === 'listening'}
	<ListeningQuestion
		textToHear={content.textToHear as string}
		answerType={(content.answerType as 'type' | 'multiple_choice') || 'type'}
		options={content.options as string[]}
		{disabled}
		{hasApiKey}
		{onAnswer}
		{onSkip}
	/>
{:else if type === 'character_recognition'}
	<CharacterRecognitionQuestion
		character={content.character as string}
		characterType={content.characterType as string}
		options={content.options as string[]}
		{disabled}
		{onAnswer}
	/>
{:else if type === 'character_writing'}
	<CharacterWritingQuestion
		reading={content.reading as string}
		characterType={content.characterType as string}
		hint={content.hint as string}
		{disabled}
		{onAnswer}
	/>
{:else if type === 'script_transliteration'}
	<ScriptTransliterationQuestion
		sourceText={content.sourceText as string}
		sourceScript={content.sourceScript as string}
		targetScript={content.targetScript as string}
		{disabled}
		{onAnswer}
	/>
{:else if type === 'conjugation_cloze'}
	<ConjugationClozeQuestion
		translation={(content.translation as string) ?? ''}
		sentence={content.sentence as string}
		infinitive={content.infinitive as string}
		targetTense={content.targetTense as string}
		hint={content.hint as string}
		{disabled}
		{onAnswer}
	/>
{:else if type === 'particle_selection'}
	<ParticleSelectionQuestion
		sentence={content.sentence as string}
		translation={(content.translation as string) ?? ''}
		options={content.options as string[]}
		hint={content.hint as string}
		{disabled}
		{onAnswer}
	/>
{:else if type === 'grammar_transformation'}
	<GrammarTransformationQuestion
		sourceSentence={content.sourceSentence as string}
		instruction={(content.instruction as string) ?? ''}
		transformationType={content.transformationType as string}
		hint={content.hint as string}
		{disabled}
		{onAnswer}
	/>
{:else if type === 'kanji_composition'}
	<KanjiCompositionQuestion
		targetKanji={content.targetKanji as string}
		meaning={(content.meaning as string) ?? ''}
		radicals={content.radicals as { character: string; name: string }[]}
		distractorRadicals={content.distractorRadicals as { character: string; name: string }[]}
		{disabled}
		{onAnswer}
	/>
{:else if type === 'minimal_pair_discrimination'}
	<MinimalPairQuestion
		question={(content.question as string) ?? ''}
		audioText={content.audioText as string}
		options={content.options as { text: string; isCorrect: boolean }[]}
		{disabled}
		{hasApiKey}
		{onAnswer}
		{onSkip}
	/>
{:else}
	<div class="rounded-xl border-2 border-dashed border-text-muted/30 p-8 text-center">
		<p class="text-lg font-medium text-text-light">
			{m['lesson.unsupportedType']()}: {type}
		</p>
		{#if correctAnswer}
			<button
				onclick={() => onAnswer(correctAnswer)}
				class="btn btn-secondary mt-4"
			>
				{m['lesson.skip']()}
			</button>
		{/if}
	</div>
{/if}