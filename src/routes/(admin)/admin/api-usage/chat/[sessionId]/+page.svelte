<script lang="ts">
	import type { PageData } from './$types';

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
		&larr; Back to API Usage
	</a>

	<!-- Session Info -->
	<div class="bg-card-bg mb-6 rounded-xl p-4">
		<h1 class="mb-2 text-xl font-bold text-text-light">
			{data.session.title || 'Untitled Session'}
		</h1>
		<div class="grid gap-2 text-sm text-text-muted sm:grid-cols-2">
			<div>
				<span class="font-medium">User:</span>
				{data.session.userDisplayName} ({data.session.userEmail})
			</div>
			<div>
				<span class="font-medium">Mode:</span>
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
				<span class="font-medium">Created:</span>
				{formatDate(data.session.createdAt)}
			</div>
			<div>
				<span class="font-medium">Last Updated:</span>
				{formatDate(data.session.updatedAt)}
			</div>
		</div>
	</div>

	<!-- Messages -->
	<div class="space-y-4">
		<h2 class="text-lg font-bold text-text-light">
			Conversation ({data.messages.length} messages)
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
							? 'AI Tutor'
							: message.role === 'user'
								? 'User'
								: 'System'}
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
				No messages in this session
			</div>
		{/if}
	</div>
</div>
