<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';
interface Radical {
		character: string;
		name: string;
	}

	interface Props {
		targetKanji: string;
		meaningEn: string;
		meaningDe: string;
		radicals: Radical[];
		distractorRadicals: Radical[];
		disabled: boolean;
		onAnswer: (answer: string) => void;
	}

	let {
		targetKanji,
		meaningEn,
		meaningDe,
		radicals,
		distractorRadicals,
		disabled,
		onAnswer
	}: Props = $props();

	const meaningText = $derived(getLocale() === 'de' ? meaningDe : meaningEn);

	// Combine and shuffle radicals
	const allRadicals = $derived(
		[...radicals, ...distractorRadicals].sort(() => Math.random() - 0.5)
	);

	let selectedRadicals = $state<Set<string>>(new Set());

	function toggleRadical(char: string) {
		if (disabled) return;
		const newSet = new Set(selectedRadicals);
		if (newSet.has(char)) {
			newSet.delete(char);
		} else {
			newSet.add(char);
		}
		selectedRadicals = newSet;
	}

	function submit() {
		if (selectedRadicals.size > 0 && !disabled) {
			// Join selected radicals as the answer
			onAnswer(Array.from(selectedRadicals).join(''));
		}
	}
</script>

<div class="card">
	<h2 class="mb-2 text-lg font-bold text-text-light">
		{m["lesson.types.kanjiComposition"]() || 'Kanji Composition'}
	</h2>

	<div class="mb-8 text-center">
		<p class="mb-2 text-sm tracking-wider text-text-muted uppercase">
			{m["lesson.meaning"]() || 'Meaning'}
		</p>
		<p class="mb-4 text-3xl font-bold text-text-light">{meaningText}</p>
		<p class="text-sm text-text-muted">
			{m["lesson.selectRadicals"]() || 'Select the parts that make up this Kanji'}
		</p>
	</div>

	<div class="mb-8 grid grid-cols-4 gap-3">
		{#each allRadicals as radical}
			<button
				onclick={() => toggleRadical(radical.character)}
				{disabled}
				class="flex aspect-square flex-col items-center justify-center rounded-xl border-2 p-2 transition-all
					{selectedRadicals.has(radical.character)
					? 'border-primary bg-primary/10 text-primary'
					: 'border-border-light text-text-light hover:border-primary/50'}
					{disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}"
				title={radical.name}
			>
				<span class="mb-1 font-serif text-3xl">{radical.character}</span>
				<span class="w-full truncate text-center text-[10px] text-text-muted">{radical.name}</span>
			</button>
		{/each}
	</div>

	{#if !disabled}
		<button
			onclick={submit}
			disabled={selectedRadicals.size === 0}
			class="btn btn-success btn-lg w-full"
		>
			{m["lesson.checkAnswer"]()}
		</button>
	{/if}
</div>
