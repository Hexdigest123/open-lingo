<script lang="ts">
	import { getLocale } from '$lib/paraglide/runtime.js';
interface Props {
		infinitive: string;
		infinitiveEn: string;
		infinitiveDe: string;
		forms: Record<string, Record<string, string>>;
		highlightTense?: string;
		highlightPerson?: string;
	}

	let { infinitive, infinitiveEn, infinitiveDe, forms, highlightTense, highlightPerson }: Props =
		$props();

	const translation = $derived(getLocale() === 'de' ? infinitiveDe : infinitiveEn);

	// Extract tenses (keys of forms) and persons (keys of first tense object)
	const tenses = $derived(Object.keys(forms));
	const persons = $derived(tenses.length > 0 ? Object.keys(forms[tenses[0]]) : []);
</script>

<div
	class="bg-surface-100 w-full overflow-hidden rounded-2xl border-2 border-border-light shadow-sm"
>
	<div class="bg-primary/5 p-4 text-center">
		<h3 class="text-2xl font-bold text-primary">{infinitive}</h3>
		<p class="text-sm font-medium text-text-light">{translation}</p>
	</div>

	<div class="overflow-x-auto">
		<table class="w-full min-w-[300px] text-left text-sm">
			<thead>
				<tr class="bg-surface-200/50 border-b border-border-light">
					<th class="p-3 font-semibold text-text-light">Person</th>
					{#each tenses as tense}
						<th
							class="p-3 font-semibold text-text-light capitalize {highlightTense === tense
								? 'bg-accent/10 text-accent'
								: ''}"
						>
							{tense}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each persons as person}
					<tr class="hover:bg-surface-200/30 border-b border-border-light last:border-0">
						<td
							class="p-3 font-medium text-text-light {highlightPerson === person
								? 'bg-accent/10 text-accent'
								: ''}"
						>
							{person}
						</td>
						{#each tenses as tense}
							{@const isTarget = highlightTense === tense && highlightPerson === person}
							<td
								class="p-3 transition-colors {isTarget
									? 'bg-yellow-100 font-bold text-yellow-900 ring-2 ring-yellow-400 ring-inset'
									: ''}"
							>
								{forms[tense]?.[person] || '-'}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
