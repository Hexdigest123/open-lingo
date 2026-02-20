<script lang="ts">
	import { i18n, t } from '$lib/i18n/index.svelte';
	import { Mic } from 'lucide-svelte';

	interface Props {
		textToSpeak: string;
		hintEn?: string;
		hintDe?: string;
		disabled: boolean;
		hasApiKey: boolean;
		onAnswer: (answer: string) => void;
		onSkip?: () => void;
	}

	let { textToSpeak, hintEn, hintDe, disabled, hasApiKey, onAnswer, onSkip }: Props = $props();

	// Get locale-specific hint
	const hint = $derived(i18n.locale === 'de' && hintDe ? hintDe : hintEn);

	let isRecording = $state(false);
	let isProcessing = $state(false);
	let mediaRecorder = $state<MediaRecorder | null>(null);
	let audioChunks = $state<Blob[]>([]);
	let feedback = $state<string | null>(null);
	let transcript = $state<string | null>(null);
	let error = $state<string | null>(null);

	async function startRecording() {
		if (disabled || !hasApiKey || isRecording) return;

		try {
			error = null;
			feedback = null;
			transcript = null;

			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

			audioChunks = [];

			recorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					audioChunks = [...audioChunks, event.data];
				}
			};

			recorder.onstop = async () => {
				// Stop all tracks
				stream.getTracks().forEach((track) => track.stop());

				// Process the recorded audio
				await processAudio();
			};

			recorder.start();
			mediaRecorder = recorder;
			isRecording = true;
		} catch (err) {
			console.error('Failed to start recording:', err);
			error = t('chat.error.microphoneAccess');
		}
	}

	function stopRecording() {
		if (mediaRecorder && isRecording) {
			mediaRecorder.stop();
			isRecording = false;
		}
	}

	async function processAudio() {
		if (audioChunks.length === 0) return;

		isProcessing = true;
		error = null;

		try {
			const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });

			// Convert to base64
			const reader = new FileReader();
			const base64Promise = new Promise<string>((resolve) => {
				reader.onloadend = () => {
					const base64 = (reader.result as string).split(',')[1];
					resolve(base64);
				};
			});
			reader.readAsDataURL(audioBlob);
			const audioBase64 = await base64Promise;

			// Send to evaluation API
			const response = await fetch('/api/ai/evaluate-speech', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					expectedText: textToSpeak,
					audioBase64,
					locale: i18n.locale
				})
			});

			const result = await response.json();

			if (!response.ok) {
				error = result.error || t('common.error');
				return;
			}

			transcript = result.transcript;
			feedback = result.feedback;

			// Submit the answer with similarity info
			// The answer is the transcript, and the server will use similarity for validation
			if (result.isCorrect) {
				onAnswer(textToSpeak); // Send expected text for correct match
			} else {
				onAnswer(result.transcript || ''); // Send transcript for incorrect
			}
		} catch (err) {
			console.error('Failed to process audio:', err);
			error = t('common.error');
		} finally {
			isProcessing = false;
		}
	}
</script>

<div class="card">
	<h2 class="mb-2 text-lg font-bold text-text-light">{t('lesson.types.speaking')}</h2>
	<p class="mb-4 text-text-muted">{t('lesson.speaking.speakNow')}</p>

	{#if !hasApiKey}
		<!-- No API key - show skip option -->
		<div class="rounded-xl bg-yellow/10 p-6 text-center">
			<div class="mb-4 flex justify-center"><Mic size={32} class="text-yellow-dark" /></div>
			<p class="font-medium text-yellow-dark">{t('lesson.speaking.noApiKey')}</p>
			<p class="mt-2 text-sm text-text-muted">{t('lesson.speaking.noApiKeyHint')}</p>
			{#if onSkip}
				<button onclick={onSkip} class="btn btn-primary mt-4">
					{t('lesson.speaking.skip')}
				</button>
			{/if}
		</div>
	{:else}
		<!-- Word to speak -->
		<div class="mb-6 rounded-xl bg-primary/10 p-6 text-center">
			<p class="text-2xl font-bold text-primary">{textToSpeak}</p>
			{#if hint}
				<p class="mt-2 text-sm text-text-muted">({hint})</p>
			{/if}
		</div>

		<!-- Recording button -->
		<div class="flex flex-col items-center gap-4">
			{#if isRecording}
				<button
					onclick={stopRecording}
					{disabled}
					aria-label={t('lesson.speaking.stopRecording')}
					class="flex h-20 w-20 items-center justify-center rounded-full bg-error text-white shadow-lg transition-all hover:bg-error/90 active:scale-95"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="h-8 w-8"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
				<p class="text-sm font-medium text-error">{t('lesson.speaking.recording')}</p>
				<div class="flex gap-1">
					{#each Array(5) as _, i}
						<div
							class="h-4 w-1 animate-pulse rounded-full bg-error"
							style="animation-delay: {i * 0.1}s"
						></div>
					{/each}
				</div>
			{:else if isProcessing}
				<div
					class="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-primary"
				>
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
				</div>
				<p class="text-sm font-medium text-primary">{t('lesson.speaking.processing')}</p>
			{:else}
				<button
					onclick={startRecording}
					{disabled}
					aria-label={t('lesson.speaking.tapToRecord')}
					class="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all hover:bg-primary/90 active:scale-95
						{disabled ? 'cursor-not-allowed opacity-50' : ''}"
				>
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
							d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
						/>
					</svg>
				</button>
				<p class="text-sm text-text-muted">{t('lesson.speaking.tapToRecord')}</p>
			{/if}
		</div>

		<!-- Feedback -->
		{#if feedback}
			<div class="mt-6 rounded-xl bg-success/10 p-4 text-center">
				<p class="font-medium text-success">{feedback}</p>
				{#if transcript}
					<p class="mt-2 text-sm text-text-muted">
						{i18n.locale === 'de' ? 'Du sagtest' : 'You said'}: "{transcript}"
					</p>
				{/if}
			</div>
		{/if}

		<!-- Error -->
		{#if error}
			<div class="mt-6 rounded-xl bg-error/10 p-4 text-center text-error">
				{error}
			</div>
		{/if}
	{/if}
</div>
