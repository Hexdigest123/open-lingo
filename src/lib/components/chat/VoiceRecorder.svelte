<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
import { onDestroy } from 'svelte';
	import { Mic } from 'lucide-svelte';

	interface Props {
		sessionId: string;
		locale: string;
		onTranscript: (role: 'user' | 'assistant', text: string) => void;
		onStatusChange: (status: 'disconnected' | 'connecting' | 'connected') => void;
		onError: (error: string) => void;
	}

	let { sessionId, locale, onTranscript, onStatusChange, onError }: Props = $props();

	let status = $state<'disconnected' | 'connecting' | 'connected'>('disconnected');
	let isRecording = $state(false);

	let peerConnection: RTCPeerConnection | null = null;
	let dataChannel: RTCDataChannel | null = null;
	let audioElement: HTMLAudioElement | null = null;
	let mediaStream: MediaStream | null = null;

	$effect(() => {
		onStatusChange(status);
	});

	async function connect() {
		if (status !== 'disconnected') return;

		status = 'connecting';

		try {
			// Get ephemeral token from our API
			const tokenResponse = await fetch('/api/chat/realtime-token', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ locale })
			});

			if (!tokenResponse.ok) {
				const error = await tokenResponse.json();
				throw new Error(error.error || 'Failed to get realtime token');
			}

			const { client_secret } = await tokenResponse.json();

			// Create peer connection
			peerConnection = new RTCPeerConnection();

			// Set up audio element for playback
			audioElement = document.createElement('audio');
			audioElement.autoplay = true;

			peerConnection.ontrack = (e) => {
				audioElement!.srcObject = e.streams[0];
			};

			// Get microphone access
			mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

			// Add audio track to peer connection
			mediaStream.getTracks().forEach((track) => {
				peerConnection!.addTrack(track, mediaStream!);
			});

			// Set up data channel for events
			dataChannel = peerConnection.createDataChannel('oai-events');

			dataChannel.onopen = () => {
				status = 'connected';
				isRecording = true;
			};

			dataChannel.onmessage = (e) => {
				handleServerEvent(JSON.parse(e.data));
			};

			dataChannel.onerror = (e) => {
				console.error('Data channel error:', e);
				onError(m["chat.error.connectionFailed"]());
			};

			dataChannel.onclose = () => {
				disconnect();
			};

			// Create and set local description
			const offer = await peerConnection.createOffer();
			await peerConnection.setLocalDescription(offer);

			// Connect to OpenAI Realtime API
			const sdpResponse = await fetch(
				'https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17',
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${client_secret.value}`,
						'Content-Type': 'application/sdp'
					},
					body: offer.sdp
				}
			);

			if (!sdpResponse.ok) {
				throw new Error('Failed to connect to Realtime API');
			}

			const answerSdp = await sdpResponse.text();

			await peerConnection.setRemoteDescription({
				type: 'answer',
				sdp: answerSdp
			});
		} catch (error) {
			console.error('Connection error:', error);
			if (error instanceof Error && error.message.includes('Permission denied')) {
				onError(m["chat.error.microphoneAccess"]());
			} else {
				onError(error instanceof Error ? error.message : m["chat.error.connectionFailed"]());
			}
			disconnect();
		}
	}

	function handleServerEvent(event: { type: string; [key: string]: unknown }) {
		switch (event.type) {
			case 'conversation.item.input_audio_transcription.completed': {
				const transcript = (event as { transcript?: string }).transcript;
				if (transcript) {
					onTranscript('user', transcript);
					saveMessage('user', transcript);
				}
				break;
			}
			case 'response.audio_transcript.done': {
				const transcript = (event as { transcript?: string }).transcript;
				if (transcript) {
					onTranscript('assistant', transcript);
					saveMessage('assistant', transcript);
				}
				break;
			}
			case 'error': {
				const errorEvent = event as { error?: { message?: string } };
				console.error('Realtime API error:', errorEvent.error);
				onError(errorEvent.error?.message || 'Unknown error');
				break;
			}
		}
	}

	async function saveMessage(role: 'user' | 'assistant', content: string) {
		try {
			await fetch(`/api/chat/sessions/${sessionId}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ role, content })
			});
		} catch (error) {
			console.error('Failed to save message:', error);
		}
	}

	function disconnect() {
		isRecording = false;
		status = 'disconnected';

		if (mediaStream) {
			mediaStream.getTracks().forEach((track) => track.stop());
			mediaStream = null;
		}

		if (dataChannel) {
			dataChannel.close();
			dataChannel = null;
		}

		if (peerConnection) {
			peerConnection.close();
			peerConnection = null;
		}

		if (audioElement) {
			audioElement.srcObject = null;
			audioElement = null;
		}
	}

	onDestroy(() => {
		disconnect();
	});
</script>

<div class="flex flex-col items-center gap-4">
	{#if status === 'disconnected'}
		<button onclick={connect} class="btn btn-primary btn-lg flex items-center gap-2">
			<Mic size={24} />
			<span>Start Voice Chat</span>
		</button>
		<p class="text-sm text-text-muted">{m["chat.holdToSpeak"]()}</p>
	{:else if status === 'connecting'}
		<div class="flex flex-col items-center gap-2">
			<div
				class="flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-primary/20"
			>
				<Mic size={24} />
			</div>
			<p class="text-sm text-text-muted">{m["chat.connecting"]()}</p>
		</div>
	{:else}
		<div class="flex flex-col items-center gap-4">
			<div class="relative">
				<div
					class="flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-primary"
				>
					<Mic size={28} />
				</div>
				{#if isRecording}
					<div
						class="absolute -right-1 -bottom-1 h-4 w-4 animate-pulse rounded-full bg-error"
					></div>
				{/if}
			</div>
			<p class="text-sm font-medium text-primary">{m["chat.connected"]()}</p>
			<button onclick={disconnect} class="btn btn-error btn-sm"> End Call </button>
		</div>
	{/if}
</div>
