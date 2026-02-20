<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	interface Props {
		words: string[];
		instruction: string;
		disabled: boolean;
		onAnswer: (answer: string) => void;
	}

	let { words, instruction, disabled, onAnswer }: Props = $props();

	// State for selected words (the answer being built)
	let selectedWords = $state<string[]>([]);

	// Available words pool (words not yet selected) - track by index to handle duplicates
	const initialIndices = $derived(words.map((_, i) => i));
	let availableIndices = $state<number[]>([]);

	// Initialize availableIndices when words change
	$effect(() => {
		availableIndices = initialIndices;
		selectedWords = [];
	});

	function selectWord(index: number) {
		if (disabled) return;
		// Remove from available, add word to selected
		availableIndices = availableIndices.filter((i) => i !== index);
		selectedWords = [...selectedWords, words[index]];
	}

	function removeWord(selectedIndex: number) {
		if (disabled) return;
		// Find the original word index to add back
		const word = selectedWords[selectedIndex];
		// Find the first index in original words array that matches and isn't already available
		const originalIndex = words.findIndex((w, i) => w === word && !availableIndices.includes(i));
		if (originalIndex !== -1) {
			availableIndices = [...availableIndices, originalIndex].sort((a, b) => a - b);
		}
		selectedWords = selectedWords.filter((_, i) => i !== selectedIndex);
	}

	function submit() {
		if (selectedWords.length === words.length && !disabled) {
			// Join words with spaces to form the answer
			onAnswer(selectedWords.join(' '));
		}
	}

	function reset() {
		if (disabled) return;
		selectedWords = [];
		availableIndices = words.map((_, i) => i);
	}
</script>

<div class="card">
	<h2 class="mb-2 text-lg font-bold text-text-light">{m['lesson.types.wordOrder']()}</h2>
	{#if instruction}
		<p class="mb-4 text-text-muted">{instruction}</p>
	{:else}
		<p class="mb-4 text-text-muted">{m['lesson.wordOrder.tapToArrange']()}</p>
	{/if}

	<!-- Answer area - selected words -->
	<div
		class="mb-6 min-h-16 rounded-xl border-2 border-dashed border-border-light bg-bg-light/50 p-4"
	>
		{#if selectedWords.length === 0}
			<p class="text-center text-text-muted">{m['lesson.wordOrder.tapWordsHere']()}</p>
		{:else}
			<div class="flex flex-wrap gap-2">
				{#each selectedWords as word, index}
					<button
						onclick={() => removeWord(index)}
						{disabled}
						class="rounded-xl border-2 border-primary bg-primary/10 px-4 py-2 font-medium text-primary transition-all hover:bg-primary/20
							{disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}"
					>
						{word}
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Available words pool -->
	<div class="flex flex-wrap justify-center gap-2">
		{#each availableIndices as index}
			<button
				onclick={() => selectWord(index)}
				{disabled}
				class="rounded-xl border-2 border-border-light bg-white px-4 py-2 font-medium text-text-light transition-all hover:border-primary/50 hover:bg-primary/5
					{disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}"
			>
				{words[index]}
			</button>
		{/each}
	</div>

	<!-- Reset button -->
	{#if selectedWords.length > 0 && !disabled}
		<div class="mt-4 text-center">
			<button onclick={reset} class="text-sm text-text-muted hover:text-primary hover:underline">
				{m['lesson.wordOrder.reset']()}
			</button>
		</div>
	{/if}

	<!-- Submit button -->
	{#if !disabled}
		<button
			onclick={submit}
			disabled={selectedWords.length !== words.length}
			class="btn btn-success btn-lg mt-6 w-full"
		>
			{m['lesson.checkAnswer']()}
		</button>
	{/if}
</div>
