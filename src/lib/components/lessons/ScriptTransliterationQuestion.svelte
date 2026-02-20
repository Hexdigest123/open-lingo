<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
interface Props {
		sourceText: string;
		sourceScript: string;
		targetScript: string;
		disabled: boolean;
		onAnswer: (answer: string) => void;
	}

	let { sourceText, sourceScript, targetScript, disabled, onAnswer }: Props = $props();

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
	<h2 class="mb-2 text-lg font-bold text-text-light">{m["lesson.types.scriptTransliteration"]()}</h2>

	<div class="mb-8 flex flex-col items-center justify-center">
		<div
			class="mb-2 flex items-center gap-2 text-sm font-medium tracking-wider text-text-muted uppercase"
		>
			<span>{sourceScript}</span>
			<span>→</span>
			<span class="text-primary">{targetScript}</span>
		</div>
		<p class="text-3xl font-bold text-text-light">{sourceText}</p>
	</div>

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
