<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	interface Props {
		translation: string;
		sentence: string;
		infinitive: string;
		targetTense: string;
		hint?: string;
		disabled: boolean;
		onAnswer: (answer: string) => void;
	}

	let { translation, sentence, infinitive, targetTense, hint, disabled, onAnswer }: Props =
		$props();

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
		{m['lesson.types.conjugationCloze']() || 'Conjugation Practice'}
	</h2>

	<div class="mb-6">
		<p class="mb-2 text-xl leading-relaxed text-text-light">
			{#each sentence.split('_____') as part, i}
				{part}
				{#if i < sentence.split('_____').length - 1}
					<span class="mx-1 inline-block min-w-24 border-b-2 border-primary align-bottom"></span>
				{/if}
			{/each}
		</p>
		<p class="text-text-muted italic">{translation}</p>
	</div>

	<div class="mb-6 rounded-xl border border-border-light bg-bg-light-secondary p-4">
		<p class="mb-1 text-sm font-medium text-text-muted">{m['lesson.hint']() || 'Hint'}:</p>
		<div class="flex flex-wrap gap-4">
			<div class="badge badge-primary">{infinitive}</div>
			<div class="badge badge-secondary">{targetTense}</div>
		</div>
		{#if hint}
			<p class="mt-2 text-sm text-text-muted">{hint}</p>
		{/if}
	</div>

	<input
		type="text"
		bind:value={answer}
		onkeydown={handleKeydown}
		placeholder={m['lesson.typeAnswer']()}
		{disabled}
		class="input mb-6 w-full text-lg"
	/>

	{#if !disabled}
		<button onclick={submit} disabled={!answer.trim()} class="btn btn-success btn-lg w-full">
			{m['lesson.checkAnswer']()}
		</button>
	{/if}
</div>
