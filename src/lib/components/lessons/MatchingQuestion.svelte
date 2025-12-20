<script lang="ts">
	import { i18n, t } from '$lib/i18n/index.svelte';

	interface Pair {
		spanish: string;
		english: string;
	}

	interface Props {
		pairs: Pair[];
		disabled: boolean;
		onAnswer: (answer: string) => void;
		onWrongMatch?: () => void;
	}

	let { pairs, disabled, onAnswer, onWrongMatch }: Props = $props();

	// Show "German" or "English" based on locale
	const targetLanguageLabel = $derived(
		i18n.locale === 'de' ? t('lesson.languages.german') : t('lesson.languages.english')
	);

	let selectedSpanish = $state<string | null>(null);
	let selectedEnglish = $state<string | null>(null);
	let matchedPairs = $state<Set<string>>(new Set());
	let wrongMatchPair = $state<{ spanish: string; english: string } | null>(null);

	// Shuffle arrays for display
	const spanishWords = $derived(pairs.map((p) => p.spanish).sort(() => Math.random() - 0.5));
	const englishWords = $derived(pairs.map((p) => p.english).sort(() => Math.random() - 0.5));

	function selectSpanish(word: string) {
		if (disabled || matchedPairs.has(word)) return;
		selectedSpanish = word;
		checkMatch();
	}

	function selectEnglish(word: string) {
		if (disabled || matchedPairs.has(word)) return;
		selectedEnglish = word;
		checkMatch();
	}

	function checkMatch() {
		if (selectedSpanish && selectedEnglish) {
			const pair = pairs.find((p) => p.spanish === selectedSpanish && p.english === selectedEnglish);
			if (pair) {
				matchedPairs = new Set([...matchedPairs, selectedSpanish, selectedEnglish]);
				// Reset selections after a short delay
				setTimeout(() => {
					selectedSpanish = null;
					selectedEnglish = null;
				}, 300);
			} else {
				// Wrong match - show feedback and deduct heart
				wrongMatchPair = { spanish: selectedSpanish, english: selectedEnglish };
				onWrongMatch?.();
				// Reset selections after showing error feedback
				setTimeout(() => {
					wrongMatchPair = null;
					selectedSpanish = null;
					selectedEnglish = null;
				}, 600);
			}
		}
	}

	$effect(() => {
		// Check if all pairs are matched
		if (matchedPairs.size === pairs.length * 2 && !disabled) {
			onAnswer('all_matched');
		}
	});
</script>

<div class="card">
	<h2 class="mb-2 text-lg font-bold text-text-light">{t('lesson.types.matching')}</h2>
	<p class="mb-6 text-text-muted">{t('lesson.tapToMatch')}</p>

	<div class="grid grid-cols-2 gap-4">
		<!-- Spanish Column -->
		<div class="space-y-2">
			<div class="mb-2 text-center text-sm font-medium text-primary">{t('lesson.languages.spanish')}</div>
			{#each spanishWords as word}
				<button
					onclick={() => selectSpanish(word)}
					disabled={disabled || matchedPairs.has(word)}
					class="w-full rounded-xl border-2 p-3 text-center font-medium transition-all
						{matchedPairs.has(word)
							? 'border-success/50 bg-success/10 text-success opacity-50'
							: wrongMatchPair?.spanish === word
								? 'border-error bg-error/10 text-error animate-shake'
								: selectedSpanish === word
									? 'border-primary bg-primary/10 text-primary'
									: 'border-border-light text-text-light hover:border-primary/50'}
						{disabled ? 'cursor-not-allowed' : 'cursor-pointer'}"
				>
					{word}
				</button>
			{/each}
		</div>

		<!-- Target Language Column (English or German based on locale) -->
		<div class="space-y-2">
			<div class="mb-2 text-center text-sm font-medium text-success">{targetLanguageLabel}</div>
			{#each englishWords as word}
				<button
					onclick={() => selectEnglish(word)}
					disabled={disabled || matchedPairs.has(word)}
					class="w-full rounded-xl border-2 p-3 text-center font-medium transition-all
						{matchedPairs.has(word)
							? 'border-success/50 bg-success/10 text-success opacity-50'
							: wrongMatchPair?.english === word
								? 'border-error bg-error/10 text-error animate-shake'
								: selectedEnglish === word
									? 'border-success bg-success/10 text-success'
									: 'border-border-light text-text-light hover:border-success/50'}
						{disabled ? 'cursor-not-allowed' : 'cursor-pointer'}"
				>
					{word}
				</button>
			{/each}
		</div>
	</div>

	<div class="mt-4 text-center text-sm text-text-muted">
		{t('lesson.matched')}: {matchedPairs.size / 2} / {pairs.length}
	</div>
</div>
