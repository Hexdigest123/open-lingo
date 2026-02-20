<script lang="ts">
	import type { PageData } from './$types';
	import { i18n, t } from '$lib/i18n/index.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import ConfirmModal from '$lib/components/ConfirmModal.svelte';
	import { Key, MessageCircle, Mic } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	let isCreating = $state(false);
	let deletingSessionId = $state<string | null>(null);
	let pendingDeleteSessionId = $state<string | null>(null);

	async function createSession() {
		if (isCreating) return;
		isCreating = true;

		try {
			const response = await fetch('/api/chat/sessions', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ mode: 'text', locale: i18n.locale })
			});

			const result = await response.json();

			if (response.ok && result.session) {
				goto(`/chat/${result.session.id}`);
			}
		} catch (error) {
			console.error('Failed to create session:', error);
		} finally {
			isCreating = false;
		}
	}

	function promptDeleteSession(event: MouseEvent, sessionId: string) {
		event.preventDefault();
		event.stopPropagation();
		pendingDeleteSessionId = sessionId;
	}

	async function confirmDeleteSession() {
		if (!pendingDeleteSessionId) return;

		const sessionId = pendingDeleteSessionId;
		pendingDeleteSessionId = null;
		deletingSessionId = sessionId;

		try {
			const response = await fetch(`/api/chat/sessions/${sessionId}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				await invalidateAll();
			}
		} catch (error) {
			console.error('Failed to delete session:', error);
		} finally {
			deletingSessionId = null;
		}
	}

	function cancelDeleteSession() {
		pendingDeleteSessionId = null;
	}

	function formatDate(date: Date | string): string {
		return new Date(date).toLocaleDateString(undefined, {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>{t('chat.title')} - OpenLingo</title>
</svelte:head>

<div class="mx-auto max-w-2xl">
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-text-light">{t('chat.title')}</h1>
			<p class="text-text-muted">{t('chat.subtitle')}</p>
		</div>
	</div>

	{#if !data.hasApiKey}
		<div class="card text-center">
			<div class="mb-4 flex justify-center"><Key size={32} class="text-primary" /></div>
			<h2 class="mb-2 text-xl font-bold text-text-light">{t('chat.apiKeyRequired')}</h2>
			<p class="mb-4 text-text-muted">{t('chat.apiKeyRequiredDesc')}</p>
			<a href="/settings/api-key" class="btn btn-primary btn-md">
				{t('settings.apiKey.title')}
			</a>
		</div>
	{:else}
		<button
			onclick={createSession}
			disabled={isCreating}
			class="btn btn-success btn-lg mb-6 w-full"
		>
			{#if isCreating}
				<span
					class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
				></span>
			{/if}
			{t('chat.newSession')}
		</button>

		{#if data.sessions.length === 0}
			<div class="card text-center">
				<div class="mb-4 flex justify-center">
					<MessageCircle size={32} class="text-text-muted" />
				</div>
				<p class="text-text-muted">{t('chat.noSessions')}</p>
			</div>
		{:else}
			<div class="space-y-3">
				{#each data.sessions as session}
					<a
						href="/chat/{session.id}"
						class="block card transition-colors hover:bg-bg-light-secondary"
					>
						<div class="flex items-center justify-between">
							<div class="min-w-0 flex-1">
								<h3 class="truncate font-medium text-text-light">
									{session.title || t('chat.newSession')}
								</h3>
								<p class="text-sm text-text-muted">{formatDate(session.updatedAt)}</p>
							</div>
							<div class="ml-4 flex items-center gap-2">
								<span class="text-lg"
									>{#if session.mode === 'voice'}<Mic size={18} />{:else}<MessageCircle
											size={18}
										/>{/if}</span
								>
								<button
									onclick={(e) => promptDeleteSession(e, session.id)}
									disabled={deletingSessionId === session.id}
									class="rounded-lg p-1 text-text-muted transition-colors hover:bg-error/10 hover:text-error {deletingSessionId ===
									session.id
										? 'opacity-50'
										: ''}"
									title={t('common.delete')}
								>
									{#if deletingSessionId === session.id}
										<span
											class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-error border-t-transparent"
										></span>
									{:else}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="2"
											stroke="currentColor"
											class="h-4 w-4"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									{/if}
								</button>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	{/if}
</div>

<ConfirmModal
	open={pendingDeleteSessionId !== null}
	title={t('chat.deleteTitle')}
	message={t('chat.confirmDelete')}
	confirmText={t('common.delete')}
	onConfirm={confirmDeleteSession}
	onCancel={cancelDeleteSession}
/>
