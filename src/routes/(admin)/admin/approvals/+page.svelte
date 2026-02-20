<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { t } from '$lib/i18n/index.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let deleteConfirm = $state<number | null>(null);

	function formatDate(date: Date | string) {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>{t('admin.approvals.title')} - OpenLingo Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-text-light">{t('admin.approvals.title')}</h1>
		<div class="flex items-center gap-2">
			{#if data.pendingUsers.length > 0}
				<span class="rounded-full bg-yellow/10 px-3 py-1 text-sm font-medium text-yellow-dark">
					{data.pendingUsers.length}
					{t('admin.approvals.pending')}
				</span>
			{/if}
			{#if data.rejectedUsers.length > 0}
				<span class="rounded-full bg-error/10 px-3 py-1 text-sm font-medium text-error">
					{data.rejectedUsers.length}
					{t('admin.approvals.declined')}
				</span>
			{/if}
		</div>
	</div>

	{#if data.signupMode !== 'approval'}
		<div class="rounded-xl bg-yellow/10 p-4 text-yellow-dark">
			<strong>{t('common.note')}</strong>
			{t('admin.approvals.signupModeNote', { mode: data.signupMode })}
			<a href="/admin/settings" class="underline">{t('common.changeSettings')}</a>
		</div>
	{/if}

	{#if form?.success}
		<div class="rounded-xl bg-success/10 p-4 text-success">
			{form.message}
		</div>
	{/if}
	{#if form?.error}
		<div class="rounded-xl bg-error/10 p-4 text-error">
			{form.error}
		</div>
	{/if}

	<!-- Pending Approvals Section -->
	<div class="card">
		<h2 class="mb-4 text-lg font-semibold text-text-light">{t('admin.approvals.pendingTitle')}</h2>
		{#if data.pendingUsers.length === 0}
			<div class="py-8 text-center">
				<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
					<span class="text-2xl">✓</span>
				</div>
				<h3 class="mt-4 text-xl font-semibold text-text-light">
					{t('admin.approvals.allCaughtUp')}
				</h3>
				<p class="mt-2 text-text-muted">{t('admin.approvals.noPending')}</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="border-b border-border-light text-left text-sm text-text-muted">
							<th class="pr-4 pb-3">{t('admin.approvals.user')}</th>
							<th class="pr-4 pb-3">{t('admin.approvals.email')}</th>
							<th class="pr-4 pb-3">{t('admin.approvals.requested')}</th>
							<th class="pb-3">{t('admin.approvals.actions')}</th>
						</tr>
					</thead>
					<tbody>
						{#each data.pendingUsers as user}
							<tr class="border-b border-border-light">
								<td class="py-4 pr-4">
									<div class="flex items-center gap-3">
										<div
											class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary"
										>
											{user.displayName.charAt(0).toUpperCase()}
										</div>
										<span class="font-medium text-text-light">{user.displayName}</span>
									</div>
								</td>
								<td class="py-4 pr-4 text-sm text-text-muted">
									{user.email}
								</td>
								<td class="py-4 pr-4 text-sm text-text-muted">
									{formatDate(user.createdAt)}
								</td>
								<td class="py-4">
									<div class="flex items-center gap-2">
										<form method="POST" action="?/approveUser" use:enhance>
											<input type="hidden" name="userId" value={user.id} />
											<button type="submit" class="btn btn-sm btn-success">
												{t('admin.approvals.approve')}
											</button>
										</form>
										<form method="POST" action="?/rejectUser" use:enhance>
											<input type="hidden" name="userId" value={user.id} />
											<button type="submit" class="btn btn-sm btn-error">
												{t('admin.approvals.reject')}
											</button>
										</form>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>

	<!-- Declined Approvals Section -->
	<div class="card">
		<h2 class="mb-4 text-lg font-semibold text-text-light">{t('admin.approvals.declinedTitle')}</h2>
		{#if data.rejectedUsers.length === 0}
			<div class="py-8 text-center">
				<div
					class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-border-light/50"
				>
					<span class="text-2xl text-text-muted">-</span>
				</div>
				<h3 class="mt-4 text-xl font-semibold text-text-light">
					{t('admin.approvals.noDeclined')}
				</h3>
				<p class="mt-2 text-text-muted">{t('admin.approvals.noDeclinedDesc')}</p>
			</div>
		{:else}
			<p class="mb-4 text-sm text-text-muted">{t('admin.approvals.declinedDesc')}</p>
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="border-b border-border-light text-left text-sm text-text-muted">
							<th class="pr-4 pb-3">{t('admin.approvals.user')}</th>
							<th class="pr-4 pb-3">{t('admin.approvals.email')}</th>
							<th class="pr-4 pb-3">{t('admin.approvals.rejectedOn')}</th>
							<th class="pb-3">{t('admin.approvals.actions')}</th>
						</tr>
					</thead>
					<tbody>
						{#each data.rejectedUsers as user}
							<tr class="border-b border-border-light">
								<td class="py-4 pr-4">
									<div class="flex items-center gap-3">
										<div
											class="flex h-10 w-10 items-center justify-center rounded-full bg-error/10 font-semibold text-error"
										>
											{user.displayName.charAt(0).toUpperCase()}
										</div>
										<span class="font-medium text-text-light">{user.displayName}</span>
									</div>
								</td>
								<td class="py-4 pr-4 text-sm text-text-muted">
									{user.email}
								</td>
								<td class="py-4 pr-4 text-sm text-text-muted">
									{formatDate(user.updatedAt)}
								</td>
								<td class="py-4">
									<div class="flex items-center gap-2">
										<form method="POST" action="?/reApproveUser" use:enhance>
											<input type="hidden" name="userId" value={user.id} />
											<button type="submit" class="btn btn-sm btn-success">
												{t('admin.approvals.allow')}
											</button>
										</form>
										{#if deleteConfirm === user.id}
											<form
												method="POST"
												action="?/deleteRejectedUser"
												use:enhance={() => {
													return async ({ update }) => {
														deleteConfirm = null;
														await update();
													};
												}}
											>
												<input type="hidden" name="userId" value={user.id} />
												<button type="submit" class="btn btn-sm btn-error">
													{t('admin.approvals.confirmDelete')}
												</button>
											</form>
											<button
												type="button"
												class="btn btn-sm btn-secondary"
												onclick={() => (deleteConfirm = null)}
											>
												{t('common.cancel')}
											</button>
										{:else}
											<button
												type="button"
												class="btn btn-sm btn-ghost text-error"
												onclick={() => (deleteConfirm = user.id)}
											>
												{t('admin.approvals.delete')}
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
</div>
