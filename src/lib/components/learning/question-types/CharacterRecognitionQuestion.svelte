<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	interface Props {
		character: string;
		question: string;
		options: string[];
		characterType: 'hiragana' | 'katakana' | 'kanji';
		disabled: boolean;
		onAnswer: (answer: string) => void;
	}

	let { character, question, options, characterType, disabled, onAnswer }: Props = $props();

	let selectedOption = $state<string | null>(null);

	function selectOption(option: string) {
		if (disabled) return;
		selectedOption = option;
		onAnswer(option);
	}
</script>

<div class="card">
	<h2 class="mb-2 text-lg font-bold text-text-light">
		{m['lesson.types.characterRecognition']() || 'Character Recognition'}
	</h2>

	<div class="mb-8 flex flex-col items-center justify-center">
		<div class="mb-4 text-8xl font-bold text-text-light">
			{character}
		</div>
		<p class="text-center text-xl text-text-muted">{question}</p>
	</div>

	<div class="grid grid-cols-2 gap-4">
		{#each options as option}
			<button
				onclick={() => selectOption(option)}
				{disabled}
				class="w-full rounded-xl border-2 p-6 text-center text-xl font-medium transition-all
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
