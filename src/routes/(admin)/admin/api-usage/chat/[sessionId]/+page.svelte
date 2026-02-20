<script lang="ts">
	import type { PageData } from './$types';
	import { t } from '$lib/i18n/index.svelte';

	let { data }: { data: PageData } = $props();

	function formatDate(date: Date | string) {
		return new Date(date).toLocaleString();
	}
</script>

<svelte:head>
	<title>Chat Session - Admin - OpenLingo</title>
</svelte:head>

<div class="mx-auto max-w-4xl p-4">
	<a href="/admin/api-usage" class="mb-4 inline-block text-primary hover:underline">
		&larr; {t('admin.apiUsage.chatSession.back')}
	</a>

	<!-- Session Info -->
	<div class="bg-card-bg mb-6 rounded-xl p-4">
		<h1 class="mb-2 text-xl font-bold text-text-light">
			{data.session.title || t('admin.apiUsage.chatSession.untitled')}
		</h1>
		<div class="grid gap-2 text-sm text-text-muted sm:grid-cols-2">
			<div>
				<span class="font-medium">{t('admin.apiUsage.chatSession.user')}</span>
				{data.session.userDisplayName} ({data.session.userEmail})
			</div>
			<div>
				<span class="font-medium">{t('admin.apiUsage.chatSession.mode')}</span>
				<span
					class="ml-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium"
					class:bg-primary={data.session.mode === 'text'}
					class:text-white={data.session.mode === 'text'}
					class:bg-success={data.session.mode === 'voice'}
				>
					{data.session.mode}
				</span>
			</div>
			<div>
				<span class="font-medium">{t('admin.apiUsage.chatSession.created')}</span>
				{formatDate(data.session.createdAt)}
			</div>
			<div>
				<span class="font-medium">{t('admin.apiUsage.chatSession.lastUpdated')}</span>
				{formatDate(data.session.updatedAt)}
			</div>
		</div>
	</div>

	<!-- Messages -->
	<div class="space-y-4">
		<h2 class="text-lg font-bold text-text-light">
			{t('admin.apiUsage.chatSession.conversation', { count: data.messages.length })}
		</h2>

		{#each data.messages as message}
			{@const bgClass =
				message.role === 'assistant'
					? 'bg-primary/10'
					: message.role === 'user'
						? 'bg-success/10'
						: 'bg-card-bg'}
			<div class="rounded-xl p-4 {bgClass}">
				<div class="mb-2 flex items-center justify-between">
					<span
						class="text-sm font-medium"
						class:text-primary={message.role === 'assistant'}
						class:text-success={message.role === 'user'}
						class:text-text-muted={message.role === 'system'}
					>
						{message.role === 'assistant'
							? t('admin.apiUsage.chatSession.aiTutor')
							: message.role === 'user'
								? t('admin.apiUsage.chatSession.userRole')
								: t('admin.apiUsage.chatSession.system')}
					</span>
					<span class="text-xs text-text-muted">
						{formatDate(message.createdAt)}
					</span>
				</div>
				<p class="whitespace-pre-wrap text-text-light">{message.content}</p>
			</div>
		{/each}

		{#if data.messages.length === 0}
			<div class="bg-card-bg rounded-xl p-8 text-center text-text-muted">
				{t('admin.apiUsage.chatSession.noMessages')}
			</div>
		{/if}
	</div>
</div>
