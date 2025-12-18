<script lang="ts">
	import type { PageData } from './$types';
	import { t } from '$lib/i18n/index.svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { getBilingualText } from '$lib/utils/bilingual';

	type LevelWithCount = {
		id: number;
		code: string;
		name: string;
		description: string | null;
		order: number;
		unitCount?: number;
	};

	let { data }: { data: PageData } = $props();

	// Handle error messages
	let showError = $state(!!data.error);

	function dismissError() {
		showError = false;
		// Remove error from URL
		goto('/lessons', { replaceState: true });
	}

	// Cast levels to include unitCount
	const levelsWithCount = $derived((data.levels || []) as LevelWithCount[]);

	// Track expanded units
	let expandedUnits = $state<Set<number>>(new Set());

	function toggleUnit(unitId: number) {
		if (expandedUnits.has(unitId)) {
			expandedUnits = new Set([...expandedUnits].filter((id) => id !== unitId));
		} else {
			expandedUnits = new Set([...expandedUnits, unitId]);
		}
	}

	function getLessonProgress(lessonId: number) {
		return data.userProgress?.find((p) => p.lessonId === lessonId);
	}

	function getStatusIcon(status: string | undefined) {
		switch (status) {
			case 'completed':
				return '✅';
			case 'mastered':
				return '⭐';
			case 'in_progress':
				return '📝';
			default:
				return '○';
		}
	}

	function getStatusColor(status: string | undefined) {
		switch (status) {
			case 'completed':
				return 'text-success';
			case 'mastered':
				return 'text-yellow';
			case 'in_progress':
				return 'text-primary';
			default:
				return 'text-text-muted';
		}
	}
</script>

<svelte:head>
	<title>{data.selectedLevel ? `${getBilingualText(data.selectedLevel.name)} - ` : ''}{t('nav.learn')} - OpenLingo</title>
</svelte:head>

{#if showError && data.error === 'no_hearts'}
	<div class="mb-6 rounded-xl bg-error/10 p-4 flex items-center justify-between">
		<div class="flex items-center gap-3">
			<span class="text-2xl">💔</span>
			<div>
				<p class="font-bold text-error">{t('lesson.outOfHearts.title')}</p>
				<p class="text-sm text-text-muted">{t('lesson.outOfHearts.message')}</p>
			</div>
		</div>
		<button onclick={dismissError} class="text-text-muted hover:text-text-light text-xl">
			✕
		</button>
	</div>
{/if}

<div class="space-y-8">
	{#if data.selectedLevel}
		<!-- Level Selected - Show Units and Lessons -->
		<div class="flex items-center gap-4">
			<a href="/lessons" class="text-text-muted hover:text-text-light">
				← {t('common.back')}
			</a>
			<div>
				<h1 class="text-2xl font-bold text-text-light">
					{data.selectedLevel.code}: {getBilingualText(data.selectedLevel.name)}
				</h1>
				<p class="text-text-muted">{getBilingualText(data.selectedLevel.description)}</p>
			</div>
		</div>

		{#if data.units.length > 0}
			<div class="space-y-4">
				{#each data.units as unit}
					<div class="card">
						<!-- Unit Header -->
						<button
							onclick={() => toggleUnit(unit.id)}
							class="flex w-full items-center justify-between text-left"
						>
							<div class="flex items-center gap-4">
								<div
									class="flex h-12 w-12 items-center justify-center rounded-xl text-white text-lg font-bold"
									style="background-color: {unit.themeColor || 'var(--color-primary)'};"
								>
									{unit.order}
								</div>
								<div>
									<h3 class="font-bold text-text-light">{getBilingualText(unit.title)}</h3>
									{#if unit.description}
										<p class="text-sm text-text-muted">{getBilingualText(unit.description)}</p>
									{/if}
									<p class="text-xs text-text-muted mt-1">
										{unit.lessons.length} {unit.lessons.length === 1 ? 'lesson' : 'lessons'}
									</p>
								</div>
							</div>
							<span class="text-2xl text-text-muted transition-transform {expandedUnits.has(unit.id) ? 'rotate-180' : ''}">
								▼
							</span>
						</button>

						<!-- Lessons List (Expandable) -->
						{#if expandedUnits.has(unit.id)}
							<div class="mt-4 border-t border-border-light pt-4 space-y-2">
								{#each unit.lessons as lesson}
									{@const progress = getLessonProgress(lesson.id)}
									{@const status = progress?.status}
									<div class="flex items-center justify-between rounded-xl bg-bg-light-secondary p-3">
										<div class="flex items-center gap-3">
											<span class="text-lg {getStatusColor(status)}">
												{getStatusIcon(status)}
											</span>
											<div>
												<p class="font-medium text-text-light">{getBilingualText(lesson.title)}</p>
												{#if lesson.description}
													<p class="text-xs text-text-muted">{getBilingualText(lesson.description)}</p>
												{/if}
											</div>
										</div>
										<div class="flex items-center gap-2">
											{#if status === 'completed' || status === 'mastered'}
												<span class="text-xs text-success font-medium">
													{progress?.score}%
												</span>
											{/if}
											<a
												href="/lessons/{lesson.id}"
												class="btn btn-sm {status === 'completed' || status === 'mastered' ? 'btn-ghost' : 'btn-success'}"
											>
												{status === 'completed' || status === 'mastered' ? t('lesson.practice') : t('lesson.start')}
											</a>
											{#if status !== 'completed' && status !== 'mastered'}
												<form method="POST" action="?/skip" use:enhance class="inline">
													<input type="hidden" name="lessonId" value={lesson.id} />
													<button type="submit" class="btn btn-sm btn-ghost text-text-muted">
														{t('lesson.skip')}
													</button>
												</form>
											{/if}
										</div>
									</div>
								{:else}
									<p class="text-center text-text-muted py-4">
										{t('lesson.noLessons')}
									</p>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{:else}
			<!-- No Units Yet -->
			<div class="card text-center py-12">
				<span class="text-6xl">🚧</span>
				<h3 class="mt-4 text-xl font-bold text-text-light">{t('lesson.comingSoon')}</h3>
				<p class="mt-2 text-text-muted">
					{t('lesson.unitsBeingPrepared')}
				</p>
				<a href="/lessons" class="btn btn-primary mt-4">
					← {t('lesson.backToLevels')}
				</a>
			</div>
		{/if}
	{:else}
		<!-- No Level Selected - Show Level Selection -->
		<div>
			<h1 class="text-2xl font-bold text-text-light">{t('lesson.spanishLessons')}</h1>
			<p class="text-text-muted">{t('lesson.chooseLevelToStart')}</p>
		</div>

		<!-- Levels Grid -->
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each levelsWithCount as level}
				<div class="card">
					<div class="flex items-start gap-4">
						<div
							class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-white text-2xl font-bold"
							style="background: linear-gradient(135deg, var(--color-success) 0%, var(--color-success-dark) 100%);"
						>
							{level.code}
						</div>
						<div class="flex-1">
							<h3 class="font-bold text-text-light">{getBilingualText(level.name)}</h3>
							<p class="mt-1 text-sm text-text-muted">{getBilingualText(level.description)}</p>
							<p class="mt-1 text-xs text-text-muted">
								{level.unitCount || 0} {(level.unitCount || 0) === 1 ? 'unit' : 'units'}
							</p>
							<div class="mt-4">
								{#if (level.unitCount || 0) > 0}
									<a href="/lessons?level={level.code}" class="btn btn-success btn-sm">
										{t('lesson.startLearning')}
									</a>
								{:else}
									<span class="text-sm text-text-muted">{t('lesson.comingSoon')}</span>
								{/if}
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Empty State -->
		{#if levelsWithCount.length === 0}
			<div class="card text-center py-12">
				<span class="text-6xl">📚</span>
				<h3 class="mt-4 text-xl font-bold text-text-light">{t('lesson.noLessons')}</h3>
				<p class="mt-2 text-text-muted">
					{t('lesson.lessonsBeingPrepared')}
				</p>
			</div>
		{/if}
	{/if}
</div>
