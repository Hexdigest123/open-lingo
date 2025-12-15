<script lang="ts">
	import { t } from '$lib/i18n/index.svelte';

	interface Props {
		text: string;
		direction: string;
		disabled: boolean;
		onAnswer: (answer: string) => void;
	}

	let { text, direction, disabled, onAnswer }: Props = $props();

	let answer = $state('');

	// Determine source and target languages based on direction
	function getFromLang(dir: string): string {
		switch (dir) {
			case 'en_to_es':
				return t('lesson.languages.english');
			case 'es_to_en':
			case 'es_to_de':
				return t('lesson.languages.spanish');
			case 'de_to_es':
				return t('lesson.languages.german');
			default:
				return t('lesson.languages.english');
		}
	}

	function getToLang(dir: string): string {
		switch (dir) {
			case 'en_to_es':
			case 'de_to_es':
				return t('lesson.languages.spanish');
			case 'es_to_en':
				return t('lesson.languages.english');
			case 'es_to_de':
				return t('lesson.languages.german');
			default:
				return t('lesson.languages.spanish');
		}
	}

	const fromLang = $derived(getFromLang(direction));
	const toLang = $derived(getToLang(direction));

	function submit() {
		if (answer.trim() && !disabled) {
			onAnswer(answer.trim());
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && answer.trim() && !disabled) {
			submit();
		}
	}
</script>

<div class="card">
	<h2 class="mb-2 text-lg font-bold text-text-light">{t('lesson.types.translation')}</h2>

	<div class="mb-6">
		<div class="mb-2 flex items-center gap-2">
			<span class="rounded-lg bg-primary/10 px-2 py-1 text-sm font-medium text-primary">
				{fromLang}
			</span>
		</div>
		<p class="text-2xl font-medium text-text-light">"{text}"</p>
	</div>

	<div class="mb-4">
		<div class="mb-2 flex items-center gap-2">
			<span class="rounded-lg bg-success/10 px-2 py-1 text-sm font-medium text-success">
				{toLang}
			</span>
		</div>
		<textarea
			bind:value={answer}
			onkeydown={handleKeydown}
			placeholder={t('lesson.typeTranslation')}
			disabled={disabled}
			rows="2"
			class="input text-lg"
		></textarea>
	</div>

	{#if !disabled}
		<button
			onclick={submit}
			disabled={!answer.trim()}
			class="btn btn-success btn-lg w-full"
		>
			{t('lesson.checkAnswer')}
		</button>
	{/if}
</div>
