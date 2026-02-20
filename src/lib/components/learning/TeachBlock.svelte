<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';
import StrokeOrderVisualizer from './StrokeOrderVisualizer.svelte';
	import GrammarDiagram from './GrammarDiagram.svelte';
	import ConjugationTable from './ConjugationTable.svelte';
	import { Lightbulb } from 'lucide-svelte';

	interface Props {
		titleEn: string;
		titleDe: string;
		explanationEn: string;
		explanationDe: string;
		examples: Array<{ target: string; en: string; de: string }>;
		visualAid?: {
			type: 'table' | 'stroke_order' | 'diagram';
			payload: Record<string, unknown>;
		};
		tipsEn?: string[];
		tipsDe?: string[];
		onContinue: () => void;
	}

	let {
		titleEn,
		titleDe,
		explanationEn,
		explanationDe,
		examples,
		visualAid,
		tipsEn,
		tipsDe,
		onContinue
	}: Props = $props();

	const title = $derived(getLocale() === 'de' ? titleDe : titleEn);
	const explanation = $derived(getLocale() === 'de' ? explanationDe : explanationEn);
	const tips = $derived(getLocale() === 'de' ? tipsDe : tipsEn);

	function getExampleTranslation(ex: { en: string; de: string }) {
		return getLocale() === 'de' ? ex.de : ex.en;
	}
</script>

<div class="mx-auto max-w-2xl space-y-8 pb-24">
	<div class="space-y-4">
		<h1 class="text-3xl font-bold text-text-dark">{title}</h1>
		<div class="prose prose-lg text-text-light">
			{#each explanation.split('\n') as paragraph}
				<p>{paragraph}</p>
			{/each}
		</div>
	</div>

	{#if visualAid}
		<div class="my-8 flex justify-center">
			{#if visualAid.type === 'stroke_order'}
				<StrokeOrderVisualizer
					character={visualAid.payload.character as string}
					strokeCount={visualAid.payload.strokeCount as number}
					characterType={visualAid.payload.characterType as 'hiragana' | 'katakana' | 'kanji'}
				/>
			{:else if visualAid.type === 'diagram'}
				<GrammarDiagram
					pattern={visualAid.payload.pattern as string}
					exampleTarget={visualAid.payload.exampleTarget as string}
					exampleEn={visualAid.payload.exampleEn as string}
					exampleDe={visualAid.payload.exampleDe as string}
					parts={visualAid.payload.parts as any}
				/>
			{:else if visualAid.type === 'table'}
				{#if visualAid.payload.forms}
					<ConjugationTable
						infinitive={visualAid.payload.infinitive as string}
						infinitiveEn={visualAid.payload.infinitiveEn as string}
						infinitiveDe={visualAid.payload.infinitiveDe as string}
						forms={visualAid.payload.forms as Record<string, Record<string, string>>}
						highlightTense={visualAid.payload.highlightTense as string}
						highlightPerson={visualAid.payload.highlightPerson as string}
					/>
				{:else}
					<div
						class="bg-surface-100 w-full overflow-hidden rounded-xl border border-border-light shadow-sm"
					>
						<table class="w-full text-left text-sm">
							<thead class="bg-surface-200/50">
								<tr>
									{#each (visualAid.payload.headers as string[]) || [] as header}
										<th class="p-3 font-semibold text-text-light">{header}</th>
									{/each}
								</tr>
							</thead>
							<tbody>
								{#each (visualAid.payload.rows as string[][]) || [] as row}
									<tr class="border-t border-border-light">
										{#each row as cell}
											<td class="p-3 text-text-light">{cell}</td>
										{/each}
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			{/if}
		</div>
	{/if}

	{#if examples.length > 0}
		<div class="space-y-4">
			<h3 class="text-lg font-bold tracking-wider text-text-light uppercase">
				{m["lesson.examples"]()}
			</h3>
			<div class="grid gap-4 sm:grid-cols-2">
				{#each examples as example}
					<div
						class="bg-surface-100 flex flex-col justify-between rounded-xl border-2 border-border-light p-4 transition-colors hover:border-primary/30"
					>
						<p class="mb-2 text-lg font-bold text-primary">{example.target}</p>
						<p class="text-sm text-text-light">{getExampleTranslation(example)}</p>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if tips && tips.length > 0}
		<div class="space-y-4">
			<h3 class="text-lg font-bold tracking-wider text-text-light uppercase">
				{m["lesson.tips"]()}
			</h3>
			{#each tips as tip}
				<div class="bg-accent/10 flex gap-4 rounded-xl p-4 text-text-dark">
					<span
						class="bg-accent/20 text-accent flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold"
					>
						<Lightbulb size={16} />
					</span>
					<p class="text-sm leading-relaxed">{tip}</p>
				</div>
			{/each}
		</div>
	{/if}

	<div class="bg-surface-100 fixed right-0 bottom-0 left-0 border-t border-border-light p-4">
		<div class="mx-auto max-w-2xl">
			<button onclick={onContinue} class="btn btn-primary btn-lg w-full shadow-lg">
				{m["lesson.continue"]()}
			</button>
		</div>
	</div>
</div>
