<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import type { PageData } from './$types';
	import type { SkillNode } from '$lib/learning/types';
	import { onMount, tick } from 'svelte';
	import {
		BookOpen,
		Ruler,
		Languages,
		PenTool,
		Puzzle,
		Headphones,
		Mic,
		Pencil,
		RefreshCw,
		BookMarked,
		Volume2
	} from 'lucide-svelte';
	import type { ComponentType } from 'svelte';

	let { data }: { data: PageData & { skills: SkillNode[] } } = $props();

	const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

	const skillsById = $derived(new Map(data.skills.map((skill: SkillNode) => [skill.id, skill])));

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

	type PrerequisiteLine = {
		key: string;
		x1: number;
		y1: number;
		x2: number;
		y2: number;
		endX: number;
		endY: number;
		length: number;
		color: string;
	};

	let groupContainerRefs = $state<Record<string, HTMLDivElement | undefined>>({});
	let skillCardRefs = $state<Record<number, HTMLAnchorElement | undefined>>({});
	let prerequisiteLinesByGroup = $state<Record<string, PrerequisiteLine[]>>({});
	let mounted = false;

	function getLineColor(prerequisite: SkillNode): string {
		if (prerequisite.status === 'mastered') return '#22c55e';
		if (prerequisite.status === 'locked') return '#94a3b8';
		return '#3b82f6';
	}

	async function calculatePrerequisiteLines(): Promise<void> {
		if (!mounted) return;

		await tick();

		const nextLines: Record<string, PrerequisiteLine[]> = {};

		for (const group of groupedSkills) {
			const container = groupContainerRefs[group.level];
			if (!container) {
				nextLines[group.level] = [];
				continue;
			}

			const containerRect = container.getBoundingClientRect();
			const lines: PrerequisiteLine[] = [];

			for (const skill of group.skills) {
				const skillEl = skillCardRefs[skill.id];
				if (!skillEl || skill.prerequisiteIds.length === 0) continue;

				for (const prerequisiteId of skill.prerequisiteIds) {
					const prerequisiteSkill = skillsById.get(prerequisiteId);
					if (!prerequisiteSkill || (prerequisiteSkill.cefrLevel ?? 'other') !== group.level)
						continue;

					const prerequisiteEl = skillCardRefs[prerequisiteId];
					if (!prerequisiteEl) continue;

					const prerequisiteRect = prerequisiteEl.getBoundingClientRect();
					const skillRect = skillEl.getBoundingClientRect();

					const prerequisiteCenterX = prerequisiteRect.left + prerequisiteRect.width / 2;
					const skillCenterX = skillRect.left + skillRect.width / 2;
					const sourceOnLeft = prerequisiteCenterX <= skillCenterX;

					const startX = sourceOnLeft
						? prerequisiteRect.right - containerRect.left
						: prerequisiteRect.left - containerRect.left;
					const startY = prerequisiteRect.top + prerequisiteRect.height / 2 - containerRect.top;
					const targetX = sourceOnLeft
						? skillRect.left - containerRect.left
						: skillRect.right - containerRect.left;
					const targetY = skillRect.top + skillRect.height / 2 - containerRect.top;

					const dx = targetX - startX;
					const dy = targetY - startY;
					const totalLength = Math.hypot(dx, dy);
					if (totalLength === 0) continue;

					const arrowOffset = 7;
					const endX = targetX - (dx / totalLength) * arrowOffset;
					const endY = targetY - (dy / totalLength) * arrowOffset;
					const length = Math.hypot(endX - startX, endY - startY);

					lines.push({
						key: `${group.level}-${prerequisiteId}-${skill.id}`,
						x1: startX,
						y1: startY,
						x2: endX,
						y2: endY,
						endX: targetX,
						endY: targetY,
						length,
						color: getLineColor(prerequisiteSkill)
					});
				}
			}

			nextLines[group.level] = lines;
		}

		prerequisiteLinesByGroup = nextLines;
	}

	onMount(() => {
		mounted = true;

		const handleResize = () => {
			void calculatePrerequisiteLines();
		};

		void calculatePrerequisiteLines();
		window.addEventListener('resize', handleResize);

		return () => {
			mounted = false;
			window.removeEventListener('resize', handleResize);
		};
	});

	$effect(() => {
		for (const group of groupedSkills) {
			groupContainerRefs[group.level];
			for (const skill of group.skills) {
				skillCardRefs[skill.id];
			}
		}

		void calculatePrerequisiteLines();
	});

	function getSkillTitle(skill: SkillNode): string {
		return skill.title;
	}

	function getSkillDescription(skill: SkillNode): string {
		return skill.description ?? '';
	}

	function getSkillIcon(skill: SkillNode): ComponentType {
		switch (String(skill.type)) {
			case 'vocabulary':
				return BookOpen;
			case 'grammar':
				return Ruler;
			case 'kana':
				return Languages;
			case 'kanji':
				return PenTool;
			case 'radical':
				return Puzzle;
			case 'listening':
				return Headphones;
			case 'speaking':
				return Mic;
			case 'writing':
				return Pencil;
			case 'conjugation':
				return RefreshCw;
			case 'pronunciation':
				return Volume2;
			default:
				return BookMarked;
		}
	}

	function getStatusLabel(status: SkillNode['status']): string {
		if (status === 'locked') return m['skills.locked']();
		if (status === 'unlocked') return m['skills.unlocked']();
		if (status === 'in_progress') {
			return m['skills.inProgress']();
		}
		return m['skills.mastered']();
	}

	function getPrerequisiteNames(skill: SkillNode): string[] {
		return skill.prerequisiteIds
			.map((id) => skillsById.get(id))
			.filter((prereq): prereq is SkillNode => !!prereq)
			.map((prereq) => getSkillTitle(prereq));
	}
</script>

<svelte:head>
	<title>{m['skills.title']()} - OpenLingo</title>
</svelte:head>

<div class="space-y-8">
	<div class="flex flex-col gap-4 card sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold text-text-light">
				{m['skills.title']()}
			</h1>
			<p class="text-text-muted">
				{m['skills.subtitle']({ language: data.languageName })}
			</p>
		</div>
		<a href="/review" class="btn btn-primary">
			{m['review.title']()}
			<span class="ml-2 rounded-full bg-white/30 px-2 py-0.5 text-xs font-bold text-white"
				>{data.dueReviewCount}</span
			>
		</a>
	</div>

	{#if groupedSkills.length === 0}
		<div class="card py-12 text-center">
			<p class="text-text-muted">
				{m['skills.noSkills']()}
			</p>
		</div>
	{:else}
		<div class="space-y-8 pb-24">
			{#each groupedSkills as group}
				<section class="space-y-4">
					<h2
						class="border-b border-border-light pb-2 text-xl font-bold tracking-wide text-text-light uppercase"
					>
						{group.level === 'other' ? '—' : group.level}
					</h2>
					<div class="relative" bind:this={groupContainerRefs[group.level]}>
						<svg class="pointer-events-none absolute inset-0 z-[1] h-full w-full overflow-visible">
							{#each prerequisiteLinesByGroup[group.level] ?? [] as line (line.key)}
								<line
									x1={line.x1}
									y1={line.y1}
									x2={line.x2}
									y2={line.y2}
									stroke={line.color}
									stroke-width="2"
									stroke-dasharray={line.length}
									style={`--line-length: ${line.length}`}
									class="animate-draw-line"
								/>
								<circle cx={line.endX} cy={line.endY} r="3" fill={line.color} />
							{/each}
						</svg>
						<div class="relative z-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
							{#each group.skills as skill}
								{@const locked = skill.status === 'locked'}
								{@const mastered = skill.status === 'mastered'}
								{@const unlocked = skill.status === 'unlocked'}
								{@const prereqs = getPrerequisiteNames(skill)}
								<a
									href={locked ? undefined : `/learn/${data.languageCode}/${skill.id}`}
									aria-disabled={locked ? 'true' : undefined}
									tabindex={locked ? -1 : undefined}
									data-skill-id={skill.id}
									bind:this={skillCardRefs[skill.id]}
									class="block card border border-border-light transition-all {locked
										? 'pointer-events-none opacity-60'
										: 'hover:border-primary/40 hover:shadow-lg'} {unlocked
										? 'animate-node-unlock'
										: ''} {mastered
										? 'border-success/50 shadow-[0_0_0_1px_rgba(34,197,94,0.38),0_0_20px_rgba(34,197,94,0.16)]'
										: ''}"
								>
									<div class="mb-3 flex items-start justify-between gap-3">
										<div class="flex items-center gap-3">
											<div
												class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary"
											>
												<svelte:component this={getSkillIcon(skill)} size={20} />
											</div>
											<div>
												<p class="font-semibold text-text-light">{getSkillTitle(skill)}</p>
												<p class="text-xs text-text-light/60">
													{skill.cefrLevel ?? '—'} · {skill.type}
												</p>
											</div>
										</div>
										<span
											class="rounded-full px-2 py-1 text-xs font-semibold {mastered
												? 'bg-success/15 text-success'
												: locked
													? 'bg-surface-200 text-text-light/70'
													: 'bg-primary/15 text-primary'}"
										>
											{getStatusLabel(skill.status)}
										</span>
									</div>

									{#if getSkillDescription(skill)}
										<p class="mb-3 text-sm text-text-light/70">{getSkillDescription(skill)}</p>
									{/if}

									<div class="space-y-1">
										<div class="flex items-center text-xs text-text-light/60">
											<span
												>{m['skills.mastery']({ percent: Math.round(skill.mastery * 100) })}</span
											>
										</div>
										<div class="bg-surface-100 h-2 overflow-hidden rounded-full">
											<div
												class="h-full rounded-full {mastered
													? 'bg-success'
													: 'bg-primary'} animate-mastery-fill {skill.mastery === 0
													? 'opacity-30'
													: ''}"
												style="--mastery-from: 0%; --mastery-to: {Math.max(
													Math.round(skill.mastery * 100),
													2
												)}%; width: var(--mastery-to);"
											></div>
										</div>
									</div>

									{#if prereqs.length > 0}
										<p class="mt-3 text-xs text-text-light/60">
											{m['skills.prerequisites']()}: {prereqs.join(', ')}
										</p>
									{/if}
								</a>
							{/each}
						</div>
					</div>
				</section>
			{/each}
		</div>
	{/if}
</div>
