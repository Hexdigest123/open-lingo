<script lang="ts">
	import type { PageData } from './$types';
	import { t } from '$lib/i18n/index.svelte';
	import { goto } from '$app/navigation';
	import ChatMessage from '$lib/components/chat/ChatMessage.svelte';
	import ChatInput from '$lib/components/chat/ChatInput.svelte';
	import ModeToggle from '$lib/components/chat/ModeToggle.svelte';
	import VoiceRecorder from '$lib/components/chat/VoiceRecorder.svelte';

	let { data }: { data: PageData } = $props();

	let messages = $state(data.messages.filter((m) => m.role !== 'system'));
	let isLoading = $state(false);
	let chatContainer: HTMLDivElement;
	let mode = $state<'text' | 'voice'>(data.session.mode as 'text' | 'voice');
	let voiceStatus = $state<'disconnected' | 'connecting' | 'connected'>('disconnected');
	let voiceError = $state<string | null>(null);

	async function sendMessage(content: string) {
		if (isLoading || !content.trim()) return;

		// Add user message to UI immediately
		const userMessage = {
			id: Date.now(),
			sessionId: data.session.id,
			role: 'user' as const,
			content,
			createdAt: new Date()
		};
		messages = [...messages, userMessage];

		isLoading = true;
		scrollToBottom();

		try {
			const response = await fetch('/api/chat/completions', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					sessionId: data.session.id,
					message: content
				})
			});

			const result = await response.json();

			if (response.ok && result.message) {
				messages = [...messages, result.message];
			} else {
				// Add error message
				messages = [
					...messages,
					{
						id: Date.now() + 1,
						sessionId: data.session.id,
						role: 'assistant' as const,
						content: result.error || t('chat.error.sendFailed'),
						createdAt: new Date()
					}
				];
			}
		} catch (error) {
			console.error('Failed to send message:', error);
			messages = [
				...messages,
				{
					id: Date.now() + 1,
					sessionId: data.session.id,
					role: 'assistant' as const,
					content: t('chat.error.sendFailed'),
					createdAt: new Date()
				}
			];
		} finally {
			isLoading = false;
			scrollToBottom();
		}
	}

	function scrollToBottom() {
		setTimeout(() => {
			if (chatContainer) {
				chatContainer.scrollTop = chatContainer.scrollHeight;
			}
		}, 100);
	}

	async function deleteSession() {
		if (!confirm('Are you sure you want to delete this conversation?')) return;

		try {
			const response = await fetch(`/api/chat/sessions/${data.session.id}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				goto('/chat');
			}
		} catch (error) {
			console.error('Failed to delete session:', error);
		}
	}

	// Scroll to bottom on mount
	$effect(() => {
		scrollToBottom();
	});

	function handleVoiceTranscript(role: 'user' | 'assistant', text: string) {
		messages = [
			...messages,
			{
				id: Date.now(),
				sessionId: data.session.id,
				role,
				content: text,
				createdAt: new Date()
			}
		];
		scrollToBottom();
	}

	function handleVoiceStatusChange(status: 'disconnected' | 'connecting' | 'connected') {
		voiceStatus = status;
		if (status === 'connected') {
			voiceError = null;
		}
	}

	function handleVoiceError(error: string) {
		voiceError = error;
	}

	function handleModeChange(newMode: 'voice' | 'text') {
		mode = newMode;
		voiceError = null;
	}
</script>

<svelte:head>
	<title>{data.session.title || t('chat.title')} - OpenLingo</title>
</svelte:head>

<div class="mx-auto max-w-2xl flex flex-col h-[calc(100vh-12rem)]">
	<!-- Header -->
	<div class="mb-4 flex flex-col gap-3">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<a href="/chat" class="text-text-muted hover:text-text-light">
					← {t('common.back')}
				</a>
				<span class="text-text-muted">|</span>
				<h1 class="font-medium text-text-light truncate max-w-xs">
					{data.session.title || t('chat.newSession')}
				</h1>
			</div>
			<button
				onclick={deleteSession}
				class="text-sm text-error hover:underline"
			>
				{t('common.delete')}
			</button>
		</div>

		<!-- Mode Toggle -->
		{#if data.hasApiKey}
			<div class="flex justify-center">
				<ModeToggle
					{mode}
					onModeChange={handleModeChange}
					disabled={voiceStatus === 'connecting'}
				/>
			</div>
		{/if}
	</div>

	<!-- Messages -->
	<div
		bind:this={chatContainer}
		class="flex-1 overflow-y-auto space-y-4 pb-4"
	>
		{#if messages.length === 0}
			<div class="text-center py-8">
				<div class="text-4xl mb-4">💬</div>
				<p class="text-text-muted">{t('chat.startConversation')}</p>
			</div>
		{:else}
			{#each messages as message (message.id)}
				<ChatMessage
					role={message.role}
					content={message.content}
				/>
			{/each}
		{/if}

		{#if isLoading}
			<div class="flex gap-3">
				<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white">
					🤖
				</div>
				<div class="rounded-2xl bg-bg-light-secondary px-4 py-3">
					<div class="flex gap-1">
						<span class="w-2 h-2 bg-text-muted rounded-full animate-bounce" style="animation-delay: 0ms"></span>
						<span class="w-2 h-2 bg-text-muted rounded-full animate-bounce" style="animation-delay: 150ms"></span>
						<span class="w-2 h-2 bg-text-muted rounded-full animate-bounce" style="animation-delay: 300ms"></span>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<!-- Input -->
	<div class="mt-auto pt-4 border-t border-border-light">
		{#if mode === 'voice'}
			<!-- Voice Mode -->
			<div class="py-4">
				{#if voiceError}
					<div class="mb-4 rounded-xl bg-error/10 px-4 py-3 text-center text-error">
						{voiceError}
					</div>
				{/if}
				<VoiceRecorder
					sessionId={data.session.id}
					onTranscript={handleVoiceTranscript}
					onStatusChange={handleVoiceStatusChange}
					onError={handleVoiceError}
				/>
			</div>
		{:else}
			<!-- Text Mode -->
			<ChatInput
				onSend={sendMessage}
				disabled={isLoading || !data.hasApiKey}
				placeholder={t('chat.typeMessage')}
			/>
		{/if}
	</div>
</div>
