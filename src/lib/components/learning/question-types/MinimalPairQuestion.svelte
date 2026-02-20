<script lang="ts">
	import { i18n, t } from '$lib/i18n/index.svelte';
	import { Headphones, Loader2, Volume2, Play } from 'lucide-svelte';

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
			<div class="mb-4 flex justify-center">
				<Headphones size={48} class="text-yellow-dark" />
			</div>
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
					<Loader2 size={40} class="animate-spin" />
				{:else if isPlaying}
					<Volume2 size={40} />
				{:else}
					<Play size={40} class="ml-1" />
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
