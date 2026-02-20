<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
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
	<h2 class="mb-2 text-lg font-bold text-text-light">{m["lesson.types.fillBlank"]()}</h2>

	<p class="mb-6 text-xl text-text-light">
		{#each sentence.split('_____') as part, i}
			{part}
			{#if i < sentence.split('_____').length - 1}
				<span class="mx-1 inline-block min-w-24 border-b-2 border-primary"></span>
			{/if}
		{/each}
	</p>

	{#if hint}
		<p class="mb-4 text-sm text-text-muted">
			{m["lesson.hint"]()}: {hint}
		</p>
	{/if}

	<input
		type="text"
		bind:value={answer}
		onkeydown={handleKeydown}
		placeholder={m["lesson.typeAnswer"]()}
		{disabled}
		class="input text-lg"
	/>

	{#if !disabled}
		<button onclick={submit} disabled={!answer.trim()} class="btn btn-success btn-lg mt-6 w-full">
			{m["lesson.checkAnswer"]()}
		</button>
	{/if}
</div>
