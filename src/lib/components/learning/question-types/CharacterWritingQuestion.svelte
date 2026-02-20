<script lang="ts">
	import { i18n, t } from '$lib/i18n/index.svelte';

	interface Props {
		promptEn: string;
		promptDe: string;
		reading: string;
		hintEn?: string;
		hintDe?: string;
		characterType: 'hiragana' | 'katakana' | 'kanji';
		disabled: boolean;
		onAnswer: (answer: string) => void;
	}

	let { promptEn, promptDe, reading, hintEn, hintDe, characterType, disabled, onAnswer }: Props =
		$props();

	const promptText = $derived(i18n.locale === 'de' ? promptDe : promptEn);
	const hintText = $derived(i18n.locale === 'de' ? hintDe : hintEn);

	let answer = $state('');

	function submit() {
		if (answer.trim() && !disabled) {
			onAnswer(answer.trim());
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && answer.trim() && !disabled) {
			submit();
		}
	}
</script>

<div class="card">
	<h2 class="mb-2 text-lg font-bold text-text-light">
		{t('lesson.types.characterWriting') || 'Character Writing'}
	</h2>

	<div class="mb-8 text-center">
		<p class="mb-2 text-xl text-text-light">{promptText}</p>
		<div class="mb-4 text-4xl font-bold text-primary">{reading}</div>

		{#if hintText}
			<p class="text-sm text-text-muted">
				{t('lesson.hint')}: {hintText}
			</p>
		{/if}
	</div>

	<input
		type="text"
		bind:value={answer}
		onkeydown={handleKeydown}
		placeholder={t('lesson.typeAnswer')}
		{disabled}
		class="input mb-6 h-20 w-full text-center text-4xl"
		lang="ja"
	/>

	{#if !disabled}
		<button onclick={submit} disabled={!answer.trim()} class="btn btn-success btn-lg w-full">
			{t('lesson.checkAnswer')}
		</button>
	{/if}
</div>
