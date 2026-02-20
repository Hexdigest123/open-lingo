<script lang="ts">
	import type { PageData } from './$types';
	import { t } from '$lib/i18n/index.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Flame, Medal } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	const timeframes = ['daily', 'weekly', 'monthly', 'all_time'] as const;

	function selectTimeframe(tf: string) {
		const url = new URL($page.url);
		url.searchParams.set('timeframe', tf);
		goto(url.toString(), { replaceState: true });
	}

	function getRankClass(rank: number): string {
		if (rank === 1) return 'bg-yellow/20 border-yellow';
		if (rank === 2) return 'bg-gray-100 border-gray-300';
		if (rank === 3) return 'bg-orange/20 border-orange';
		return '';
	}
</script>

<svelte:head>
	<title>{t('leaderboard.title')} - OpenLingo</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="text-center">
		<h1 class="text-3xl font-bold text-text-light">{t('leaderboard.title')}</h1>
		<p class="mt-2 text-text-muted">{t('leaderboard.subtitle')}</p>
	</div>

	<!-- Timeframe Tabs -->
	<div class="flex justify-center">
		<div class="inline-flex rounded-xl bg-bg-light-secondary p-1">
			{#each timeframes as tf}
				<button
					onclick={() => selectTimeframe(tf)}
					class="rounded-lg px-4 py-2 text-sm font-medium transition-colors
						{data.timeframe === tf ? 'bg-white text-primary shadow' : 'text-text-muted hover:text-text-light'}"
				>
					{t(`leaderboard.tabs.${tf === 'all_time' ? 'allTime' : tf}`)}
				</button>
			{/each}
		</div>
	</div>

	<!-- Leaderboard Table -->
	{#if data.leaderboard.length === 0}
		<div class="card text-center">
			<p class="text-text-muted">{t('leaderboard.noData')}</p>
		</div>
	{:else}
		<!-- Mobile View (< sm: 640px) -->
		<div class="space-y-3 sm:hidden">
			{#each data.leaderboard as entry}
				<div
					class="flex items-center gap-3 card p-3 {entry.isCurrentUser
						? 'border-2 border-primary'
						: ''} {getRankClass(entry.rank)}"
				>
					<span class="flex w-8 justify-center text-center text-lg font-bold">
						{#if entry.rank === 1}
							<Medal size={24} class="fill-yellow-400 text-yellow-400" />
						{:else if entry.rank === 2}
							<Medal size={24} class="fill-gray-400 text-gray-400" />
						{:else if entry.rank === 3}
							<Medal size={24} class="fill-orange-400 text-orange-400" />
						{:else}
							{entry.rank}
						{/if}
					</span>
					<div
						class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-success to-primary text-sm font-bold text-white"
					>
						{entry.displayName.charAt(0).toUpperCase()}
					</div>
					<div class="min-w-0 flex-1">
						<p class="truncate font-medium text-text-light">
							{entry.displayName}
							{#if entry.isCurrentUser}
								<span class="text-xs text-primary">({t('leaderboard.you')})</span>
							{/if}
						</p>
						<div class="flex items-center gap-3 text-sm">
							<span class="font-bold text-yellow-dark">{entry.xp} XP</span>
							<span class="flex items-center gap-1 text-orange"
								><Flame size={14} /> {entry.streak || 0}</span
							>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Desktop View (>= sm: 640px) -->
		<div class="hidden overflow-hidden card p-0 sm:block">
			<table class="w-full">
				<thead class="bg-bg-light-secondary">
					<tr>
						<th class="px-4 py-3 text-left text-sm font-medium text-text-muted"
							>{t('leaderboard.rank')}</th
						>
						<th class="px-4 py-3 text-left text-sm font-medium text-text-muted"
							>{t('leaderboard.player')}</th
						>
						<th class="px-4 py-3 text-right text-sm font-medium text-text-muted"
							>{t('leaderboard.xp')}</th
						>
						<th
							class="hidden px-4 py-3 text-right text-sm font-medium text-text-muted sm:table-cell"
						>
							{t('gamification.streak')}
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border-light">
					{#each data.leaderboard as entry}
						<tr class="{entry.isCurrentUser ? 'bg-primary/5' : ''} {getRankClass(entry.rank)}">
							<td class="px-4 py-3">
								<span
									class="flex items-center gap-2 font-bold text-text-light {entry.rank <= 3
										? 'text-lg'
										: ''}"
								>
									{#if entry.rank === 1}
										<Medal size={24} class="fill-yellow-400 text-yellow-400" />
									{:else if entry.rank === 2}
										<Medal size={24} class="fill-gray-400 text-gray-400" />
									{:else if entry.rank === 3}
										<Medal size={24} class="fill-orange-400 text-orange-400" />
									{:else}
										{entry.rank}
									{/if}
								</span>
							</td>
							<td class="px-4 py-3">
								<div class="flex items-center gap-3">
									<div
										class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-success to-primary text-sm font-bold text-white"
									>
										{entry.displayName.charAt(0).toUpperCase()}
									</div>
									<span
										class="font-medium {entry.isCurrentUser ? 'text-primary' : 'text-text-light'}"
									>
										{entry.displayName}
										{#if entry.isCurrentUser}
											<span class="ml-2 text-xs text-primary">({t('leaderboard.you')})</span>
										{/if}
									</span>
								</div>
							</td>
							<td class="px-4 py-3 text-right">
								<span class="font-bold text-yellow-dark">{entry.xp} XP</span>
							</td>
							<td class="hidden px-4 py-3 text-right sm:table-cell">
								<span class="flex items-center justify-end gap-1">
									<span><Flame size={14} /></span>
									<span class="font-medium text-orange">{entry.streak || 0}</span>
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Current User Position (if not in top 50) -->
		{#if typeof data.currentUser.rank === 'string'}
			<div class="card border-2 border-primary bg-primary/5">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<span class="font-bold text-text-muted">{data.currentUser.rank}</span>
						<div
							class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-success to-primary text-sm font-bold text-white"
						>
							{data.currentUser?.displayName?.charAt(0).toUpperCase() || '?'}
						</div>
						<span class="font-medium text-primary">
							{data.currentUser?.displayName || 'You'}
							<span class="ml-2 text-xs">({t('leaderboard.you')})</span>
						</span>
					</div>
					<span class="font-bold text-yellow-dark">{data.currentUser?.xp || 0} XP</span>
				</div>
			</div>
		{/if}
	{/if}
</div>
