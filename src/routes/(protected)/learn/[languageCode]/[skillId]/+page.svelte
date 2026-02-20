<script lang="ts">
	import type { PageData } from './$types';
	import { deserialize } from '$app/forms';
	import { i18n, t } from '$lib/i18n/index.svelte';
	import TeachBlock from '$lib/components/learning/TeachBlock.svelte';
	import DrillBlock from '$lib/components/learning/DrillBlock.svelte';

	type BlockType = 'teach' | 'drill' | 'checkpoint' | 'review' | 'exam';

	type LearnBlock = {
		id: number;
		blockType: BlockType;
		titleEn: string | null;
		titleDe: string | null;
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
		const incoming = (data.blocks as LearnBlock[]) ?? [];
		if (incoming.length > 0) {
			return incoming;
		}

		return [
			{
				id: -1,
				blockType: 'drill' as const,
				titleEn: data.skill.titleEn,
				titleDe: data.skill.titleDe,
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
		return i18n.locale === 'de' ? data.skill.titleDe : data.skill.titleEn;
	}

	function getLocalizedConceptTitle(conceptId: number): string {
		const concept = conceptById.get(conceptId);
		if (!concept) return '';
		return i18n.locale === 'de' ? concept.titleDe : concept.titleEn;
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
		const tipsEnRaw = config.tipsEn;
		const tipsDeRaw = config.tipsDe;

		const examples = Array.isArray(examplesRaw)
			? examplesRaw
					.filter(
						(value): value is Record<string, unknown> => typeof value === 'object' && value !== null
					)
					.map((example) => ({
						target: (example.target as string) ?? '',
						en: (example.en as string) ?? '',
						de: (example.de as string) ?? ''
					}))
			: [];

		const tipsEn = Array.isArray(tipsEnRaw)
			? tipsEnRaw.filter((value): value is string => typeof value === 'string')
			: [];
		const tipsDe = Array.isArray(tipsDeRaw)
			? tipsDeRaw.filter((value): value is string => typeof value === 'string')
			: [];

		return {
			titleEn: block.titleEn ?? data.skill.titleEn,
			titleDe: block.titleDe ?? data.skill.titleDe,
			explanationEn:
				typeof config.explanationEn === 'string'
					? config.explanationEn
					: t('learn.teachTitle', { defaultValue: 'Learn' }),
			explanationDe:
				typeof config.explanationDe === 'string'
					? config.explanationDe
					: t('learn.teachTitle', { defaultValue: 'Lernen' }),
			examples,
			visualAid:
				typeof config.visualAid === 'object' && config.visualAid !== null
					? (config.visualAid as {
							type: 'table' | 'stroke_order' | 'diagram';
							payload: Record<string, unknown>;
						})
					: undefined,
			tipsEn,
			tipsDe
		};
	}
</script>

<svelte:head>
	<title>{getLocalizedSkillTitle()} - OpenLingo</title>
</svelte:head>

{#if isComplete}
	<div class="mx-auto max-w-2xl space-y-4 card text-center">
		<div class="text-6xl">🎉</div>
		<h1 class="text-2xl font-bold text-text-light">
			{t('learn.lessonComplete', { defaultValue: 'Lesson Complete!' })}
		</h1>
		<p class="text-text-muted">{getLocalizedSkillTitle()}</p>

		<div class="grid gap-4 sm:grid-cols-3">
			<div class="bg-surface-100 rounded-xl p-4">
				<p class="text-2xl font-bold text-success">{totalCorrect}/{totalAnswered}</p>
				<p class="text-xs text-text-muted">
					{t('learn.drillScore', {
						correct: totalCorrect,
						total: totalAnswered,
						defaultValue: 'Score'
					})}
				</p>
			</div>
			<div class="bg-surface-100 rounded-xl p-4">
				<p class="text-2xl font-bold text-primary">{data.concepts.length}</p>
				<p class="text-xs text-text-muted">
					{t('learn.conceptsLearned', {
						count: data.concepts.length,
						defaultValue: 'Concepts learned'
					})}
				</p>
			</div>
			<div class="bg-surface-100 rounded-xl p-4">
				<p class="text-2xl font-bold text-yellow-dark">{averageMasteryGain}%</p>
				<p class="text-xs text-text-muted">
					{t('skills.mastery', { percent: averageMasteryGain, defaultValue: 'Mastery' })}
				</p>
			</div>
		</div>

		<a href="/skills" class="btn btn-primary"
			>← {t('learn.backToSkills', { defaultValue: 'Back to Skill Tree' })}</a
		>
	</div>
{:else}
	<div class="mx-auto max-w-3xl space-y-6">
		<div class="flex items-center justify-between gap-4">
			<a href="/skills" class="text-sm text-text-muted hover:text-text-light"
				>← {t('learn.backToSkills', { defaultValue: 'Back to Skill Tree' })}</a
			>
			<p class="text-sm text-text-muted">
				{t('learn.progress', {
					current: blockIndex + 1,
					total: blockSequence.length,
					defaultValue: 'Progress'
				})}
			</p>
		</div>

		<div class="bg-surface-100 h-2 overflow-hidden rounded-full">
			<div class="h-full bg-primary transition-all" style="width: {progressPercent}%"></div>
		</div>

		{#if currentBlock}
			{#if currentBlock.blockType === 'teach'}
				{@const teach = getTeachContent(currentBlock)}
				<TeachBlock
					titleEn={teach.titleEn}
					titleDe={teach.titleDe}
					explanationEn={teach.explanationEn}
					explanationDe={teach.explanationDe}
					examples={teach.examples}
					visualAid={teach.visualAid}
					tipsEn={teach.tipsEn}
					tipsDe={teach.tipsDe}
					onContinue={nextBlock}
				/>
			{:else if currentBlock.blockType === 'drill' || currentBlock.blockType === 'review'}
				{@const blockQuestions = getBlockQuestions(currentBlock)}
				{#if blockQuestions.length === 0}
					<div class="card text-center">
						<p class="text-text-muted">
							{t('learn.unsupportedType', { defaultValue: 'No questions available yet.' })}
						</p>
						<button class="btn btn-primary mt-4" onclick={nextBlock}
							>{t('learn.continue', { defaultValue: 'Continue' })}</button
						>
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
							{t('learn.checkpointTitle', { defaultValue: 'Checkpoint' })}
						</p>
						{#if checkpointFailed}
							<p class="mt-2 text-sm text-error">
								{t('learn.incorrect', {
									defaultValue: 'Score below passing threshold. Try again.'
								})}
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
						<div class="card text-center">
							<p class="text-text-muted">
								{t('learn.unsupportedType', { defaultValue: 'No checkpoint questions yet.' })}
							</p>
							<button class="btn btn-primary mt-4" onclick={nextBlock}
								>{t('learn.continue', { defaultValue: 'Continue' })}</button
							>
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
