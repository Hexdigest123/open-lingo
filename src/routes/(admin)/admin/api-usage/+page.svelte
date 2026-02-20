<script lang="ts">
	import type { PageData } from './$types';
	import * as m from '$lib/paraglide/messages.js';
	import { Monitor } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	function formatDate(date: Date | string) {
		return new Date(date).toLocaleString();
	}

	function formatNumber(num: number) {
		return num.toLocaleString();
	}
</script>

<svelte:head>
	<title>API Usage - Admin - OpenLingo</title>
</svelte:head>

<!-- Mobile: Show only desktop recommendation -->
<div class="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center md:hidden">
	<Monitor size={64} class="text-text-muted" />
	<div>
		<h1 class="text-xl font-bold text-text-light">{m["admin.desktopRecommended"]()}</h1>
		<p class="mt-2 text-text-muted">{m["admin.desktopRecommendedDesc"]()}</p>
	</div>
	<a href="/admin" class="btn btn-primary btn-md mt-4">
		{m["common.back"]()}
	</a>
</div>

<!-- Desktop: Show full content -->
<div class="mx-auto hidden max-w-7xl p-4 md:block">
	<h1 class="mb-6 text-2xl font-bold text-text-light">{m["admin.apiUsage.title"]()}</h1>

	<!-- Summary Stats -->
	<div class="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
		<div class="bg-card-bg rounded-xl p-4">
			<p class="text-sm text-text-muted">{m["admin.apiUsage.totalRequests30d"]()}</p>
			<p class="text-2xl font-bold text-text-light">{formatNumber(data.stats.totalRequests)}</p>
		</div>
		<div class="bg-card-bg rounded-xl p-4">
			<p class="text-sm text-text-muted">{m["admin.apiUsage.totalTokens"]()}</p>
			<p class="text-2xl font-bold text-text-light">{formatNumber(data.stats.totalTokens)}</p>
		</div>
		<div class="bg-card-bg rounded-xl p-4">
			<p class="text-sm text-text-muted">{m["admin.apiUsage.chatRequests"]()}</p>
			<p class="text-2xl font-bold text-primary">{formatNumber(data.stats.chatRequests)}</p>
		</div>
		<div class="bg-card-bg rounded-xl p-4">
			<p class="text-sm text-text-muted">{m["admin.apiUsage.voiceSessions"]()}</p>
			<p class="text-2xl font-bold text-success">{formatNumber(data.stats.voiceRequests)}</p>
		</div>
		<div class="bg-card-bg rounded-xl p-4">
			<p class="text-sm text-text-muted">{m["admin.apiUsage.explainRequests"]()}</p>
			<p class="text-2xl font-bold text-yellow">{formatNumber(data.stats.explainRequests)}</p>
		</div>
	</div>

	<!-- Per-User Stats -->
	<div class="mb-8">
		<h2 class="mb-4 text-xl font-bold text-text-light">{m["admin.apiUsage.topUsers"]()}</h2>
		<div class="bg-card-bg overflow-x-auto rounded-xl">
			<table class="w-full text-left">
				<thead>
					<tr class="border-b border-text-muted/20">
						<th class="p-4 text-sm font-medium text-text-muted">{m["admin.apiUsage.user"]()}</th>
						<th class="p-4 text-sm font-medium text-text-muted"
							>{m["admin.apiUsage.totalRequests"]()}</th
						>
						<th class="p-4 text-sm font-medium text-text-muted"
							>{m["admin.apiUsage.totalTokens"]()}</th
						>
						<th class="p-4 text-sm font-medium text-text-muted">{m["admin.apiUsage.chat"]()}</th>
						<th class="p-4 text-sm font-medium text-text-muted">{m["admin.apiUsage.voice"]()}</th>
						<th class="p-4 text-sm font-medium text-text-muted">{m["admin.apiUsage.explain"]()}</th>
					</tr>
				</thead>
				<tbody>
					{#each data.userStats as user}
						<tr class="border-b border-text-muted/10">
							<td class="p-4">
								<div>
									<p class="font-medium text-text-light">{user.userDisplayName}</p>
									<p class="text-sm text-text-muted">{user.userEmail}</p>
								</div>
							</td>
							<td class="p-4 text-text-light">{formatNumber(user.totalRequests)}</td>
							<td class="p-4 text-text-light">{formatNumber(Number(user.totalTokens) || 0)}</td>
							<td class="p-4 text-primary">{formatNumber(Number(user.chatRequests) || 0)}</td>
							<td class="p-4 text-success">{formatNumber(Number(user.voiceRequests) || 0)}</td>
							<td class="p-4 text-yellow">{formatNumber(Number(user.explainRequests) || 0)}</td>
						</tr>
					{/each}
					{#if data.userStats.length === 0}
						<tr>
							<td colspan="6" class="p-8 text-center text-text-muted"
								>{m["admin.apiUsage.noUsageData"]()}</td
							>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Recent Activity -->
	<div>
		<h2 class="mb-4 text-xl font-bold text-text-light">{m["admin.apiUsage.recentActivity"]()}</h2>
		<div class="bg-card-bg overflow-x-auto rounded-xl">
			<table class="w-full text-left">
				<thead>
					<tr class="border-b border-text-muted/20">
						<th class="p-4 text-sm font-medium text-text-muted">{m["admin.apiUsage.time"]()}</th>
						<th class="p-4 text-sm font-medium text-text-muted">{m["admin.apiUsage.user"]()}</th>
						<th class="p-4 text-sm font-medium text-text-muted">{m["admin.apiUsage.type"]()}</th>
						<th class="p-4 text-sm font-medium text-text-muted">{m["admin.apiUsage.model"]()}</th>
						<th class="p-4 text-sm font-medium text-text-muted">{m["admin.apiUsage.tokens"]()}</th>
						<th class="p-4 text-sm font-medium text-text-muted">{m["common.actions"]()}</th>
					</tr>
				</thead>
				<tbody>
					{#each data.logs as log}
						<tr class="border-b border-text-muted/10">
							<td class="p-4 text-sm text-text-muted">{formatDate(log.createdAt)}</td>
							<td class="p-4">
								<div>
									<p class="font-medium text-text-light">{log.userDisplayName}</p>
									<p class="text-sm text-text-muted">{log.userEmail}</p>
								</div>
							</td>
							<td class="p-4">
								<span
									class="inline-block rounded-full px-2 py-1 text-xs font-medium"
									class:bg-primary={log.usageType === 'chat'}
									class:text-white={log.usageType === 'chat'}
									class:bg-success={log.usageType === 'voice'}
									class:bg-yellow={log.usageType === 'explain'}
								>
									{log.usageType}
								</span>
							</td>
							<td class="p-4 text-sm text-text-muted">{log.model || '-'}</td>
							<td class="p-4 text-text-light">{formatNumber(log.totalTokens)}</td>
							<td class="p-4">
								{#if log.sessionId}
									<a
										href="/admin/api-usage/chat/{log.sessionId}"
										class="text-primary hover:underline"
									>
										{m["admin.apiUsage.viewChat"]()}
									</a>
								{:else}
									<span class="text-text-muted">-</span>
								{/if}
							</td>
						</tr>
					{/each}
					{#if data.logs.length === 0}
						<tr>
							<td colspan="6" class="p-8 text-center text-text-muted"
								>{m["admin.apiUsage.noUsageLogs"]()}</td
							>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>

		<!-- Pagination -->
		{#if data.totalPages > 1}
			<div class="mt-4 flex items-center justify-center gap-2">
				{#if data.page > 1}
					<a href="?page={data.page - 1}" class="btn btn-secondary">{m["common.previous"]()}</a>
				{/if}
				<span class="px-4 text-text-muted">
					{m["common.page"]({ page: data.page, total: data.totalPages })}
				</span>
				{#if data.page < data.totalPages}
					<a href="?page={data.page + 1}" class="btn btn-secondary">{m["common.next"]()}</a>
				{/if}
			</div>
		{/if}
	</div>
</div>
