<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

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
		<h1 class="text-2xl font-bold text-text-light">Invitations</h1>
	</div>

	{#if data.signupMode !== 'invitation'}
		<div class="rounded-xl bg-yellow/10 p-4 text-yellow-dark">
			<strong>Note:</strong> The signup mode is currently set to "{data.signupMode}". Invitations
			will only be required when the mode is set to "invitation".
			<a href="/admin/settings" class="underline">Change settings</a>
		</div>
	{/if}

	<!-- Create Invitation Form -->
	<div class="card">
		<h2 class="text-xl font-bold text-text-light">Create Invitation</h2>
		<p class="mt-2 text-text-muted">Generate a new invitation code for users to register.</p>

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
							{copiedCode === form.code ? 'Copied!' : 'Copy Link'}
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
					Email (optional)
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
					If specified, the invitation can only be used by this email address
				</p>
			</div>

			<div>
				<label for="expiresInDays" class="block text-sm font-medium text-text-light">
					Expires in (days)
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
						Send invitation email to {email}
					</label>
				</div>
			{:else if email && !data.emailConfigured}
				<div class="rounded-xl bg-yellow/10 p-3 text-sm text-yellow-dark">
					Email is not configured. The invitation will be created but no email will be sent.
					<a href="/admin/settings" class="underline">Configure email settings</a>
				</div>
			{/if}

			<button type="submit" class="btn btn-success btn-md">
				{email && sendEmail && data.emailConfigured
					? 'Create & Send Invitation'
					: 'Create Invitation'}
			</button>
		</form>
	</div>

	<!-- Invitations List -->
	<div class="card">
		<h2 class="text-xl font-bold text-text-light">All Invitations</h2>

		{#if data.invitations.length === 0}
			<p class="mt-4 text-text-muted">No invitations created yet.</p>
		{:else}
			<div class="mt-4 overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="border-b border-border-light text-left text-sm text-text-muted">
							<th class="pr-4 pb-3">Code</th>
							<th class="pr-4 pb-3">Email</th>
							<th class="pr-4 pb-3">Status</th>
							<th class="pr-4 pb-3">Created By</th>
							<th class="pr-4 pb-3">Expires</th>
							<th class="pb-3">Actions</th>
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
											Used by {invitation.usedByName || 'Unknown'}
										</span>
									{:else if isExpired(invitation.expiresAt)}
										<span class="rounded-full bg-error/10 px-2 py-1 text-xs text-error">
											Expired
										</span>
									{:else}
										<span class="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
											Active
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
												{copiedCode === invitation.code ? 'Copied!' : 'Copy'}
											</button>
										{/if}
										<form method="POST" action="?/deleteInvitation" use:enhance>
											<input type="hidden" name="id" value={invitation.id} />
											<button type="submit" class="btn btn-sm btn-error"> Delete </button>
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
