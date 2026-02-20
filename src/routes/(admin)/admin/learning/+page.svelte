<script lang="ts">
	import type { PageData } from './$types';
	import { t } from '$lib/i18n/index.svelte';

	let { data }: { data: PageData } = $props();

	const totalConcepts = $derived(
		data.stats.conceptsByLanguage.reduce((sum, row) => sum + row.count, 0)
	);
	const totalSkills = $derived(
		data.stats.skillsByLanguage.reduce((sum, row) => sum + row.count, 0)
	);
</script>

<svelte:head>
	<title>{t('admin.learning.title', { defaultValue: 'Learning Overview' })} - OpenLingo</title>
</svelte:head>

<div class="space-y-8">
	<div>
		<h1 class="text-3xl font-bold text-text-light">
			{t('admin.learning.title', { defaultValue: 'Learning Overview' })}
		</h1>
		<p class="text-text-muted">
			{t('admin.learning.subtitle', {
				defaultValue: 'Read-only learning content health and coverage.'
			})}
		</p>
	</div>

	<div class="grid gap-4 sm:grid-cols-3">
		<div class="card">
			<p class="text-sm text-text-muted">
				{t('admin.learning.totalConcepts', { defaultValue: 'Total Concepts' })}
			</p>
			<p class="text-3xl font-bold text-primary">{totalConcepts}</p>
		</div>
		<div class="card">
			<p class="text-sm text-text-muted">
				{t('admin.learning.totalSkills', { defaultValue: 'Total Skills' })}
			</p>
			<p class="text-3xl font-bold text-success">{totalSkills}</p>
		</div>
		<div class="card">
			<p class="text-sm text-text-muted">
				{t('admin.learning.linkedQuestions', { defaultValue: 'Questions Linked to Concepts' })}
			</p>
			<p class="text-3xl font-bold text-yellow-dark">{data.stats.questionCount}</p>
		</div>
	</div>

	<div class="grid gap-4 lg:grid-cols-2">
		<div class="card">
			<h2 class="mb-4 text-lg font-bold text-text-light">
				{t('admin.learning.conceptsByLanguage', { defaultValue: 'Concepts by Language and Type' })}
			</h2>
			<div class="space-y-2">
				{#each data.stats.conceptsByLanguage as row}
					<div
						class="bg-surface-100 flex items-center justify-between rounded-lg px-3 py-2 text-sm"
					>
						<span class="text-text-light">{row.languageCode.toUpperCase()} · {row.type}</span>
						<span class="font-semibold text-primary">{row.count}</span>
					</div>
				{/each}
			</div>
		</div>

		<div class="card">
			<h2 class="mb-4 text-lg font-bold text-text-light">
				{t('admin.learning.skillsByLanguage', { defaultValue: 'Skills by Language' })}
			</h2>
			<div class="space-y-2">
				{#each data.stats.skillsByLanguage as row}
					<div
						class="bg-surface-100 flex items-center justify-between rounded-lg px-3 py-2 text-sm"
					>
						<span class="text-text-light"
							>{row.languageCode.toUpperCase()} · {row.languageName}</span
						>
						<span class="font-semibold text-success">{row.count}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="overflow-x-auto card">
		<h2 class="mb-4 text-lg font-bold text-text-light">
			{t('admin.learning.skillsTable', { defaultValue: 'Skills Overview' })}
		</h2>
		<table class="w-full min-w-[720px] text-left text-sm">
			<thead>
				<tr class="border-b border-border-light text-text-muted">
					<th class="px-3 py-2">{t('admin.learning.key', { defaultValue: 'Key' })}</th>
					<th class="px-3 py-2">{t('admin.learning.type', { defaultValue: 'Type' })}</th>
					<th class="px-3 py-2">{t('admin.learning.level', { defaultValue: 'CEFR' })}</th>
					<th class="px-3 py-2">{t('admin.learning.conceptCount', { defaultValue: 'Concepts' })}</th
					>
					<th class="px-3 py-2">{t('admin.learning.status', { defaultValue: 'Status' })}</th>
				</tr>
			</thead>
			<tbody>
				{#each data.skills as skill}
					<tr class="border-b border-border-light/60">
						<td class="px-3 py-2 font-medium text-text-light">{skill.key}</td>
						<td class="px-3 py-2 text-text-light">{skill.type}</td>
						<td class="px-3 py-2 text-text-light">{skill.cefrLevel ?? '—'}</td>
						<td class="px-3 py-2 text-text-light">{skill.conceptCount}</td>
						<td class="px-3 py-2">
							<span
								class="rounded-full px-2 py-1 text-xs font-semibold {skill.isActive
									? 'bg-success/15 text-success'
									: 'bg-surface-100 text-text-muted'}"
							>
								{skill.isActive
									? t('common.active', { defaultValue: 'Active' })
									: t('common.inactive', { defaultValue: 'Inactive' })}
							</span>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
