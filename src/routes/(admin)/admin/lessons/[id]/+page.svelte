<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { t } from '$lib/i18n/index.svelte';
	import { enhance } from '$app/forms';
	import QuestionModal from '$lib/components/admin/questions/QuestionModal.svelte';
	import type { QuestionType } from '$lib/server/db/schema';

	type Question = {
		id: number;
		type: QuestionType;
		content: Record<string, unknown>;
		correctAnswer: string;
	};

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let deleteConfirm = $state(false);
	let deleteQuestionId = $state<number | null>(null);
	let showQuestionModal = $state(false);
	let editingQuestion = $state<Question | null>(null);

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

	function openAddModal() {
		editingQuestion = null;
		showQuestionModal = true;
	}

	function openEditModal(question: Question) {
		editingQuestion = question;
		showQuestionModal = true;
	}

	function closeModal() {
		showQuestionModal = false;
		editingQuestion = null;
	}
</script>

<svelte:head>
	<title>Edit: {getTranslation(data.lesson.title, 'en') || 'Untitled'} - OpenLingo Admin</title>
</svelte:head>

<!-- Mobile: Show only desktop recommendation -->
<div class="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center md:hidden">
	<span class="text-6xl">💻</span>
	<div>
		<h1 class="text-xl font-bold text-text-light">{t('admin.desktopRecommended')}</h1>
		<p class="mt-2 text-text-muted">{t('admin.desktopRecommendedDesc')}</p>
	</div>
	<a href="/admin" class="btn btn-primary btn-md mt-4">
		{t('common.back')}
	</a>
</div>

<!-- Desktop: Show full content -->
<div class="hidden space-y-6 md:block">
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
		<!-- Title (English and German) -->
		<div class="grid gap-4 md:grid-cols-2">
			<div>
				<label for="title" class="block text-sm font-medium text-text-light">
					{t('admin.lessons.form.title')} (EN) *
				</label>
				<input
					type="text"
					id="title"
					name="title"
					value={getTranslation(data.lesson.title, 'en')}
					required
					class="input mt-1"
					placeholder="English title"
				/>
			</div>
			<div>
				<label for="titleDe" class="block text-sm font-medium text-text-light">
					{t('admin.lessons.form.title')} (DE)
				</label>
				<input
					type="text"
					id="titleDe"
					name="titleDe"
					value={getTranslation(data.lesson.title, 'de')}
					class="input mt-1"
					placeholder="German title (optional)"
				/>
			</div>
		</div>

		<!-- Description (English and German) -->
		<div class="grid gap-4 md:grid-cols-2">
			<div>
				<label for="description" class="block text-sm font-medium text-text-light">
					{t('admin.lessons.form.description')} (EN)
				</label>
				<textarea id="description" name="description" rows="2" class="input mt-1" placeholder="English description"
					>{getTranslation(data.lesson.description, 'en')}</textarea
				>
			</div>
			<div>
				<label for="descriptionDe" class="block text-sm font-medium text-text-light">
					{t('admin.lessons.form.description')} (DE)
				</label>
				<textarea id="descriptionDe" name="descriptionDe" rows="2" class="input mt-1" placeholder="German description (optional)"
					>{getTranslation(data.lesson.description, 'de')}</textarea
				>
			</div>
		</div>

		<div class="grid gap-4 md:grid-cols-2">
			<div>
				<label for="unitId" class="block text-sm font-medium text-text-light">
					{t('admin.lessons.form.unit')} *
				</label>
				<select id="unitId" name="unitId" required class="input mt-1">
					{#each data.units as unit}
						<option value={unit.id} selected={unit.id === data.lesson.unitId}>
							[{unit.levelCode}] {getTranslation(unit.title, 'en')}
						</option>
					{/each}
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
			<button onclick={openAddModal} class="btn btn-success btn-sm">
				+ Add Question
			</button>
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
								<p class="font-medium text-text-light">{(question.content as Record<string, unknown>).questionEn || (question.content as Record<string, unknown>).question || (question.content as Record<string, unknown>).sentenceEn || (question.content as Record<string, unknown>).sentence || (question.content as Record<string, unknown>).textEn || (question.content as Record<string, unknown>).text || (question.content as Record<string, unknown>).textToSpeak || (question.content as Record<string, unknown>).textToHear || 'Matching pairs'}</p>
								<p class="text-sm text-text-muted mt-1">
									Answer: <span class="text-success">{question.correctAnswer}</span>
								</p>
							</div>
							<div class="flex items-center gap-2">
								<button
									onclick={() => openEditModal(question as Question)}
									class="text-primary text-sm hover:underline"
								>
									{t('common.edit')}
								</button>
								{#if deleteQuestionId === question.id}
									<form method="POST" action="?/deleteQuestion" use:enhance class="inline">
										<input type="hidden" name="questionId" value={question.id} />
										<button type="submit" class="text-error text-sm hover:underline">Confirm</button>
									</form>
									<button
										onclick={() => (deleteQuestionId = null)}
										class="text-text-muted text-sm hover:underline"
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
<!-- End Desktop content -->

<!-- Question Modal -->
{#if showQuestionModal}
	<QuestionModal
		mode={editingQuestion ? 'edit' : 'add'}
		question={editingQuestion}
		lessonId={data.lesson.id}
		onClose={closeModal}
	/>
{/if}
