<script lang="ts">
	import type { PageData } from './$types';

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

<div class="mx-auto max-w-7xl p-4">
	<h1 class="mb-6 text-2xl font-bold text-text-light">API Usage Audit</h1>

	<!-- Summary Stats -->
	<div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
		<div class="rounded-xl bg-card-bg p-4">
			<p class="text-sm text-text-muted">Total Requests (30d)</p>
			<p class="text-2xl font-bold text-text-light">{formatNumber(data.stats.totalRequests)}</p>
		</div>
		<div class="rounded-xl bg-card-bg p-4">
			<p class="text-sm text-text-muted">Total Tokens</p>
			<p class="text-2xl font-bold text-text-light">{formatNumber(data.stats.totalTokens)}</p>
		</div>
		<div class="rounded-xl bg-card-bg p-4">
			<p class="text-sm text-text-muted">Chat Requests</p>
			<p class="text-2xl font-bold text-primary">{formatNumber(data.stats.chatRequests)}</p>
		</div>
		<div class="rounded-xl bg-card-bg p-4">
			<p class="text-sm text-text-muted">Voice Sessions</p>
			<p class="text-2xl font-bold text-success">{formatNumber(data.stats.voiceRequests)}</p>
		</div>
		<div class="rounded-xl bg-card-bg p-4">
			<p class="text-sm text-text-muted">Explain Requests</p>
			<p class="text-2xl font-bold text-yellow">{formatNumber(data.stats.explainRequests)}</p>
		</div>
	</div>

	<!-- Per-User Stats -->
	<div class="mb-8">
		<h2 class="mb-4 text-xl font-bold text-text-light">Top Users (30 days)</h2>
		<div class="overflow-x-auto rounded-xl bg-card-bg">
			<table class="w-full text-left">
				<thead>
					<tr class="border-b border-text-muted/20">
						<th class="p-4 text-sm font-medium text-text-muted">User</th>
						<th class="p-4 text-sm font-medium text-text-muted">Total Requests</th>
						<th class="p-4 text-sm font-medium text-text-muted">Total Tokens</th>
						<th class="p-4 text-sm font-medium text-text-muted">Chat</th>
						<th class="p-4 text-sm font-medium text-text-muted">Voice</th>
						<th class="p-4 text-sm font-medium text-text-muted">Explain</th>
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
							<td colspan="6" class="p-8 text-center text-text-muted">No usage data yet</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Recent Activity -->
	<div>
		<h2 class="mb-4 text-xl font-bold text-text-light">Recent Activity</h2>
		<div class="overflow-x-auto rounded-xl bg-card-bg">
			<table class="w-full text-left">
				<thead>
					<tr class="border-b border-text-muted/20">
						<th class="p-4 text-sm font-medium text-text-muted">Time</th>
						<th class="p-4 text-sm font-medium text-text-muted">User</th>
						<th class="p-4 text-sm font-medium text-text-muted">Type</th>
						<th class="p-4 text-sm font-medium text-text-muted">Model</th>
						<th class="p-4 text-sm font-medium text-text-muted">Tokens</th>
						<th class="p-4 text-sm font-medium text-text-muted">Actions</th>
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
										View Chat
									</a>
								{:else}
									<span class="text-text-muted">-</span>
								{/if}
							</td>
						</tr>
					{/each}
					{#if data.logs.length === 0}
						<tr>
							<td colspan="6" class="p-8 text-center text-text-muted">No usage logs yet</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>

		<!-- Pagination -->
		{#if data.totalPages > 1}
			<div class="mt-4 flex items-center justify-center gap-2">
				{#if data.page > 1}
					<a href="?page={data.page - 1}" class="btn btn-secondary">Previous</a>
				{/if}
				<span class="px-4 text-text-muted">
					Page {data.page} of {data.totalPages}
				</span>
				{#if data.page < data.totalPages}
					<a href="?page={data.page + 1}" class="btn btn-secondary">Next</a>
				{/if}
			</div>
		{/if}
	</div>
</div>
