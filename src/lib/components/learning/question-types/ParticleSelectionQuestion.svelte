<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	interface Props {
		sentence: string;
		translation: string;
		options: string[];
		hint?: string;
		disabled: boolean;
		onAnswer: (answer: string) => void;
	}

	let { sentence, translation, options, hint, disabled, onAnswer }: Props = $props();

	let selectedOption = $state<string | null>(null);

	function selectOption(option: string) {
		if (disabled) return;
		selectedOption = option;
		onAnswer(option);
	}
</script>

<div class="card">
	<h2 class="mb-2 text-lg font-bold text-text-light">
		{m['lesson.types.particleSelection']() || 'Select Particle'}
	</h2>

	<div class="mb-8">
		<p class="mb-2 text-2xl leading-relaxed font-medium text-text-light">
			{#each sentence.split('_____') as part, i}
				{part}
				{#if i < sentence.split('_____').length - 1}
					<span
						class="mx-1 inline-block min-w-12 border-b-2 border-primary text-center font-bold text-primary"
					>
						{selectedOption || '___'}
					</span>
				{/if}
			{/each}
		</p>
		<p class="text-text-muted italic">{translation}</p>
		{#if hint}
			<p class="mt-2 text-sm text-text-muted">{m['lesson.hint']()}: {hint}</p>
		{/if}
	</div>

	<div class="flex flex-wrap justify-center gap-3">
		{#each options as option}
			<button
				onclick={() => selectOption(option)}
				{disabled}
				class="min-w-16 rounded-xl border-2 p-4 text-center text-xl font-bold transition-all
					{selectedOption === option
					? 'border-primary bg-primary/10 text-primary'
					: 'border-border-light text-text-light hover:border-primary/50'}
					{disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}"
			>
				{option}
			</button>
		{/each}
	</div>
</div>
