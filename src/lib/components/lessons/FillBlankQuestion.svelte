<script lang="ts">
	import { t } from '$lib/i18n/index.svelte';

	interface Props {
		sentence: string;
		hint?: string;
		disabled: boolean;
		onAnswer: (answer: string) => void;
	}

	let { sentence, hint, disabled, onAnswer }: Props = $props();

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
	<h2 class="mb-2 text-lg font-bold text-text-light">{t('lesson.types.fillBlank')}</h2>

	<p class="mb-6 text-xl text-text-light">
		{#each sentence.split('_____') as part, i}
			{part}
			{#if i < sentence.split('_____').length - 1}
				<span class="inline-block min-w-24 border-b-2 border-primary mx-1"></span>
			{/if}
		{/each}
	</p>

	{#if hint}
		<p class="mb-4 text-sm text-text-muted">
			{t('lesson.hint')}: {hint}
		</p>
	{/if}

	<input
		type="text"
		bind:value={answer}
		onkeydown={handleKeydown}
		placeholder="Type your answer..."
		disabled={disabled}
		class="input text-lg"
	/>

	{#if !disabled}
		<button
			onclick={submit}
			disabled={!answer.trim()}
			class="btn btn-success btn-lg mt-6 w-full"
		>
			{t('lesson.checkAnswer')}
		</button>
	{/if}
</div>
