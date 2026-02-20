<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	interface Props {
		prompt: string;
		reading: string;
		hint?: string;
		characterType: 'hiragana' | 'katakana' | 'kanji';
		disabled: boolean;
		onAnswer: (answer: string) => void;
	}

	let { prompt, reading, hint, characterType, disabled, onAnswer }: Props = $props();

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
		{m['lesson.types.characterWriting']() || 'Character Writing'}
	</h2>

	<div class="mb-8 text-center">
		<p class="mb-2 text-xl text-text-light">{prompt}</p>
		<div class="mb-4 text-4xl font-bold text-primary">{reading}</div>

		{#if hint}
			<p class="text-sm text-text-muted">
				{m['lesson.hint']()}: {hint}
			</p>
		{/if}
	</div>

	<input
		type="text"
		bind:value={answer}
		onkeydown={handleKeydown}
		placeholder={m['lesson.typeAnswer']()}
		{disabled}
		class="input mb-6 h-20 w-full text-center text-4xl"
		lang="ja"
	/>

	{#if !disabled}
		<button onclick={submit} disabled={!answer.trim()} class="btn btn-success btn-lg w-full">
			{m['lesson.checkAnswer']()}
		</button>
	{/if}
</div>
