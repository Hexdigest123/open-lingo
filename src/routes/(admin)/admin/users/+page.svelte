<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { t } from '$lib/i18n/index.svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let searchInput = $state(data.search);
	let deleteConfirm = $state<number | null>(null);

	function handleSearch(e: Event) {
		e.preventDefault();
		const url = new URL(window.location.href);
		if (searchInput) {
			url.searchParams.set('search', searchInput);
		} else {
			url.searchParams.delete('search');
		}
		goto(url.toString());
	}

	function formatDate(date: Date | string): string {
		return new Date(date).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>{t('admin.users.title')} - OpenLingo</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<h1 class="text-2xl font-bold text-text-light">{t('admin.users.title')}</h1>

		<form onsubmit={handleSearch} class="flex gap-2">
			<input
				type="text"
				bind:value={searchInput}
				placeholder={t('admin.users.search')}
				class="input w-64"
			/>
			<button type="submit" class="btn btn-primary btn-md">
				{t('common.search')}
			</button>
		</form>
	</div>

	{#if form?.error}
		<div class="rounded-xl bg-error/10 p-4 text-error">{form.error}</div>
	{/if}

	{#if form?.success}
		<div class="rounded-xl bg-success/10 p-4 text-success">{t('common.success')}</div>
	{/if}

	<!-- Users Table -->
	{#if data.users.length === 0}
		<div class="card text-center">
			<p class="text-text-muted">{t('admin.users.noUsers')}</p>
		</div>
	{:else}
		<div class="card overflow-hidden p-0">
			<table class="w-full">
				<thead class="bg-bg-light-secondary">
					<tr>
						<th class="px-4 py-3 text-left text-sm font-medium text-text-muted">User</th>
						<th class="hidden px-4 py-3 text-left text-sm font-medium text-text-muted md:table-cell">
							{t('admin.users.role')}
						</th>
						<th class="hidden px-4 py-3 text-center text-sm font-medium text-text-muted sm:table-cell">
							{t('admin.users.xp')}
						</th>
						<th class="hidden px-4 py-3 text-left text-sm font-medium text-text-muted lg:table-cell">
							{t('admin.users.joined')}
						</th>
						<th class="px-4 py-3 text-right text-sm font-medium text-text-muted">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border-light">
					{#each data.users as user}
						<tr class="hover:bg-bg-light-secondary">
							<td class="px-4 py-3">
								<div class="flex items-center gap-3">
									<div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-success to-primary text-sm font-bold text-white">
										{user.displayName.charAt(0).toUpperCase()}
									</div>
									<div>
										<div class="font-medium text-text-light">{user.displayName}</div>
										<div class="text-xs text-text-muted">{user.email}</div>
									</div>
								</div>
							</td>
							<td class="hidden px-4 py-3 md:table-cell">
								<span
									class="rounded-full px-3 py-1 text-xs font-medium {user.role === 'admin'
										? 'bg-purple/10 text-purple'
										: 'bg-primary/10 text-primary'}"
								>
									{user.role}
								</span>
							</td>
							<td class="hidden px-4 py-3 text-center sm:table-cell">
								<span class="font-medium text-yellow-dark">{user.xpTotal || 0}</span>
							</td>
							<td class="hidden px-4 py-3 lg:table-cell">
								<span class="text-sm text-text-muted">{formatDate(user.createdAt)}</span>
							</td>
							<td class="px-4 py-3 text-right">
								<div class="flex items-center justify-end gap-2">
									{#if user.role === 'admin'}
										<form method="POST" action="?/changeRole" use:enhance class="inline">
											<input type="hidden" name="userId" value={user.id} />
											<input type="hidden" name="newRole" value="user" />
											<button type="submit" class="text-sm text-orange hover:underline">
												{t('admin.users.removeAdmin')}
											</button>
										</form>
									{:else}
										<form method="POST" action="?/changeRole" use:enhance class="inline">
											<input type="hidden" name="userId" value={user.id} />
											<input type="hidden" name="newRole" value="admin" />
											<button type="submit" class="text-sm text-purple hover:underline">
												{t('admin.users.makeAdmin')}
											</button>
										</form>
									{/if}

									{#if deleteConfirm === user.id}
										<form method="POST" action="?/deleteUser" use:enhance class="inline">
											<input type="hidden" name="userId" value={user.id} />
											<button type="submit" class="text-sm text-error hover:underline">Confirm</button>
										</form>
										<button onclick={() => (deleteConfirm = null)} class="text-sm text-text-muted hover:underline">
											{t('common.cancel')}
										</button>
									{:else}
										<button onclick={() => (deleteConfirm = user.id)} class="text-sm text-error hover:underline">
											{t('common.delete')}
										</button>
									{/if}
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
