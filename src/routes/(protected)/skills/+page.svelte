<script lang="ts">
	import type { PageData } from './$types';
	import type { SkillNode } from '$lib/learning/types';
	import { i18n, t } from '$lib/i18n/index.svelte';

	let { data }: { data: PageData } = $props();

	const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

	const skillsById = $derived(new Map(data.skills.map((skill) => [skill.id, skill])));

	const groupedSkills = $derived.by(() => {
		const groups = new Map<string, SkillNode[]>();

		for (const skill of data.skills) {
			const level = skill.cefrLevel ?? 'other';
			const existing = groups.get(level) ?? [];
			existing.push(skill);
			groups.set(level, existing);
		}

		for (const group of groups.values()) {
			group.sort((a, b) => a.order - b.order);
		}

		const orderedLevels = [
			...levelOrder.filter((level) => groups.has(level)),
			...Array.from(groups.keys())
				.filter((level) => !levelOrder.includes(level))
				.sort()
		];

		return orderedLevels.map((level) => ({
			level,
			skills: groups.get(level) ?? []
		}));
	});

	function getSkillTitle(skill: SkillNode): string {
		return i18n.locale === 'de' ? skill.titleDe : skill.titleEn;
	}

	function getSkillDescription(skill: SkillNode): string {
		const description = i18n.locale === 'de' ? skill.descriptionDe : skill.descriptionEn;
		return description ?? '';
	}

	function getSkillIcon(skill: SkillNode): string {
		switch (String(skill.type)) {
			case 'vocabulary':
				return 'Aa';
			case 'grammar':
				return 'Gr';
			case 'kana':
				return 'あ';
			case 'kanji':
				return '漢';
			case 'radical':
				return '部';
			case 'listening':
				return 'Li';
			case 'speaking':
				return 'Sp';
			case 'writing':
				return 'Wr';
			case 'conjugation':
				return 'Cj';
			default:
				return 'Sk';
		}
	}

	function getStatusLabel(status: SkillNode['status']): string {
		if (status === 'locked') return t('skills.locked');
		if (status === 'unlocked') return t('skills.unlocked');
		if (status === 'in_progress') {
			return t('skills.inProgress');
		}
		return t('skills.mastered');
	}

	function getPrerequisiteNames(skill: SkillNode): string[] {
		return skill.prerequisiteIds
			.map((id) => skillsById.get(id))
			.filter((prereq): prereq is SkillNode => !!prereq)
			.map((prereq) => getSkillTitle(prereq));
	}
</script>

<svelte:head>
	<title>{t('skills.title')} - OpenLingo</title>
</svelte:head>

<div class="space-y-8">
	<div class="flex flex-col gap-4 card sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold text-text-light">
				{t('skills.title')}
			</h1>
			<p class="text-text-muted">
				{t('skills.subtitle', { language: data.languageCode.toUpperCase() })}
			</p>
		</div>
		<a href="/review" class="btn btn-primary">
			{t('review.title')}
			<span class="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold"
				>{data.dueReviewCount}</span
			>
		</a>
	</div>

	{#if groupedSkills.length === 0}
		<div class="card py-12 text-center">
			<p class="text-text-muted">
				{t('skills.noSkills')}
			</p>
		</div>
	{:else}
		<div class="space-y-8">
			{#each groupedSkills as group}
				<section class="space-y-4">
					<h2 class="text-lg font-bold tracking-wide text-text-light uppercase">
						{group.level === 'other' ? '—' : group.level}
					</h2>
					<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{#each group.skills as skill}
							{@const locked = skill.status === 'locked'}
							{@const mastered = skill.status === 'mastered'}
							{@const prereqs = getPrerequisiteNames(skill)}
							<a
								href={locked ? undefined : `/learn/${data.languageCode}/${skill.id}`}
								class="block card border border-border-light transition-all {locked
									? 'pointer-events-none opacity-60'
									: 'hover:border-primary/40 hover:shadow-lg'}"
							>
								<div class="mb-3 flex items-start justify-between gap-3">
									<div class="flex items-center gap-3">
										<div
											class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary"
										>
											{getSkillIcon(skill)}
										</div>
										<div>
											<p class="font-semibold text-text-light">{getSkillTitle(skill)}</p>
											<p class="text-xs text-text-muted">{skill.cefrLevel ?? '—'} · {skill.type}</p>
										</div>
									</div>
									<span
										class="rounded-full px-2 py-1 text-xs font-semibold {mastered
											? 'bg-success/15 text-success'
											: locked
												? 'bg-surface-100 text-text-muted'
												: 'bg-primary/15 text-primary'}"
									>
										{getStatusLabel(skill.status)}
									</span>
								</div>

								{#if getSkillDescription(skill)}
									<p class="mb-3 text-sm text-text-muted">{getSkillDescription(skill)}</p>
								{/if}

								<div class="space-y-1">
									<div class="flex items-center justify-between text-xs text-text-muted">
										<span>{t('skills.mastery', { percent: Math.round(skill.mastery * 100) })}</span>
										<span>{Math.round(skill.mastery * 100)}%</span>
									</div>
									<div class="bg-surface-100 h-2 overflow-hidden rounded-full">
										<div
											class="h-full rounded-full {mastered ? 'bg-success' : 'bg-primary'}"
											style="width: {Math.round(skill.mastery * 100)}%"
										></div>
									</div>
								</div>

								{#if prereqs.length > 0}
									<p class="mt-3 text-xs text-text-muted">
										{t('skills.prerequisites')}: {prereqs.join(', ')}
									</p>
								{/if}
							</a>
						{/each}
					</div>
				</section>
			{/each}
		</div>
	{/if}
</div>
