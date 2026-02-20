<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	interface Props {
		reading: string;
		characterType: string;
		hint?: string;
		disabled: boolean;
		onAnswer: (answer: string) => void;
	}

	let { reading, characterType, hint, disabled, onAnswer }: Props = $props();

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
	<h2 class="mb-2 text-lg font-bold text-text-light">{m['lesson.types.characterWriting']()}</h2>

	<div class="mb-8 flex flex-col items-center justify-center">
		<span
			class="mb-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium tracking-wider text-primary uppercase"
		>
			{characterType}
		</span>
		<p class="text-3xl font-bold text-text-light">{reading}</p>
	</div>

	{#if hint}
		<p class="mb-4 text-sm text-text-muted">
			{m['lesson.hint']()}: {hint}
		</p>
	{/if}

	<input
		type="text"
		bind:value={answer}
		onkeydown={handleKeydown}
		placeholder={m['lesson.typeAnswer']()}
		{disabled}
		class="input text-lg"
	/>

	{#if !disabled}
		<button onclick={submit} disabled={!answer.trim()} class="btn btn-success btn-lg mt-6 w-full">
			{m['lesson.checkAnswer']()}
		</button>
	{/if}
</div>
