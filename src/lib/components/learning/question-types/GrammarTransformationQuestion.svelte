<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';
interface Props {
		sourceSentence: string;
		instructionEn: string;
		instructionDe: string;
		transformationType: string;
		hintEn?: string;
		hintDe?: string;
		disabled: boolean;
		onAnswer: (answer: string) => void;
	}

	let {
		sourceSentence,
		instructionEn,
		instructionDe,
		transformationType,
		hintEn,
		hintDe,
		disabled,
		onAnswer
	}: Props = $props();

	const instructionText = $derived(getLocale() === 'de' ? instructionDe : instructionEn);
	const hintText = $derived(getLocale() === 'de' ? hintDe : hintEn);

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
		{m["lesson.types.grammarTransformation"]() || 'Grammar Transformation'}
	</h2>

	<div class="mb-6">
		<p class="mb-4 text-center text-2xl font-medium text-text-light">{sourceSentence}</p>

		<div class="rounded-xl border border-border-light bg-bg-light-secondary p-4">
			<p class="mb-1 font-medium text-primary">{m["lesson.instruction"]() || 'Instruction'}:</p>
			<p class="text-text-light">{instructionText}</p>
			{#if hintText}
				<p class="mt-2 text-sm text-text-muted">{m["lesson.hint"]()}: {hintText}</p>
			{/if}
		</div>
	</div>

	<input
		type="text"
		bind:value={answer}
		onkeydown={handleKeydown}
		placeholder={m["lesson.typeAnswer"]()}
		{disabled}
		class="input mb-6 w-full text-lg"
	/>

	{#if !disabled}
		<button onclick={submit} disabled={!answer.trim()} class="btn btn-success btn-lg w-full">
			{m["lesson.checkAnswer"]()}
		</button>
	{/if}
</div>
