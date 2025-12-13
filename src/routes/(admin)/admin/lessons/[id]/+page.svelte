<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { t } from '$lib/i18n/index.svelte';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let deleteConfirm = $state(false);
	let deleteQuestionId = $state<number | null>(null);
</script>

<svelte:head>
	<title>Edit: {data.lesson.title} - OpenLingo Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			<a href="/admin/lessons" class="text-text-muted hover:text-text-light">
				&larr; {t('common.back')}
			</a>
			<h1 class="text-2xl font-bold text-text-light">Edit Lesson</h1>
		</div>
	</div>

	{#if form?.error}
		<div class="rounded-xl bg-error/10 p-4 text-error">{form.error}</div>
	{/if}

	{#if form?.success}
		<div class="rounded-xl bg-success/10 p-4 text-success">{t('common.success')}</div>
	{/if}

	<!-- Lesson Edit Form -->
	<form method="POST" action="?/update" use:enhance class="card space-y-4">
		<div class="grid gap-4 md:grid-cols-2">
			<div class="md:col-span-2">
				<label for="title" class="block text-sm font-medium text-text-light">
					{t('admin.lessons.form.title')} *
				</label>
				<input
					type="text"
					id="title"
					name="title"
					value={data.lesson.title}
					required
					class="input mt-1"
				/>
			</div>

			<div class="md:col-span-2">
				<label for="description" class="block text-sm font-medium text-text-light">
					{t('admin.lessons.form.description')}
				</label>
				<textarea id="description" name="description" rows="2" class="input mt-1"
					>{data.lesson.description || ''}</textarea
				>
			</div>

			<div>
				<label for="unitId" class="block text-sm font-medium text-text-light">
					{t('admin.lessons.form.unit')} *
				</label>
				<select id="unitId" name="unitId" required class="input mt-1">
					{#each data.units as unit}
						<option value={unit.id} selected={unit.id === data.lesson.unitId}>
							[{unit.levelCode}] {unit.title}
						</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="type" class="block text-sm font-medium text-text-light">
					{t('admin.lessons.form.type')} *
				</label>
				<select id="type" name="type" required class="input mt-1">
					<option value="multiple_choice" selected={data.lesson.type === 'multiple_choice'}>
						Multiple Choice
					</option>
					<option value="fill_in_blank" selected={data.lesson.type === 'fill_in_blank'}>
						Fill in Blank
					</option>
					<option value="vocabulary" selected={data.lesson.type === 'vocabulary'}>
						Vocabulary
					</option>
					<option value="voice_answer" selected={data.lesson.type === 'voice_answer'}>
						Voice Answer
					</option>
				</select>
			</div>

			<div>
				<label for="xpReward" class="block text-sm font-medium text-text-light">
					{t('admin.lessons.form.xpReward')}
				</label>
				<input
					type="number"
					id="xpReward"
					name="xpReward"
					value={data.lesson.xpReward}
					min="1"
					class="input mt-1"
				/>
			</div>

			<div>
				<label for="examPassThreshold" class="block text-sm font-medium text-text-light">
					Exam Pass Threshold (%)
				</label>
				<input
					type="number"
					id="examPassThreshold"
					name="examPassThreshold"
					value={data.lesson.examPassThreshold || 80}
					min="1"
					max="100"
					class="input mt-1"
				/>
			</div>
		</div>

		<div class="flex flex-wrap gap-4">
			<label class="flex items-center gap-2">
				<input
					type="checkbox"
					id="isPublished"
					name="isPublished"
					checked={data.lesson.isPublished}
					class="h-4 w-4"
				/>
				<span class="text-sm text-text-light">{t('admin.lessons.form.isPublished')}</span>
			</label>

			<label class="flex items-center gap-2">
				<input
					type="checkbox"
					id="isExam"
					name="isExam"
					checked={data.lesson.isExam}
					class="h-4 w-4"
				/>
				<span class="text-sm text-text-light">This is an exam</span>
			</label>
		</div>

		<div class="flex justify-between pt-4">
			<div>
				<button type="button" onclick={() => (deleteConfirm = true)} class="btn btn-ghost btn-md text-error">
					{t('common.delete')} Lesson
				</button>
			</div>
			<button type="submit" class="btn btn-success btn-md">
				{t('common.save')} Changes
			</button>
		</div>
	</form>

	<!-- Delete Confirmation (outside form) -->
	{#if deleteConfirm}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
			<div class="card w-full max-w-sm text-center">
				<p class="text-lg font-medium text-text-light mb-4">Delete this lesson and all its questions?</p>
				<div class="flex justify-center gap-4">
					<button onclick={() => (deleteConfirm = false)} class="btn btn-ghost btn-md">
						{t('common.cancel')}
					</button>
					<form method="POST" action="?/delete" use:enhance>
						<button type="submit" class="btn btn-error btn-md">Confirm Delete</button>
					</form>
				</div>
			</div>
		</div>
	{/if}

	<!-- Questions Section -->
	<div class="card">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-xl font-bold text-text-light">
				Questions ({data.questions.length})
			</h2>
		</div>

		{#if data.questions.length === 0}
			<p class="text-center text-text-muted py-8">No questions in this lesson yet.</p>
		{:else}
			<div class="space-y-3">
				{#each data.questions as question, i}
					<div class="rounded-xl bg-bg-light-secondary p-4">
						<div class="flex items-start justify-between gap-4">
							<div class="flex-1">
								<div class="flex items-center gap-2 mb-1">
									<span class="text-xs font-medium text-text-muted">#{i + 1}</span>
									<span
										class="rounded-lg px-2 py-0.5 text-xs font-medium {question.type === 'multiple_choice'
											? 'bg-primary/10 text-primary'
											: question.type === 'fill_blank'
												? 'bg-success/10 text-success'
												: question.type === 'translation'
													? 'bg-purple/10 text-purple'
													: 'bg-yellow/10 text-yellow-dark'}"
									>
										{question.type}
									</span>
								</div>
								<p class="font-medium text-text-light">{question.questionText}</p>
								<p class="text-sm text-text-muted mt-1">
									Answer: <span class="text-success">{question.correctAnswer}</span>
								</p>
							</div>
							<div>
								{#if deleteQuestionId === question.id}
									<form method="POST" action="?/deleteQuestion" use:enhance class="inline">
										<input type="hidden" name="questionId" value={question.id} />
										<button type="submit" class="text-error text-sm hover:underline">Confirm</button>
									</form>
									<button
										onclick={() => (deleteQuestionId = null)}
										class="text-text-muted text-sm hover:underline ml-2"
									>
										{t('common.cancel')}
									</button>
								{:else}
									<button
										onclick={() => (deleteQuestionId = question.id)}
										class="text-error text-sm hover:underline"
									>
										{t('common.delete')}
									</button>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
