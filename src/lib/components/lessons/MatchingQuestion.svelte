<script lang="ts">
	import { i18n, t } from '$lib/i18n/index.svelte';

	interface Pair {
		target: string;
		english: string;
		spanish?: string;
	}

	interface Props {
		pairs: Pair[];
		targetLanguageName?: string;
		disabled: boolean;
		onAnswer: (answer: string) => void;
		onWrongMatch?: () => void;
	}

	let { pairs, targetLanguageName, disabled, onAnswer, onWrongMatch }: Props = $props();

	const resolvedTargetLanguageName = $derived(
		targetLanguageName || t('lesson.languages.targetLanguage')
	);

	// Show "German" or "English" based on locale
	const targetLanguageLabel = $derived(
		i18n.locale === 'de' ? t('lesson.languages.german') : t('lesson.languages.english')
	);

	let selectedTarget = $state<string | null>(null);
	let selectedEnglish = $state<string | null>(null);
	let matchedPairs = $state<Set<string>>(new Set());
	let wrongMatchPair = $state<{ target: string; english: string } | null>(null);

	// Shuffle arrays for display
	const targetWords = $derived(
		pairs
			.map((p) => p.target || p.spanish || '')
			.filter(Boolean)
			.sort(() => Math.random() - 0.5)
	);
	const englishWords = $derived(pairs.map((p) => p.english).sort(() => Math.random() - 0.5));

	function selectTarget(word: string) {
		if (disabled || matchedPairs.has(word)) return;
		selectedTarget = word;
		checkMatch();
	}

	function selectEnglish(word: string) {
		if (disabled || matchedPairs.has(word)) return;
		selectedEnglish = word;
		checkMatch();
	}

	function checkMatch() {
		if (selectedTarget && selectedEnglish) {
			const pair = pairs.find(
				(p) => (p.target || p.spanish) === selectedTarget && p.english === selectedEnglish
			);
			if (pair) {
				matchedPairs = new Set([...matchedPairs, selectedTarget, selectedEnglish]);
				// Reset selections after a short delay
				setTimeout(() => {
					selectedTarget = null;
					selectedEnglish = null;
				}, 300);
			} else {
				// Wrong match - show feedback and deduct heart
				wrongMatchPair = { target: selectedTarget, english: selectedEnglish };
				onWrongMatch?.();
				// Reset selections after showing error feedback
				setTimeout(() => {
					wrongMatchPair = null;
					selectedTarget = null;
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
		<div class="space-y-2">
			<div class="mb-2 text-center text-sm font-medium text-primary">
				{resolvedTargetLanguageName}
			</div>
			{#each targetWords as word}
				<button
					onclick={() => selectTarget(word)}
					disabled={disabled || matchedPairs.has(word)}
					class="w-full rounded-xl border-2 p-3 text-center font-medium transition-all
						{matchedPairs.has(word)
						? 'border-success/50 bg-success/10 text-success opacity-50'
						: wrongMatchPair?.target === word
							? 'animate-shake border-error bg-error/10 text-error'
							: selectedTarget === word
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
							? 'animate-shake border-error bg-error/10 text-error'
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
