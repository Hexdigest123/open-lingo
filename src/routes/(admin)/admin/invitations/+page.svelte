<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { t } from '$lib/i18n/index.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let email = $state('');
	let expiresInDays = $state(7);
	let sendEmail = $state(true);
	let copiedCode = $state<string | null>(null);

	function copyToClipboard(code: string) {
		const url = `${$page.url.origin}/register?invite=${code}`;
		navigator.clipboard.writeText(url);
		copiedCode = code;
		setTimeout(() => {
			copiedCode = null;
		}, 2000);
	}

	function formatDate(date: Date | string) {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function isExpired(date: Date | string) {
		return new Date(date) < new Date();
	}
</script>

<svelte:head>
	<title>Invitations - OpenLingo Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-text-light">{t('admin.invitations.title')}</h1>
	</div>

	{#if data.signupMode !== 'invitation'}
		<div class="rounded-xl bg-yellow/10 p-4 text-yellow-dark">
			<strong>{t('common.note')}</strong>
			{t('admin.invitations.signupModeNote', { mode: data.signupMode })}
			<a href="/admin/settings" class="underline">{t('common.changeSettings')}</a>
		</div>
	{/if}

	<!-- Create Invitation Form -->
	<div class="card">
		<h2 class="text-xl font-bold text-text-light">{t('admin.invitations.create')}</h2>
		<p class="mt-2 text-text-muted">{t('admin.invitations.createDesc')}</p>

		{#if form?.success}
			<div class="mt-4 rounded-xl bg-success/10 p-4 text-success">
				{form.message}
				{#if form.code}
					<div class="mt-2 flex items-center gap-2">
						<code class="bg-background-light rounded px-2 py-1 font-mono text-sm">{form.code}</code>
						<button
							type="button"
							onclick={() => copyToClipboard(form.code)}
							class="btn btn-sm btn-secondary"
						>
							{copiedCode === form.code ? t('common.copied') : t('common.copyLink')}
						</button>
					</div>
				{/if}
			</div>
		{/if}
		{#if form?.error}
			<div class="mt-4 rounded-xl bg-error/10 p-4 text-error">
				{form.error}
			</div>
		{/if}

		<form method="POST" action="?/createInvitation" use:enhance class="mt-6 space-y-4">
			<div>
				<label for="email" class="block text-sm font-medium text-text-light">
					{t('admin.invitations.emailOptional')}
				</label>
				<input
					type="email"
					id="email"
					name="email"
					bind:value={email}
					placeholder="user@example.com"
					class="input mt-1"
				/>
				<p class="mt-1 text-xs text-text-muted">
					{t('admin.invitations.emailHint')}
				</p>
			</div>

			<div>
				<label for="expiresInDays" class="block text-sm font-medium text-text-light">
					{t('admin.invitations.expiresInDays')}
				</label>
				<input
					type="number"
					id="expiresInDays"
					name="expiresInDays"
					bind:value={expiresInDays}
					min="1"
					max="365"
					class="input mt-1 w-32"
				/>
			</div>

			{#if email && data.emailConfigured}
				<div class="flex items-center gap-3">
					<input
						type="checkbox"
						id="sendEmail"
						name="sendEmail"
						bind:checked={sendEmail}
						value="true"
						class="h-5 w-5 rounded border-border-light text-success focus:ring-success"
					/>
					<label for="sendEmail" class="text-sm text-text-light">
						{t('admin.invitations.sendEmailTo', { email })}
					</label>
				</div>
			{:else if email && !data.emailConfigured}
				<div class="rounded-xl bg-yellow/10 p-3 text-sm text-yellow-dark">
					{t('admin.invitations.emailNotConfigured')}
					<a href="/admin/settings" class="underline">{t('admin.invitations.configureEmail')}</a>
				</div>
			{/if}

			<button type="submit" class="btn btn-success btn-md">
				{email && sendEmail && data.emailConfigured
					? t('admin.invitations.createAndSend')
					: t('admin.invitations.create')}
			</button>
		</form>
	</div>

	<!-- Invitations List -->
	<div class="card">
		<h2 class="text-xl font-bold text-text-light">{t('admin.invitations.allInvitations')}</h2>

		{#if data.invitations.length === 0}
			<p class="mt-4 text-text-muted">{t('admin.invitations.noInvitations')}</p>
		{:else}
			<div class="mt-4 overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="border-b border-border-light text-left text-sm text-text-muted">
							<th class="pr-4 pb-3">{t('admin.invitations.code')}</th>
							<th class="pr-4 pb-3">{t('auth.email')}</th>
							<th class="pr-4 pb-3">{t('admin.invitations.status')}</th>
							<th class="pr-4 pb-3">{t('admin.invitations.createdBy')}</th>
							<th class="pr-4 pb-3">{t('admin.invitations.expires')}</th>
							<th class="pb-3">{t('common.actions')}</th>
						</tr>
					</thead>
					<tbody>
						{#each data.invitations as invitation}
							<tr class="border-b border-border-light">
								<td class="py-3 pr-4">
									<code
										class="bg-background-light rounded px-2 py-1 font-mono text-xs text-text-light"
									>
										{invitation.code.substring(0, 8)}...
									</code>
								</td>
								<td class="py-3 pr-4 text-sm text-text-light">
									{invitation.email || '-'}
								</td>
								<td class="py-3 pr-4">
									{#if invitation.usedAt}
										<span class="rounded-full bg-success/10 px-2 py-1 text-xs text-success">
											{t('admin.invitations.usedBy', {
												name: invitation.usedByName || 'Unknown'
											})}
										</span>
									{:else if isExpired(invitation.expiresAt)}
										<span class="rounded-full bg-error/10 px-2 py-1 text-xs text-error">
											{t('admin.invitations.expired')}
										</span>
									{:else}
										<span class="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
											{t('admin.invitations.active')}
										</span>
									{/if}
								</td>
								<td class="py-3 pr-4 text-sm text-text-muted">
									{invitation.createdByName}
								</td>
								<td class="py-3 pr-4 text-sm text-text-muted">
									{formatDate(invitation.expiresAt)}
								</td>
								<td class="py-3">
									<div class="flex items-center gap-2">
										{#if !invitation.usedAt && !isExpired(invitation.expiresAt)}
											<button
												type="button"
												onclick={() => copyToClipboard(invitation.code)}
												class="btn btn-sm btn-secondary"
											>
												{copiedCode === invitation.code ? t('common.copied') : t('common.copy')}
											</button>
										{/if}
										<form method="POST" action="?/deleteInvitation" use:enhance>
											<input type="hidden" name="id" value={invitation.id} />
											<button type="submit" class="btn btn-sm btn-error">
												{t('common.delete')}
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
</div>
