<script lang="ts">
	import { t } from '$lib/i18n/index.svelte';

	interface Props {
		textToHear: string;
		answerType: 'type' | 'multiple_choice';
		options?: string[];
		disabled: boolean;
		hasApiKey: boolean;
		onAnswer: (answer: string) => void;
		onSkip?: () => void;
	}

	let { textToHear, answerType, options, disabled, hasApiKey, onAnswer, onSkip }: Props = $props();

	let isPlaying = $state(false);
	let isLoading = $state(false);
	let audioElement = $state<HTMLAudioElement | null>(null);
	let audioUrl = $state<string | null>(null);
	let answer = $state('');
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
				// Safari/iOS fallback: recreate audio element
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
					text: textToHear,
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

			// Safari/iOS: Use promise-based play with fallback
			try {
				await audio.play();
			} catch (e) {
				// Safari autoplay restriction - try once more after user gesture is confirmed
				console.warn('Initial audio play failed (likely Safari restriction):', e);
				// The audio element is ready, next click should work
				// For iOS Safari, we need to ensure the audio is loaded
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

	function setSpeed(speed: number) {
		playbackSpeed = speed;
		if (audioElement) {
			audioElement.playbackRate = speed;
		}
	}

	function handleTypedSubmit() {
		if (answer.trim() && !disabled) {
			onAnswer(answer.trim());
		}
	}

	function handleOptionSelect(option: string) {
		if (disabled) return;
		selectedOption = option;
		onAnswer(option);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && answerType === 'type') {
			handleTypedSubmit();
		}
	}
</script>

<div class="card">
	<h2 class="mb-2 text-lg font-bold text-text-light">{t('lesson.types.listening')}</h2>
	<p class="mb-4 text-text-muted">{t('lesson.listening.whatDidYouHear')}</p>

	{#if !hasApiKey}
		<!-- No API key - show skip option -->
		<div class="rounded-xl bg-yellow/10 p-6 text-center">
			<div class="mb-4 text-4xl">🎧</div>
			<p class="font-medium text-yellow-dark">{t('lesson.listening.noApiKey')}</p>
			<p class="mt-2 text-sm text-text-muted">{t('lesson.listening.noApiKeyHint')}</p>
			{#if onSkip}
				<button
					onclick={onSkip}
					class="btn btn-primary mt-4"
				>
					{t('lesson.listening.skip')}
				</button>
			{/if}
		</div>
	{:else}
		<!-- Audio player -->
		<div class="mb-6 flex flex-col items-center gap-4">
			<button
				onclick={playAudio}
				disabled={disabled || isLoading}
				class="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all hover:bg-primary/90 active:scale-95
					{disabled || isLoading ? 'cursor-not-allowed opacity-50' : ''}"
			>
				{#if isLoading}
					<svg class="h-8 w-8 animate-spin" viewBox="0 0 24 24">
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
						class="h-8 w-8"
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
						class="h-8 w-8"
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

			<!-- Speed controls -->
			<div class="flex items-center gap-2">
				<span class="text-xs text-text-muted">{t('lesson.listening.speed')}:</span>
				<div class="flex gap-1">
					{#each [0.75, 1.0, 1.25] as speed}
						<button
							onclick={() => setSpeed(speed)}
							class="rounded-lg px-2 py-1 text-xs transition-all
								{playbackSpeed === speed
									? 'bg-primary text-white'
									: 'bg-border-light text-text-muted hover:bg-primary/20'}"
						>
							{speed}x
						</button>
					{/each}
				</div>
			</div>

			{#if audioUrl}
				<button
					onclick={playAudio}
					class="text-sm text-primary hover:underline"
					disabled={disabled || isPlaying}
				>
					{t('lesson.listening.replay')}
				</button>
			{/if}
		</div>

		<!-- Answer input -->
		{#if answerType === 'type'}
			<div class="space-y-4">
				<input
					type="text"
					bind:value={answer}
					onkeydown={handleKeydown}
					placeholder={t('lesson.listening.typeAnswer')}
					disabled={disabled}
					class="input w-full"
				/>
				<button
					onclick={handleTypedSubmit}
					disabled={!answer.trim() || disabled}
					class="btn btn-success btn-lg w-full"
				>
					{t('lesson.checkAnswer')}
				</button>
			</div>
		{:else if answerType === 'multiple_choice' && options}
			<div class="space-y-2">
				{#each options as option}
					<button
						onclick={() => handleOptionSelect(option)}
						disabled={disabled}
						class="w-full rounded-xl border-2 p-4 text-left font-medium transition-all
							{selectedOption === option
								? 'border-primary bg-primary/10 text-primary'
								: 'border-border-light text-text-light hover:border-primary/50'}
							{disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}"
					>
						{option}
					</button>
				{/each}
			</div>
		{/if}

		<!-- Error -->
		{#if error}
			<div class="mt-4 rounded-xl bg-error/10 p-4 text-center text-error">
				{error}
			</div>
		{/if}
	{/if}
</div>
