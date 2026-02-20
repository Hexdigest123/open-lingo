<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { t } from '$lib/i18n/index.svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Monitor, Zap, AlertTriangle, Loader2, Lightbulb } from 'lucide-svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let isGenerating = $state(false);
	let topic = $state('');
	let questionCount = $state(50);
	let difficulty = $state('intermediate');
	let selectedUnit = $state('');

	/**
	 * Parse translation JSON and extract value for language
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

	// Redirect to the generated lesson if successful
	$effect(() => {
		if (form?.success && form?.lessonId) {
			goto(`/admin/lessons`);
		}
	});
</script>

<svelte:head>
	<title>{t('admin.lessons.aiGenerate')} - OpenLingo</title>
</svelte:head>

<!-- Mobile: Show only desktop recommendation -->
<div class="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center md:hidden">
	<Monitor size={64} class="text-text-muted" />
	<div>
		<h1 class="text-xl font-bold text-text-light">{t('admin.desktopRecommended')}</h1>
		<p class="mt-2 text-text-muted">{t('admin.desktopRecommendedDesc')}</p>
	</div>
	<a href="/admin" class="btn btn-primary btn-md mt-4">
		{t('common.back')}
	</a>
</div>

<!-- Desktop: Show full content -->
<div class="mx-auto hidden max-w-2xl space-y-6 md:block">
	<div class="flex items-center gap-4">
		<a href="/admin/lessons" class="text-text-muted hover:text-text-light">
			&larr; {t('common.back')}
		</a>
		<h1 class="text-2xl font-bold text-text-light">{t('admin.lessons.aiGenerate')}</h1>
	</div>

	{#if !data.hasApiKey}
		<div class="card border-2 border-yellow/50 bg-yellow/5">
			<div class="flex items-start gap-4">
				<AlertTriangle size={32} class="text-yellow-dark" />
				<div>
					<h3 class="font-bold text-text-light">{t('admin.lessons.apiKeyRequired')}</h3>
					<p class="mt-1 text-text-muted">{t('admin.lessons.apiKeyRequiredDesc')}</p>
					<a href="/settings/api-key" class="btn btn-primary btn-sm mt-4">
						{t('admin.lessons.configureApiKey')}
					</a>
				</div>
			</div>
		</div>
	{:else}
		{#if form?.error}
			<div class="rounded-xl bg-error/10 p-4 text-error">{form.error}</div>
		{/if}

		{#if form?.success}
			<div class="rounded-xl bg-success/10 p-4 text-success">{form.message}</div>
		{/if}

		<div class="card">
			<h2 class="text-lg font-bold text-text-light">{t('admin.lessons.generateNew')}</h2>
			<p class="mt-1 text-sm text-text-muted">{t('admin.lessons.generateDesc')}</p>

			<form
				method="POST"
				action="?/generate"
				use:enhance={() => {
					isGenerating = true;
					return async ({ update }) => {
						await update();
						isGenerating = false;
					};
				}}
				class="mt-6 space-y-6"
			>
				<!-- Unit Selection -->
				<div>
					<label for="unitId" class="block text-sm font-medium text-text-light">
						{t('admin.lessons.form.unit')} *
					</label>
					<select
						id="unitId"
						name="unitId"
						required
						bind:value={selectedUnit}
						class="input mt-1"
						disabled={isGenerating}
					>
						<option value="">{t('admin.lessons.selectUnit')}</option>
						{#each data.units as unit}
							<option value={unit.id}>[{unit.levelCode}] {getTranslation(unit.title, 'en')}</option>
						{/each}
					</select>
				</div>

				<!-- Topic -->
				<div>
					<label for="topic" class="block text-sm font-medium text-text-light">
						{t('admin.lessons.topic')} *
					</label>
					<input
						type="text"
						id="topic"
						name="topic"
						required
						bind:value={topic}
						placeholder={t('admin.lessons.topicPlaceholder')}
						class="input mt-1"
						disabled={isGenerating}
					/>
					<p class="mt-1 text-xs text-text-muted">{t('admin.lessons.topicHint')}</p>
				</div>

				<!-- Question Count & Difficulty -->
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label for="questionCount" class="block text-sm font-medium text-text-light">
							{t('admin.lessons.questionCount')}
						</label>
						<select
							id="questionCount"
							name="questionCount"
							bind:value={questionCount}
							class="input mt-1"
							disabled={isGenerating}
						>
							<option value={10}>10 {t('admin.lessons.questions')}</option>
							<option value={20}>20 {t('admin.lessons.questions')}</option>
							<option value={30}>30 {t('admin.lessons.questions')}</option>
							<option value={50}>50 {t('admin.lessons.questions')}</option>
						</select>
					</div>
					<div>
						<label for="difficulty" class="block text-sm font-medium text-text-light">
							{t('admin.lessons.difficulty')}
						</label>
						<select
							id="difficulty"
							name="difficulty"
							bind:value={difficulty}
							class="input mt-1"
							disabled={isGenerating}
						>
							<option value="beginner">{t('admin.lessons.difficultyBeginner')}</option>
							<option value="intermediate">{t('admin.lessons.difficultyIntermediate')}</option>
							<option value="advanced">{t('admin.lessons.difficultyAdvanced')}</option>
						</select>
					</div>
				</div>

				<!-- Preview Info -->
				<div class="rounded-xl bg-bg-light-secondary p-4">
					<h3 class="text-sm font-medium text-text-light">{t('admin.lessons.willGenerate')}</h3>
					<ul class="mt-2 space-y-1 text-sm text-text-muted">
						<li>&#x2022; {Math.floor(questionCount * 0.2)} {t('admin.lessons.multipleChoice')}</li>
						<li>&#x2022; {Math.floor(questionCount * 0.2)} {t('admin.lessons.fillBlank')}</li>
						<li>&#x2022; {Math.floor(questionCount * 0.15)} {t('admin.lessons.translation')}</li>
						<li>&#x2022; {Math.floor(questionCount * 0.15)} {t('admin.lessons.matching')}</li>
						<li>&#x2022; {Math.floor(questionCount * 0.15)} {t('admin.lessons.wordOrder')}</li>
						<li>&#x2022; {Math.floor(questionCount * 0.08)} {t('admin.lessons.speaking')}</li>
						<li>
							&#x2022; {questionCount -
								Math.floor(questionCount * 0.2) -
								Math.floor(questionCount * 0.2) -
								Math.floor(questionCount * 0.15) -
								Math.floor(questionCount * 0.15) -
								Math.floor(questionCount * 0.15) -
								Math.floor(questionCount * 0.08)}
							{t('admin.lessons.listening')}
						</li>
					</ul>
				</div>

				<!-- Submit Button -->
				<button
					type="submit"
					disabled={isGenerating || !selectedUnit || !topic}
					class="btn btn-success btn-lg flex w-full items-center justify-center gap-2"
				>
					{#if isGenerating}
						<Loader2 size={20} class="animate-spin" />
						{t('admin.lessons.generating')}
					{:else}
						<Zap size={20} />
						{t('admin.lessons.generateLesson')}
					{/if}
				</button>

				{#if isGenerating}
					<p class="text-center text-sm text-text-muted">{t('admin.lessons.generatingHint')}</p>
				{/if}
			</form>
		</div>

		<!-- Tips -->
		<div class="card bg-primary/5">
			<h3 class="flex items-center gap-2 font-bold text-text-light">
				<Lightbulb size={20} class="text-yellow-dark" />
				{t('admin.lessons.tips')}
			</h3>
			<ul class="mt-2 space-y-2 text-sm text-text-muted">
				<li>&#x2022; {t('admin.lessons.tip1')}</li>
				<li>&#x2022; {t('admin.lessons.tip2')}</li>
				<li>&#x2022; {t('admin.lessons.tip3')}</li>
				<li>&#x2022; {t('admin.lessons.tip4')}</li>
			</ul>
		</div>
	{/if}
</div>
