<script lang="ts">
	import type { PageData } from './$types';
	import { t } from '$lib/i18n/index.svelte';
	import { Trophy, Lock } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	const earnedIds = new Set(data.earnedAchievements.map((a) => a.id));
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
	<title>{t('profile.title')} - OpenLingo</title>
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
			<h1 class="text-2xl font-bold text-text-light">{data.profile.displayName}</h1>
			<p class="text-text-muted">{data.profile.email}</p>
			<p class="mt-1 text-sm text-text-muted">
				{t('profile.memberSince')}
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
			<a href="/settings" class="btn btn-ghost btn-sm">{t('profile.editProfile')}</a>
		</div>
	</div>

	<!-- Statistics -->
	<div>
		<h2 class="mb-4 text-xl font-bold text-text-light">{t('profile.stats.title')}</h2>
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
			<div class="card text-center">
				<div class="text-3xl font-bold text-yellow">{data.stats.xpTotal}</div>
				<div class="text-sm text-text-muted">{t('profile.stats.totalXP')}</div>
			</div>
			<div class="card text-center">
				<div class="text-3xl font-bold text-orange">{data.stats.currentStreak}</div>
				<div class="text-sm text-text-muted">{t('profile.stats.currentStreak')}</div>
			</div>
			<div class="card text-center">
				<div class="text-3xl font-bold text-purple">{data.stats.longestStreak}</div>
				<div class="text-sm text-text-muted">{t('profile.stats.longestStreak')}</div>
			</div>
			<div class="card text-center">
				<div class="text-3xl font-bold text-success">{data.lessonsCompleted}</div>
				<div class="text-sm text-text-muted">{t('profile.stats.lessonsCompleted')}</div>
			</div>
			<div class="card text-center">
				<div class="text-3xl font-bold text-error">{data.stats.hearts}</div>
				<div class="text-sm text-text-muted">{t('gamification.hearts')}</div>
			</div>
		</div>
	</div>

	<!-- Achievements -->
	<div>
		<h2 class="mb-4 text-xl font-bold text-text-light">
			{t('profile.achievements.title')}
			<span class="ml-2 text-sm font-normal text-text-muted">
				({data.earnedAchievements.length}/{data.allAchievements.length})
			</span>
		</h2>
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
			{#each data.allAchievements as achievement}
				{@const isEarned = earnedIds.has(achievement.id)}
				<div class="relative card {isEarned ? '' : 'opacity-50 grayscale'}">
					<div class="flex flex-col items-center gap-2 text-center">
						<div
							class="flex h-16 w-16 items-center justify-center rounded-full {isEarned
								? 'bg-yellow/20'
								: 'bg-border-light'}"
						>
							<span class="text-3xl"
								>{#if isEarned}<Trophy size={28} class="text-yellow" />{:else}<Lock
										size={28}
										class="text-text-muted"
									/>{/if}</span
							>
						</div>
						<h3 class="font-bold text-text-light">{achievement.name}</h3>
						<p class="text-xs text-text-muted">{achievement.description}</p>
						{#if isEarned}
							{@const earned = data.earnedAchievements.find((a) => a.id === achievement.id)}
							<span class="text-xs text-success">
								{t('profile.achievements.earned')}
								{formatDate(earned!.earnedAt)}
							</span>
						{:else}
							<span class="text-xs text-text-muted">{t('profile.achievements.locked')}</span>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Danger Zone -->
	<div>
		<h2 class="mb-4 text-xl font-bold text-error">{t('profile.dangerZone.title')}</h2>
		<div class="card border-2 border-error/30 bg-error/5">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h3 class="font-bold text-text-light">{t('profile.dangerZone.deleteAccount')}</h3>
					<p class="text-sm text-text-muted">{t('profile.dangerZone.deleteWarning')}</p>
				</div>
				<button
					onclick={() => {
						deleteError = null;
						deletePassword = '';
						showDeleteModal = true;
					}}
					class="btn btn-error btn-md whitespace-nowrap"
				>
					{t('profile.dangerZone.deleteButton')}
				</button>
			</div>
		</div>
	</div>
</div>

<!-- Delete Account Modal -->
{#if showDeleteModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-md card">
			<h2 class="mb-4 text-xl font-bold text-error">{t('profile.dangerZone.confirmTitle')}</h2>
			<p class="mb-4 text-text-muted">{t('profile.dangerZone.confirmMessage')}</p>

			{#if deleteError && !isDeleting}
				<div class="mb-4 rounded-xl bg-error/10 p-3 text-sm text-error">
					{t(deleteError)}
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
						{t('profile.dangerZone.enterPassword')}
					</label>
					<input
						type="password"
						id="delete-password"
						name="password"
						bind:value={deletePassword}
						class="input w-full"
						placeholder={t('auth.password')}
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
						{t('common.cancel')}
					</button>
					<button
						type="submit"
						class="btn btn-error btn-md flex-1"
						disabled={isDeleting || !deletePassword}
					>
						{#if isDeleting}
							{t('common.loading')}
						{:else}
							{t('profile.dangerZone.confirmDelete')}
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
