<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
interface Props {
		questionText: string;
		options: string[];
		disabled: boolean;
		onAnswer: (answer: string) => void;
	}

	let { questionText, options, disabled, onAnswer }: Props = $props();

	let selectedOption = $state<string | null>(null);

	function selectOption(option: string) {
		if (disabled) return;
		selectedOption = option;
	}

	function submit() {
		if (selectedOption && !disabled) {
			onAnswer(selectedOption);
		}
	}
</script>

<div class="card">
	<h2 class="mb-2 text-lg font-bold text-text-light">{m["lesson.types.multipleChoice"]()}</h2>
	<p class="mb-6 text-xl text-text-light">{questionText}</p>

	<div class="space-y-3">
		{#each options as option}
			<button
				onclick={() => selectOption(option)}
				{disabled}
				class="w-full rounded-xl border-2 p-4 text-left font-medium transition-all
					{selectedOption === option
					? 'border-primary bg-primary/10 text-primary'
					: 'border-border-light text-text-light hover:border-primary/50'}
					{disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}"
			>
				{option}
			</button>
		{/each}
	</div>

	{#if !disabled}
		<button onclick={submit} disabled={!selectedOption} class="btn btn-success btn-lg mt-6 w-full">
			{m["lesson.checkAnswer"]()}
		</button>
	{/if}
</div>
