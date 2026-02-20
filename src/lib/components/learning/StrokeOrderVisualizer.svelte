<script lang="ts">
	interface Props {
		character: string;
		strokeCount: number;
		characterType: 'hiragana' | 'katakana' | 'kanji';
	}

	let { character, strokeCount, characterType }: Props = $props();

	const typeLabels = {
		hiragana: 'ひらがな',
		katakana: 'カタカナ',
		kanji: '漢字'
	};
</script>

<div class="flex flex-col items-center justify-center p-8">
	<div
		class="bg-surface-100 relative flex h-48 w-48 items-center justify-center rounded-3xl border-4 border-primary/20 text-9xl font-bold text-text-dark shadow-lg"
	>
		{character}
		<div
			class="bg-accent absolute -top-4 -right-4 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white shadow-md"
		>
			{strokeCount}
		</div>
	</div>

	<div class="mt-6 flex flex-col items-center gap-2">
		<span
			class="rounded-full bg-primary/10 px-4 py-1 text-sm font-bold tracking-wider text-primary uppercase"
		>
			{typeLabels[characterType]}
		</span>
		<p class="text-sm text-text-light">
			{strokeCount} strokes
		</p>
	</div>
</div>
