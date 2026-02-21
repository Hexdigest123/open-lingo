<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import type { PageData } from './$types';
	import { deserialize } from '$app/forms';
	import TeachBlock from '$lib/components/learning/TeachBlock.svelte';
	import DrillBlock from '$lib/components/learning/DrillBlock.svelte';

	type BlockType = 'teach' | 'drill' | 'checkpoint' | 'review' | 'exam';

	type LearnBlock = {
		id: number;
		blockType: BlockType;
		title: string | null;
		config: Record<string, unknown>;
	};

	type LearnQuestion = {
		id: number;
		type: string;
		content: Record<string, unknown>;
		correctAnswer: string;
	};

	let { data }: { data: PageData } = $props();

	let blockIndex = $state(0);
	let isComplete = $state(false);
	let checkpointFailed = $state(false);
	let checkpointAttempt = $state(0);
	let drillSummaries = $state<Array<{ correct: number; total: number }>>([]);
	let masterySnapshots = $state<number[]>([]);

	const allConceptIds = $derived(data.concepts.map((concept) => concept.id));

	const blockSequence = $derived.by(() => {
		const incoming = (data.blocks as unknown as LearnBlock[]) ?? [];
		if (incoming.length > 0) {
			return incoming;
		}

		return [
			{
				id: -1,
				blockType: 'drill' as const,
				title: (data.skill as Record<string, unknown>).title as string,
				config: {
					conceptIds: allConceptIds,
					questionCount: data.questions.length,
					passingScore: 0
				}
			}
		];
	});

	const currentBlock = $derived(blockSequence[blockIndex]);
	const progressPercent = $derived(
		blockSequence.length === 0 ? 0 : Math.round((blockIndex / blockSequence.length) * 100)
	);

	const conceptById = $derived(new Map(data.concepts.map((concept) => [concept.id, concept])));
	const questionConceptMap = $derived.by(() => {
		const map = new Map<number, number>();
		for (const [questionId, conceptId] of Object.entries(data.questionConceptMap ?? {})) {
			map.set(Number(questionId), Number(conceptId));
		}
		return map;
	});

	function getLocalizedSkillTitle() {
		return (data.skill as Record<string, unknown>).title as string;
	}

	function getLocalizedConceptTitle(conceptId: number): string {
		const concept = conceptById.get(conceptId);
		if (!concept) return '';
		return ((concept as Record<string, unknown>).title as string) ?? '';
	}

	function getBlockQuestions(block: LearnBlock): LearnQuestion[] {
		const conceptIdsRaw = block.config.conceptIds;
		const conceptIds = Array.isArray(conceptIdsRaw)
			? conceptIdsRaw.filter((value): value is number => typeof value === 'number')
			: [];

		let pool = data.questions as LearnQuestion[];
		if (conceptIds.length > 0) {
			pool = pool.filter((question) =>
				conceptIds.includes(questionConceptMap.get(question.id) ?? -1)
			);
		}

		const questionCountRaw = block.config.questionCount;
		const questionCount =
			typeof questionCountRaw === 'number' && questionCountRaw > 0
				? Math.min(questionCountRaw, pool.length)
				: pool.length;

		return pool.slice(0, questionCount);
	}

	function nextBlock() {
		checkpointFailed = false;
		if (blockIndex < blockSequence.length - 1) {
			blockIndex += 1;
			return;
		}
		isComplete = true;
	}

	async function handleBlockAnswer(questionId: number, answer: string) {
		const conceptId = questionConceptMap.get(questionId) ?? data.concepts[0]?.id;
		if (!conceptId) {
			return;
		}

		const formData = new FormData();
		formData.append('conceptId', String(conceptId));
		formData.append('questionId', String(questionId));
		formData.append('answer', answer);

		const response = await fetch('?/answer', {
			method: 'POST',
			body: formData
		});

		const result = deserialize(await response.text());
		if (result.type === 'success') {
			const payload = result.data as { mastery?: number };
			if (typeof payload.mastery === 'number') {
				masterySnapshots = [...masterySnapshots, payload.mastery];
			}
		}
	}

	function onDrillComplete(correct: number, total: number) {
		drillSummaries = [...drillSummaries, { correct, total }];
		nextBlock();
	}

	function onCheckpointComplete(correct: number, total: number) {
		drillSummaries = [...drillSummaries, { correct, total }];

		const rawPassingScore = currentBlock?.config.passingScore;
		const normalizedPassing =
			typeof rawPassingScore === 'number'
				? rawPassingScore <= 1
					? rawPassingScore * 100
					: rawPassingScore
				: 70;

		const percent = total > 0 ? (correct / total) * 100 : 0;
		if (percent < normalizedPassing) {
			checkpointFailed = true;
			checkpointAttempt += 1;
			return;
		}

		nextBlock();
	}

	const totalCorrect = $derived(drillSummaries.reduce((sum, item) => sum + item.correct, 0));
	const totalAnswered = $derived(drillSummaries.reduce((sum, item) => sum + item.total, 0));
	const averageMasteryGain = $derived(
		masterySnapshots.length === 0
			? 0
			: Math.round(
					(masterySnapshots.reduce((sum, value) => sum + value, 0) / masterySnapshots.length) * 100
				)
	);

	function getTeachContent(block: LearnBlock) {
		const config = block.config;
		const examplesRaw = config.examples;
		const tipsRaw = config.tips;

		const examples = Array.isArray(examplesRaw)
			? examplesRaw
					.filter(
						(value): value is Record<string, unknown> => typeof value === 'object' && value !== null
					)
					.map((example) => ({
						target: (example.target as string) ?? '',
						translation: (example.translation as string) ?? ''
					}))
			: [];

		const tips = Array.isArray(tipsRaw)
			? tipsRaw.filter((value): value is string => typeof value === 'string')
			: [];

		const skillTitle = (data.skill as Record<string, unknown>).title as string;

		return {
			title: block.title ?? skillTitle,
			explanation:
				typeof config.explanation === 'string' ? config.explanation : m['learn.teachTitle'](),
			examples,
			visualAid:
				typeof config.visualAid === 'object' && config.visualAid !== null
					? (config.visualAid as {
							type: 'table' | 'stroke_order' | 'diagram';
							payload: Record<string, unknown>;
						})
					: undefined,
			tips
		};
	}
</script>

<svelte:head>
	<title>{getLocalizedSkillTitle()} - OpenLingo</title>
</svelte:head>

{#if isComplete}
	<div class="mx-auto max-w-2xl space-y-4 card text-center">
		<div
			class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-10 w-10"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
					clip-rule="evenodd"
				/>
			</svg>
		</div>
		<h1 class="text-2xl font-bold text-text-light">
			{m['learn.lessonComplete']()}
		</h1>
		<p class="text-text-muted">{getLocalizedSkillTitle()}</p>

		<div class="grid gap-4 sm:grid-cols-3">
			<div class="bg-surface-100 rounded-xl p-4">
				<p class="text-2xl font-bold text-success">{totalCorrect}/{totalAnswered}</p>
				<p class="text-xs text-text-muted">
					{m['learn.drillScore']({ correct: totalCorrect, total: totalAnswered })}
				</p>
			</div>
			<div class="bg-surface-100 rounded-xl p-4">
				<p class="text-2xl font-bold text-primary">{data.concepts.length}</p>
				<p class="text-xs text-text-muted">
					{m['learn.conceptsLearned']({ count: data.concepts.length })}
				</p>
			</div>
			<div class="bg-surface-100 rounded-xl p-4">
				<p class="text-2xl font-bold text-yellow-dark">{averageMasteryGain}%</p>
				<p class="text-xs text-text-muted">
					{m['skills.mastery']({ percent: averageMasteryGain })}
				</p>
			</div>
		</div>

		<a href="/skills" class="btn btn-primary">← {m['learn.backToSkills']()}</a>
	</div>
{:else}
	<div class="mx-auto max-w-3xl space-y-6">
		<div class="flex items-center justify-between gap-4">
			<a href="/skills" class="text-sm text-text-muted hover:text-text-light"
				>← {m['learn.backToSkills']()}</a
			>
			<p class="text-sm text-text-muted">
				{m['learn.progress']({ current: blockIndex + 1, total: blockSequence.length })}
			</p>
		</div>

		<div class="bg-surface-100 h-2 overflow-hidden rounded-full">
			<div class="h-full bg-primary transition-all" style="width: {progressPercent}%"></div>
		</div>

		{#if currentBlock}
			{#if currentBlock.blockType === 'teach'}
				{@const teach = getTeachContent(currentBlock)}
				<TeachBlock
					title={teach.title}
					explanation={teach.explanation}
					examples={teach.examples}
					visualAid={teach.visualAid}
					tips={teach.tips}
					onContinue={nextBlock}
				/>
			{:else if currentBlock.blockType === 'drill' || currentBlock.blockType === 'review'}
				{@const blockQuestions = getBlockQuestions(currentBlock)}
				{#if blockQuestions.length === 0}
					<div class="space-y-4 card text-center">
						<div
							class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow/10 text-yellow-dark"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-8 w-8"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
						<p class="text-text-muted">
							{m['learn.noQuestions']()}
						</p>
						<a href="/skills" class="btn btn-primary">← {m['learn.backToSkills']()}</a>
					</div>
				{:else}
					{#key `${currentBlock.id}-${checkpointAttempt}`}
						<DrillBlock
							questions={blockQuestions}
							hasApiKey={data.hasApiKey}
							onAnswer={handleBlockAnswer}
							onComplete={onDrillComplete}
						/>
					{/key}
				{/if}
			{:else if currentBlock.blockType === 'checkpoint' || currentBlock.blockType === 'exam'}
				{@const checkpointQuestions = getBlockQuestions(currentBlock)}
				<div class="space-y-4">
					<div class="card bg-yellow/10">
						<p class="font-semibold text-yellow-dark">
							{m['learn.checkpointTitle']()}
						</p>
						{#if checkpointFailed}
							<p class="mt-2 text-sm text-error">
								{m['learn.checkpointFailed']()}
							</p>
						{/if}
						{#if currentBlock.config.conceptIds}
							<p class="mt-2 text-sm text-text-muted">
								{(currentBlock.config.conceptIds as number[])
									.map((conceptId) => getLocalizedConceptTitle(conceptId))
									.filter(Boolean)
									.join(' • ')}
							</p>
						{/if}
					</div>
					{#if checkpointQuestions.length === 0}
						<div class="space-y-4 card text-center">
							<div
								class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow/10 text-yellow-dark"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-8 w-8"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fill-rule="evenodd"
										d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
							<p class="text-text-muted">
								{m['learn.noQuestions']()}
							</p>
							<a href="/skills" class="btn btn-primary">← {m['learn.backToSkills']()}</a>
						</div>
					{:else}
						{#key `checkpoint-${currentBlock.id}-${checkpointAttempt}`}
							<DrillBlock
								questions={checkpointQuestions}
								hasApiKey={data.hasApiKey}
								onAnswer={handleBlockAnswer}
								onComplete={onCheckpointComplete}
							/>
						{/key}
					{/if}
				</div>
			{/if}
		{/if}
	</div>
{/if}
