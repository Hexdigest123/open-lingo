<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import type { PageData } from './$types';
	import { getXpProgress, getRankFromXp } from '$lib/learning/levels';

	let { data }: { data: PageData } = $props();

	const earnedIds = new Set(data.earnedAchievements.map((a) => a.id));
	const levelProgress = $derived(getXpProgress(data.stats.xpTotal ?? 0));
	const userLevel = $derived(data.stats.level ?? levelProgress.level);
	const userRank = $derived(getRankFromXp(data.stats.xpTotal ?? 0));
	let showDeleteModal = $state(false);
	let deletePassword = $state('');
	let isDeleting = $state(false);
	let deleteError = $state<string | null>(null);

	function formatDate(date: Date | string): string {
		return new Date(date).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	async function handleDeleteAccount() {
		if (!deletePassword || isDeleting) return;

		isDeleting = true;
		deleteError = null;

		try {
			const formData = new FormData();
			formData.append('password', deletePassword);

			const response = await fetch('?/deleteAccount', {
				method: 'POST',
				body: formData
			});

			// Check if the response is a redirect (account deleted successfully)
			if (response.redirected || response.ok) {
				// Clear any local storage/session data
				// Navigate to landing page with success message
				window.location.href = '/?deleted=true';
				return;
			}

			// Try to parse error response
			const text = await response.text();
			try {
				const result = JSON.parse(text);
				if (result.data?.deleteError) {
					deleteError = result.data.deleteError;
				} else {
					deleteError = 'errors.deleteFailed';
				}
			} catch {
				// If we can't parse, assume success and redirect
				window.location.href = '/?deleted=true';
				return;
			}
		} catch (error) {
			console.error('Delete account error:', error);
			deleteError = 'errors.deleteFailed';
		} finally {
			isDeleting = false;
		}
	}
</script>

<svelte:head>
	<title>{m['profile.title']()} - OpenLingo</title>
</svelte:head>

<div class="space-y-8">
	<!-- Profile Header -->
	<div class="flex flex-col items-center gap-4 card text-center sm:flex-row sm:text-left">
		<div
			class="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-success to-primary text-4xl text-white"
		>
			{data.profile.displayName.charAt(0).toUpperCase()}
		</div>
		<div class="flex-1">
			<div class="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
				<h1 class="text-2xl font-bold text-text-light">{data.profile.displayName}</h1>
				<span
					class="inline-flex items-center rounded-full border border-border-light bg-bg-light-secondary px-3 py-1 text-sm font-semibold"
					style="color: {userRank.color}"
				>
					{m['profile.level']({ level: userLevel })} - {m['profile.rank']({ rank: userRank.name })}
				</span>
			</div>
			<p class="text-text-muted">{data.profile.email}</p>
			<p class="mt-1 text-sm text-text-muted">
				{m['profile.memberSince']()}
				{formatDate(data.profile.createdAt)}
			</p>
			{#if data.profile.role === 'admin'}
				<span
					class="mt-2 inline-block rounded-full bg-purple/10 px-3 py-1 text-sm font-medium text-purple"
				>
					Admin
				</span>
			{/if}
		</div>
		<div class="flex gap-2">
			<a href="/settings" class="btn btn-ghost btn-sm">{m['profile.editProfile']()}</a>
		</div>
	</div>

	<!-- Statistics -->
	<div>
		<h2 class="mb-4 text-xl font-bold text-text-light">{m['profile.stats.title']()}</h2>
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
			<div class="card text-center">
				<div class="text-3xl font-bold text-yellow">{data.stats.xpTotal}</div>
				<div class="text-sm text-text-muted">{m['profile.stats.totalXP']()}</div>
			</div>
			<div class="card text-center">
				<div class="text-3xl font-bold text-primary">{data.stats.gems}</div>
				<div class="text-sm text-text-muted">{m['profile.stats.gems']()}</div>
			</div>
			<div class="card text-center">
				<div class="text-3xl font-bold text-orange">{data.stats.currentStreak}</div>
				<div class="text-sm text-text-muted">{m['profile.stats.currentStreak']()}</div>
			</div>
			<div class="card text-center">
				<div class="text-3xl font-bold text-purple">{data.stats.longestStreak}</div>
				<div class="text-sm text-text-muted">{m['profile.stats.longestStreak']()}</div>
			</div>
			<div class="card text-center">
				<div class="text-3xl font-bold text-success">{data.lessonsCompleted}</div>
				<div class="text-sm text-text-muted">{m['profile.stats.lessonsCompleted']()}</div>
			</div>
			<div class="card text-center">
				<div class="text-3xl font-bold text-purple">{data.stats.perfectLessons}</div>
				<div class="text-sm text-text-muted">{m['profile.stats.perfectLessons']()}</div>
			</div>
			<div class="card text-center">
				<div class="text-3xl font-bold text-error">{data.stats.hearts}</div>
				<div class="text-sm text-text-muted">{m['gamification.hearts']()}</div>
			</div>
		</div>
	</div>

	<!-- Achievements -->
	<div>
		<h2 class="mb-4 text-xl font-bold text-text-light">
			{m['profile.achievements.title']()}
			<span class="ml-2 text-sm font-normal text-text-muted">
				({data.earnedAchievements.length}/{data.allAchievements.length})
			</span>
		</h2>
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
			{#each data.allAchievements as achievement}
				{@const isEarned = earnedIds.has(achievement.id)}
				<div class="relative card">
					<div class="flex flex-col items-center gap-2 text-center">
						<div
							class="flex h-16 w-16 items-center justify-center rounded-full {isEarned
								? 'bg-yellow/20'
								: 'bg-border-light'}"
						>
							<img
								src={achievement.iconUrl || '/achievements/default.svg'}
								alt={achievement.name}
								class="h-12 w-12 object-contain {isEarned ? '' : 'opacity-40 grayscale'}"
							/>
						</div>
						<h3 class="font-bold text-text-light">{achievement.name}</h3>
						<p class="text-xs text-text-muted">{achievement.description}</p>
						{#if isEarned}
							{@const earned = data.earnedAchievements.find((a) => a.id === achievement.id)}
							<span class="text-xs text-success">
								{m['profile.achievements.earned']()}
								{formatDate(earned!.earnedAt)}
							</span>
						{:else}
							<span class="text-xs text-text-muted">{m['profile.achievements.locked']()}</span>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Danger Zone -->
	<div>
		<h2 class="mb-4 text-xl font-bold text-error">{m['profile.dangerZone.title']()}</h2>
		<div class="card border-2 border-error/30 bg-error/5">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h3 class="font-bold text-text-light">{m['profile.dangerZone.deleteAccount']()}</h3>
					<p class="text-sm text-text-muted">{m['profile.dangerZone.deleteWarning']()}</p>
				</div>
				<button
					onclick={() => {
						deleteError = null;
						deletePassword = '';
						showDeleteModal = true;
					}}
					class="btn btn-error btn-md whitespace-nowrap"
				>
					{m['profile.dangerZone.deleteButton']()}
				</button>
			</div>
		</div>
	</div>
</div>

<!-- Delete Account Modal -->
{#if showDeleteModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-md card">
			<h2 class="mb-4 text-xl font-bold text-error">{m['profile.dangerZone.confirmTitle']()}</h2>
			<p class="mb-4 text-text-muted">{m['profile.dangerZone.confirmMessage']()}</p>

			{#if deleteError && !isDeleting}
				<div class="mb-4 rounded-xl bg-error/10 p-3 text-sm text-error">
					{(m[deleteError as keyof typeof m] as unknown as () => string)?.() ?? deleteError}
				</div>
			{/if}

			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleDeleteAccount();
				}}
			>
				<div class="mb-4">
					<label for="delete-password" class="mb-2 block text-sm font-medium text-text-light">
						{m['profile.dangerZone.enterPassword']()}
					</label>
					<input
						type="password"
						id="delete-password"
						name="password"
						bind:value={deletePassword}
						class="input w-full"
						placeholder={m['auth.password']()}
						required
					/>
				</div>

				<div class="flex gap-3">
					<button
						type="button"
						onclick={() => {
							showDeleteModal = false;
							deletePassword = '';
						}}
						class="btn btn-ghost btn-md flex-1"
						disabled={isDeleting}
					>
						{m['common.cancel']()}
					</button>
					<button
						type="submit"
						class="btn btn-error btn-md flex-1"
						disabled={isDeleting || !deletePassword}
					>
						{#if isDeleting}
							{m['common.loading']()}
						{:else}
							{m['profile.dangerZone.confirmDelete']()}
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
