<script lang="ts">
	import type { PageData } from './$types';
	import { i18n, t } from '$lib/i18n/index.svelte';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	let isCreating = $state(false);

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
			<div class="text-4xl mb-4">🔑</div>
			<h2 class="text-xl font-bold text-text-light mb-2">{t('chat.apiKeyRequired')}</h2>
			<p class="text-text-muted mb-4">{t('chat.apiKeyRequiredDesc')}</p>
			<a href="/settings/api-key" class="btn btn-primary btn-md">
				{t('settings.apiKey.title')}
			</a>
		</div>
	{:else}
		<button
			onclick={createSession}
			disabled={isCreating}
			class="btn btn-success btn-lg w-full mb-6"
		>
			{#if isCreating}
				<span class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
			{/if}
			{t('chat.newSession')}
		</button>

		{#if data.sessions.length === 0}
			<div class="card text-center">
				<div class="text-4xl mb-4">💬</div>
				<p class="text-text-muted">{t('chat.noSessions')}</p>
			</div>
		{:else}
			<div class="space-y-3">
				{#each data.sessions as session}
					<a
						href="/chat/{session.id}"
						class="card block hover:bg-bg-light-secondary transition-colors"
					>
						<div class="flex items-center justify-between">
							<div class="flex-1 min-w-0">
								<h3 class="font-medium text-text-light truncate">{session.title || t('chat.newSession')}</h3>
								<p class="text-sm text-text-muted">{formatDate(session.updatedAt)}</p>
							</div>
							<div class="ml-4 flex items-center gap-2">
								<span class="text-lg">{session.mode === 'voice' ? '🎤' : '💬'}</span>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	{/if}
</div>
