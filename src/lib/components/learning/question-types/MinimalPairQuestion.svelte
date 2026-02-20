<script lang="ts">
	import { i18n, t } from '$lib/i18n/index.svelte';

	interface Option {
		text: string;
		isCorrect: boolean;
	}

	interface Props {
		questionEn: string;
		questionDe: string;
		audioText: string;
		options: Option[];
		disabled: boolean;
		hasApiKey: boolean;
		onAnswer: (answer: string) => void;
		onSkip?: () => void;
	}

	let { questionEn, questionDe, audioText, options, disabled, hasApiKey, onAnswer, onSkip }: Props =
		$props();

	const questionText = $derived(i18n.locale === 'de' ? questionDe : questionEn);

	let isPlaying = $state(false);
	let isLoading = $state(false);
	let audioElement = $state<HTMLAudioElement | null>(null);
	let audioUrl = $state<string | null>(null);
	let selectedOption = $state<string | null>(null);
	let error = $state<string | null>(null);
	let playbackSpeed = $state(1.0);

	async function playAudio() {
		if (disabled || !hasApiKey || isPlaying) return;

		error = null;

		// If we already have the audio, just play it
		if (audioUrl && audioElement) {
			audioElement.playbackRate = playbackSpeed;
			try {
				await audioElement.play();
				isPlaying = true;
			} catch (e) {
				console.warn('Audio replay failed, recreating element:', e);
				const newAudio = new Audio(audioUrl);
				newAudio.playbackRate = playbackSpeed;
				setupAudioEvents(newAudio);
				audioElement = newAudio;
				try {
					await newAudio.play();
				} catch (e2) {
					console.error('Audio playback failed:', e2);
					error = t('common.error');
				}
			}
			return;
		}

		// Generate audio via TTS
		isLoading = true;
		try {
			const response = await fetch('/api/ai/tts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					text: audioText,
					voice: 'nova',
					speed: playbackSpeed
				})
			});

			const result = await response.json();

			if (!response.ok) {
				error = result.error || t('common.error');
				return;
			}

			// Create audio from base64
			const audioData = `data:${result.contentType};base64,${result.audio}`;
			audioUrl = audioData;

			// Create and play audio element
			const audio = new Audio(audioData);
			audio.playbackRate = playbackSpeed;
			setupAudioEvents(audio);
			audioElement = audio;

			try {
				await audio.play();
			} catch (e) {
				console.warn('Initial audio play failed:', e);
				audio.load();
				try {
					await audio.play();
				} catch (e2) {
					console.error('Audio playback failed after retry:', e2);
					error = t('common.error');
				}
			}
		} catch (err) {
			console.error('Failed to generate audio:', err);
			error = t('common.error');
		} finally {
			isLoading = false;
		}
	}

	function setupAudioEvents(audio: HTMLAudioElement) {
		audio.onplay = () => {
			isPlaying = true;
		};
		audio.onended = () => {
			isPlaying = false;
		};
		audio.onerror = () => {
			isPlaying = false;
			error = t('common.error');
		};
	}

	function selectOption(option: string) {
		if (disabled) return;
		selectedOption = option;
		onAnswer(option);
	}
</script>

<div class="card">
	<h2 class="mb-2 text-lg font-bold text-text-light">
		{t('lesson.types.minimalPair') || 'Minimal Pair'}
	</h2>
	<p class="mb-4 text-text-muted">{questionText}</p>

	{#if !hasApiKey}
		<div class="rounded-xl bg-yellow/10 p-6 text-center">
			<div class="mb-4 flex justify-center text-4xl">🎧</div>
			<p class="font-medium text-yellow-dark">{t('lesson.listening.noApiKey')}</p>
			<p class="mt-2 text-sm text-text-muted">{t('lesson.listening.noApiKeyHint')}</p>
			{#if onSkip}
				<button onclick={onSkip} class="btn btn-primary mt-4">
					{t('lesson.listening.skip')}
				</button>
			{/if}
		</div>
	{:else}
		<div class="mb-8 flex flex-col items-center gap-4">
			<button
				onclick={playAudio}
				disabled={disabled || isLoading}
				class="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all hover:bg-primary/90 active:scale-95
					{disabled || isLoading ? 'cursor-not-allowed opacity-50' : ''}"
			>
				{#if isLoading}
					<svg class="h-10 w-10 animate-spin" viewBox="0 0 24 24">
						<circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
							fill="none"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
				{:else if isPlaying}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="h-10 w-10"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
						/>
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="h-10 w-10"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
						/>
					</svg>
				{/if}
			</button>

			<p class="text-sm text-text-muted">
				{isPlaying ? t('lesson.listening.playing') : t('lesson.listening.tapToPlay')}
			</p>
		</div>

		<div class="grid grid-cols-2 gap-4">
			{#each options as option}
				<button
					onclick={() => selectOption(option.text)}
					{disabled}
					class="w-full rounded-xl border-2 p-6 text-center text-xl font-medium transition-all
						{selectedOption === option.text
						? 'border-primary bg-primary/10 text-primary'
						: 'border-border-light text-text-light hover:border-primary/50'}
						{disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}"
				>
					{option.text}
				</button>
			{/each}
		</div>

		{#if error}
			<div class="mt-4 rounded-xl bg-error/10 p-4 text-center text-error">
				{error}
			</div>
		{/if}
	{/if}
</div>
