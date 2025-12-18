<script lang="ts">
	import { t, i18n } from '$lib/i18n/index.svelte';

	interface Props {
		// For native_to_es direction: both language versions of the source text
		textEn?: string;
		textDe?: string;
		// For es_to_native direction: Spanish text only
		text?: string;
		direction: 'native_to_es' | 'es_to_native' | string;
		disabled: boolean;
		onAnswer: (answer: string) => void;
	}

	let { textEn, textDe, text, direction, disabled, onAnswer }: Props = $props();

	let answer = $state('');

	// Get the display text based on direction and user's locale
	const displayText = $derived(() => {
		if (direction === 'native_to_es') {
			// Show the user's native language text
			return i18n.locale === 'de' ? (textDe || textEn || '') : (textEn || textDe || '');
		}
		// es_to_native: show Spanish text
		return text || textEn || '';
	});

	// Get the user's native language name
	const nativeLang = $derived(() => {
		return i18n.locale === 'de' ? t('lesson.languages.german') : t('lesson.languages.english');
	});

	// Determine source and target languages based on direction
	const fromLang = $derived(() => {
		if (direction === 'native_to_es') {
			return nativeLang();
		}
		return t('lesson.languages.spanish');
	});

	const toLang = $derived(() => {
		if (direction === 'native_to_es') {
			return t('lesson.languages.spanish');
		}
		return nativeLang();
	});

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
				{fromLang()}
			</span>
		</div>
		<p class="text-2xl font-medium text-text-light">"{displayText()}"</p>
	</div>

	<div class="mb-4">
		<div class="mb-2 flex items-center gap-2">
			<span class="rounded-lg bg-success/10 px-2 py-1 text-sm font-medium text-success">
				{toLang()}
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
