<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { t } from '$lib/i18n/index.svelte';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let showCreateModal = $state(false);
	let deleteConfirm = $state<number | null>(null);

	/**
	 * Parse translation JSON and extract value for language
	 * Handles: {"en":"...", "de":"..."} or plain strings
	 */
	function getTranslation(value: string | null, lang: 'en' | 'de'): string {
		if (!value) return '';
		if (value.startsWith('{')) {
			try {
				const parsed = JSON.parse(value);
				return parsed[lang] || parsed.en || '';
			} catch {
				return value;
			}
		}
		return value;
	}
</script>

<svelte:head>
	<title>{t('admin.lessons.title')} - OpenLingo</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-text-light">{t('admin.lessons.title')}</h1>
		<div class="flex gap-2">
			<a href="/admin/lessons/generate" class="btn btn-primary btn-md">
				&#9889; {t('admin.lessons.aiGenerate')}
			</a>
			<button onclick={() => (showCreateModal = true)} class="btn btn-success btn-md">
				+ {t('admin.lessons.create')}
			</button>
		</div>
	</div>

	{#if form?.error}
		<div class="rounded-xl bg-error/10 p-4 text-error">{form.error}</div>
	{/if}

	{#if form?.success}
		<div class="rounded-xl bg-success/10 p-4 text-success">{t('common.success')}</div>
	{/if}

	<!-- Lessons Table -->
	{#if data.lessons.length === 0}
		<div class="card text-center">
			<p class="text-text-muted">{t('admin.lessons.noLessons')}</p>
		</div>
	{:else}
		<div class="card overflow-hidden p-0">
			<table class="w-full">
				<thead class="bg-bg-light-secondary">
					<tr>
						<th class="px-4 py-3 text-left text-sm font-medium text-text-muted">{t('admin.lessons.form.title')} (EN)</th>
						<th class="hidden px-4 py-3 text-left text-sm font-medium text-text-muted lg:table-cell">{t('admin.lessons.form.title')} (DE)</th>
						<th class="hidden px-4 py-3 text-left text-sm font-medium text-text-muted md:table-cell">Level</th>
						<th class="px-4 py-3 text-center text-sm font-medium text-text-muted">{t('admin.lessons.questions')}</th>
						<th class="px-4 py-3 text-center text-sm font-medium text-text-muted">Status</th>
						<th class="px-4 py-3 text-right text-sm font-medium text-text-muted">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border-light">
					{#each data.lessons as lesson}
						<tr class="hover:bg-bg-light-secondary">
							<td class="px-4 py-3">
								<div>
									<div class="font-medium text-text-light">{getTranslation(lesson.title, 'en') || 'Untitled'}</div>
									<div class="text-xs text-text-muted">{lesson.unitTitle}</div>
								</div>
							</td>
							<td class="hidden px-4 py-3 lg:table-cell">
								<div class="font-medium text-text-light">
									{getTranslation(lesson.title, 'de') || '—'}
								</div>
							</td>
							<td class="hidden px-4 py-3 md:table-cell">
								<span class="rounded-lg bg-success/10 px-2 py-1 text-sm font-medium text-success">
									{lesson.levelCode}
								</span>
							</td>
							<td class="px-4 py-3 text-center">
								<span class="font-medium">{lesson.questionCount}</span>
							</td>
							<td class="px-4 py-3 text-center">
								<form method="POST" action="?/togglePublish" use:enhance class="inline">
									<input type="hidden" name="lessonId" value={lesson.id} />
									<input type="hidden" name="isPublished" value={lesson.isPublished} />
									<button
										type="submit"
										class="rounded-full px-3 py-1 text-xs font-medium {lesson.isPublished
											? 'bg-success/10 text-success'
											: 'bg-yellow/10 text-yellow-dark'}"
									>
										{lesson.isPublished ? t('admin.lessons.published') : t('admin.lessons.draft')}
									</button>
								</form>
							</td>
							<td class="px-4 py-3 text-right">
								<div class="flex items-center justify-end gap-2">
									<a href="/admin/lessons/{lesson.id}" class="text-primary hover:underline">
										{t('common.edit')}
									</a>
									{#if deleteConfirm === lesson.id}
										<form method="POST" action="?/delete" use:enhance class="inline">
											<input type="hidden" name="lessonId" value={lesson.id} />
											<button type="submit" class="text-error hover:underline">Confirm</button>
										</form>
										<button onclick={() => (deleteConfirm = null)} class="text-text-muted hover:underline">
											{t('common.cancel')}
										</button>
									{:else}
										<button onclick={() => (deleteConfirm = lesson.id)} class="text-error hover:underline">
											{t('common.delete')}
										</button>
									{/if}
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<!-- Create Modal -->
{#if showCreateModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="card w-full max-w-lg">
			<h2 class="text-xl font-bold text-text-light">{t('admin.lessons.create')}</h2>

			<form method="POST" action="?/create" use:enhance class="mt-4 space-y-4">
				<!-- Title (English and German) -->
				<div class="grid gap-4 md:grid-cols-2">
					<div>
						<label for="title" class="block text-sm font-medium text-text-light">
							{t('admin.lessons.form.title')} (EN) *
						</label>
						<input type="text" id="title" name="title" required class="input mt-1" placeholder="English title" />
					</div>
					<div>
						<label for="titleDe" class="block text-sm font-medium text-text-light">
							{t('admin.lessons.form.title')} (DE)
						</label>
						<input type="text" id="titleDe" name="titleDe" class="input mt-1" placeholder="German title (optional)" />
					</div>
				</div>

				<!-- Description (English and German) -->
				<div class="grid gap-4 md:grid-cols-2">
					<div>
						<label for="description" class="block text-sm font-medium text-text-light">
							{t('admin.lessons.form.description')} (EN)
						</label>
						<textarea id="description" name="description" rows="2" class="input mt-1" placeholder="English description"></textarea>
					</div>
					<div>
						<label for="descriptionDe" class="block text-sm font-medium text-text-light">
							{t('admin.lessons.form.description')} (DE)
						</label>
						<textarea id="descriptionDe" name="descriptionDe" rows="2" class="input mt-1" placeholder="German description (optional)"></textarea>
					</div>
				</div>

				<div>
					<label for="unitId" class="block text-sm font-medium text-text-light">
						{t('admin.lessons.form.unit')} *
					</label>
					<select id="unitId" name="unitId" required class="input mt-1">
						<option value="">Select a unit...</option>
						{#each data.units as unit}
							<option value={unit.id}>[{unit.levelCode}] {getTranslation(unit.title, 'en')}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="xpReward" class="block text-sm font-medium text-text-light">
						{t('admin.lessons.form.xpReward')}
					</label>
					<input type="number" id="xpReward" name="xpReward" value="10" min="1" class="input mt-1" />
				</div>

				<div class="flex items-center gap-2">
					<input type="checkbox" id="isPublished" name="isPublished" class="h-4 w-4" />
					<label for="isPublished" class="text-sm text-text-light">
						{t('admin.lessons.form.isPublished')}
					</label>
				</div>

				<div class="flex justify-end gap-4 pt-4">
					<button type="button" onclick={() => (showCreateModal = false)} class="btn btn-ghost btn-md">
						{t('common.cancel')}
					</button>
					<button type="submit" class="btn btn-success btn-md">
						{t('common.create')}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
