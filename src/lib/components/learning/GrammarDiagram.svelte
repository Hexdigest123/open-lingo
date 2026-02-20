<script lang="ts">
	import { i18n } from '$lib/i18n/index.svelte';

	interface Props {
		pattern: string;
		exampleTarget: string;
		exampleEn: string;
		exampleDe: string;
		parts?: Array<{ text: string; role: string; color: string }>;
	}

	let { pattern, exampleTarget, exampleEn, exampleDe, parts }: Props = $props();

	const translation = $derived(i18n.locale === 'de' ? exampleDe : exampleEn);

	// Default colors if parts not provided
	const defaultColors = [
		'bg-blue-100 text-blue-800 border-blue-200',
		'bg-green-100 text-green-800 border-green-200',
		'bg-purple-100 text-purple-800 border-purple-200',
		'bg-orange-100 text-orange-800 border-orange-200',
		'bg-pink-100 text-pink-800 border-pink-200'
	];

	// Parse pattern if parts not provided
	const parsedParts = $derived.by(() => {
		if (parts) return parts;

		const regex = /\[(.*?)\]/g;
		let match: RegExpExecArray | null;
		const result = [];
		let lastIndex = 0;
		let colorIndex = 0;

		while (true) {
			match = regex.exec(pattern);
			if (!match) break;

			// Add text before match
			if (match.index > lastIndex) {
				result.push({
					text: pattern.substring(lastIndex, match.index),
					role: 'text',
					color: 'text-text-light'
				});
			}

			// Add match
			result.push({
				text: match[1],
				role: 'variable',
				color: defaultColors[colorIndex % defaultColors.length]
			});
			colorIndex++;

			lastIndex = regex.lastIndex;
		}

		// Add remaining text
		if (lastIndex < pattern.length) {
			result.push({
				text: pattern.substring(lastIndex),
				role: 'text',
				color: 'text-text-light'
			});
		}

		return result;
	});
</script>

<div
	class="bg-surface-100 flex flex-col gap-6 rounded-2xl border-2 border-border-light p-6 shadow-sm"
>
	<div class="flex flex-wrap items-center justify-center gap-2 text-lg font-medium">
		{#each parsedParts as part}
			{#if part.role === 'variable'}
				<span
					class="rounded-lg border px-3 py-1 shadow-sm transition-transform hover:scale-105 {part.color}"
				>
					{part.text}
				</span>
			{:else}
				<span class="px-1 text-text-light">{part.text}</span>
			{/if}
		{/each}
	</div>

	<div class="border-t border-border-light pt-4 text-center">
		<p class="mb-2 text-xl font-bold text-text-dark">{exampleTarget}</p>
		<p class="text-sm text-text-light italic">{translation}</p>
	</div>
</div>
