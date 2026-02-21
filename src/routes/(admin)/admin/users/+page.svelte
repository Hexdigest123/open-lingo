<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import * as m from '$lib/paraglide/messages.js';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let searchInput = $state(data.search);
	let deleteConfirm = $state<number | null>(null);
	let deleteApprovalConfirm = $state<number | null>(null);

	// Invitation state
	let email = $state('');
	let expiresInDays = $state(7);
	let sendEmail = $state(true);
	let copiedCode = $state<string | null>(null);

	const tabs = [
		{ id: 'users', label: 'admin.nav.users' },
		{ id: 'invitations', label: 'admin.nav.invitations' },
		{ id: 'approvals', label: 'admin.nav.approvals' }
	];

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

	function switchTab(tabId: string) {
		const url = new URL(window.location.href);
		url.searchParams.set('tab', tabId);
		goto(url.toString());
	}

	function formatDate(date: Date | string): string {
		return new Date(date).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function formatDateTime(date: Date | string): string {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function copyToClipboard(code: string) {
		const url = `${$page.url.origin}/register?invite=${code}`;
		navigator.clipboard.writeText(url);
		copiedCode = code;
		setTimeout(() => {
			copiedCode = null;
		}, 2000);
	}

	function isExpired(date: Date | string) {
		return new Date(date) < new Date();
	}
</script>

<svelte:head>
	<title>{m['admin.users.title']()} - OpenLingo</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<h1 class="text-2xl font-bold text-text-light">{m['admin.users.title']()}</h1>

		<div class="flex items-center gap-2">
			{#if data.pendingUsers.length > 0}
				<span class="rounded-full bg-yellow/10 px-3 py-1 text-sm font-medium text-yellow-dark">
					{data.pendingUsers.length}
					{m['admin.approvals.pending']()}
				</span>
			{/if}
		</div>
	</div>

	<!-- Tabs -->
	<div class="flex gap-1 border-b border-border-light">
		{#each tabs as tab}
			<button
				onclick={() => switchTab(tab.id)}
				class="px-4 py-2 text-sm font-medium transition-colors {data.tab === tab.id
					? 'border-b-2 border-primary text-primary'
					: 'text-text-muted hover:text-text-light'}"
			>
				{(m[tab.label as keyof typeof m] as (...args: any[]) => string)()}
				{#if tab.id === 'approvals' && data.pendingUsers.length > 0}
					<span class="ml-1 rounded-full bg-yellow/20 px-2 py-0.5 text-xs text-yellow-dark">
						{data.pendingUsers.length}
					</span>
				{/if}
			</button>
		{/each}
	</div>

	{#if form?.error}
		<div class="rounded-xl bg-error/10 p-4 text-error">{form.error}</div>
	{/if}

	{#if form?.success}
		<div class="rounded-xl bg-success/10 p-4 text-success">
			{form.message || m['common.success']()}
		</div>
	{/if}

	<!-- Users Tab -->
	{#if data.tab === 'users'}
		<form onsubmit={handleSearch} class="flex flex-col gap-2 sm:flex-row">
			<input
				type="text"
				bind:value={searchInput}
				placeholder={m['admin.users.search']()}
				class="input w-full sm:w-64"
			/>
			<button type="submit" class="btn btn-primary btn-md">
				{m['common.search']()}
			</button>
		</form>

		{#if data.users.length === 0}
			<div class="card text-center">
				<p class="text-text-muted">{m['admin.users.noUsers']()}</p>
			</div>
		{:else}
			<div class="overflow-hidden card p-0">
				<table class="w-full">
					<thead class="bg-bg-light-secondary">
						<tr>
							<th class="px-4 py-3 text-left text-sm font-medium text-text-muted"
								>{m['admin.users.user']()}</th
							>
							<th
								class="hidden px-4 py-3 text-left text-sm font-medium text-text-muted md:table-cell"
							>
								{m['admin.users.role']()}
							</th>
							<th
								class="hidden px-4 py-3 text-center text-sm font-medium text-text-muted sm:table-cell"
							>
								{m['admin.users.xp']()}
							</th>
							<th
								class="hidden px-4 py-3 text-center text-sm font-medium text-text-muted sm:table-cell"
							>
								{m['admin.users.hearts']()}
							</th>
							<th
								class="hidden px-4 py-3 text-left text-sm font-medium text-text-muted lg:table-cell"
							>
								{m['admin.users.joined']()}
							</th>
							<th class="px-4 py-3 text-right text-sm font-medium text-text-muted"
								>{m['common.actions']()}</th
							>
						</tr>
					</thead>
					<tbody class="divide-y divide-border-light">
						{#each data.users as user}
							<tr class="hover:bg-bg-light-secondary">
								<td class="px-4 py-3">
									<div class="flex items-center gap-3">
										<div
											class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-success to-primary text-sm font-bold text-white"
										>
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
								<td class="hidden px-4 py-3 text-center sm:table-cell">
									{#if user.heartsDisabled}
										<span class="rounded-full bg-error/10 px-2 py-1 text-xs text-error"
											>{m['admin.users.heartsDisabled']()}</span
										>
									{:else}
										<span class="font-medium text-error">
											{user.hearts ?? 10}
										</span>
									{/if}
								</td>
								<td class="hidden px-4 py-3 lg:table-cell">
									<span class="text-sm text-text-muted">{formatDate(user.createdAt)}</span>
								</td>
								<td class="px-4 py-3 text-right">
									<div class="flex flex-wrap items-center justify-end gap-2">
										{#if !user.heartsDisabled && (user.hearts ?? 10) < 10}
											<form method="POST" action="?/restoreHearts" use:enhance class="inline">
												<input type="hidden" name="userId" value={user.id} />
												<button type="submit" class="py-1 text-sm text-error hover:underline">
													{m['admin.users.restoreHearts']()}
												</button>
											</form>
										{/if}

										<form method="POST" action="?/toggleUserHearts" use:enhance class="inline">
											<input type="hidden" name="userId" value={user.id} />
											<input
												type="hidden"
												name="disabled"
												value={user.heartsDisabled ? 'false' : 'true'}
											/>
											<button
												type="submit"
												class="text-sm text-text-light {user.heartsDisabled
													? 'text-success'
													: 'text-warning'} py-1 hover:underline"
											>
												{user.heartsDisabled
													? m['admin.users.enableHearts']()
													: m['admin.users.disableHearts']()}
											</button>
										</form>

										{#if user.role === 'admin'}
											<form method="POST" action="?/changeRole" use:enhance class="inline">
												<input type="hidden" name="userId" value={user.id} />
												<input type="hidden" name="newRole" value="user" />
												<button type="submit" class="py-1 text-sm text-orange hover:underline">
													{m['admin.users.removeAdmin']()}
												</button>
											</form>
										{:else}
											<form method="POST" action="?/changeRole" use:enhance class="inline">
												<input type="hidden" name="userId" value={user.id} />
												<input type="hidden" name="newRole" value="admin" />
												<button type="submit" class="py-1 text-sm text-purple hover:underline">
													{m['admin.users.makeAdmin']()}
												</button>
											</form>
										{/if}

										{#if deleteConfirm === user.id}
											<form method="POST" action="?/deleteUser" use:enhance class="inline">
												<input type="hidden" name="userId" value={user.id} />
												<button type="submit" class="py-1 text-sm text-error hover:underline"
													>{m['common.confirm']()}</button
												>
											</form>
											<button
												onclick={() => (deleteConfirm = null)}
												class="py-1 text-sm text-text-muted hover:underline"
											>
												{m['common.cancel']()}
											</button>
										{:else}
											<button
												onclick={() => (deleteConfirm = user.id)}
												class="py-1 text-sm text-error hover:underline"
											>
												{m['common.delete']()}
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
	{/if}

	<!-- Invitations Tab -->
	{#if data.tab === 'invitations'}
		{#if data.signupMode !== 'invitation'}
			<div class="rounded-xl bg-yellow/10 p-4 text-yellow-dark">
				<strong>{m['common.note']()}</strong>
				{m['admin.invitations.signupModeNote']({ mode: data.signupMode })}
				<a href="/admin/settings" class="underline">{m['common.changeSettings']()}</a>
			</div>
		{/if}

		<!-- Create Invitation Form -->
		<div class="card">
			<h2 class="text-xl font-bold text-text-light">{m['admin.invitations.create']()}</h2>
			<p class="mt-2 text-text-muted">{m['admin.invitations.createDesc']()}</p>

			{#if form?.code}
				<div class="mt-4 rounded-xl bg-success/10 p-4 text-success">
					{form.message}
					<div class="mt-2 flex items-center gap-2">
						<code class="rounded bg-white/50 px-2 py-1 font-mono text-sm">{form.code}</code>
						<button
							type="button"
							onclick={() => copyToClipboard(form.code)}
							class="btn btn-sm btn-secondary"
						>
							{copiedCode === form.code ? m['common.copied']() : m['common.copyLink']()}
						</button>
					</div>
				</div>
			{/if}

			<form method="POST" action="?/createInvitation" use:enhance class="mt-6 space-y-4">
				<div>
					<label for="email" class="block text-sm font-medium text-text-light">
						{m['admin.invitations.emailOptional']()}
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
						{m['admin.invitations.emailHint']()}
					</p>
				</div>

				<div>
					<label for="expiresInDays" class="block text-sm font-medium text-text-light">
						{m['admin.invitations.expiresInDays']()}
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
							{m['admin.invitations.sendEmailTo']({ email })}
						</label>
					</div>
				{:else if email && !data.emailConfigured}
					<div class="rounded-xl bg-yellow/10 p-3 text-sm text-yellow-dark">
						{m['admin.invitations.emailNotConfigured']()}
						<a href="/admin/settings" class="underline">{m['admin.invitations.configureEmail']()}</a
						>
					</div>
				{/if}

				<button type="submit" class="btn btn-success btn-md">
					{email && sendEmail && data.emailConfigured
						? m['admin.invitations.createAndSend']()
						: m['admin.invitations.create']()}
				</button>
			</form>
		</div>

		<!-- Invitations List -->
		<div class="card">
			<h2 class="text-xl font-bold text-text-light">{m['admin.invitations.allInvitations']()}</h2>

			{#if data.invitations.length === 0}
				<p class="mt-4 text-text-muted">{m['admin.invitations.noInvitations']()}</p>
			{:else}
				<div class="mt-4 overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="border-b border-border-light text-left text-sm text-text-muted">
								<th class="pr-4 pb-3">{m['admin.invitations.code']()}</th>
								<th class="pr-4 pb-3">{m['auth.email']()}</th>
								<th class="pr-4 pb-3">{m['admin.invitations.status']()}</th>
								<th class="pr-4 pb-3">{m['admin.invitations.createdBy']()}</th>
								<th class="pr-4 pb-3">{m['admin.invitations.expires']()}</th>
								<th class="pb-3">{m['common.actions']()}</th>
							</tr>
						</thead>
						<tbody>
							{#each data.invitations as invitation}
								<tr class="border-b border-border-light">
									<td class="py-3 pr-4">
										<code
											class="rounded bg-bg-light-secondary px-2 py-1 font-mono text-xs text-text-light"
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
												{m['admin.invitations.usedBy']({
													name: invitation.usedByName || 'Unknown'
												})}
											</span>
										{:else if isExpired(invitation.expiresAt)}
											<span class="rounded-full bg-error/10 px-2 py-1 text-xs text-error">
												{m['admin.invitations.expired']()}
											</span>
										{:else}
											<span class="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
												{m['admin.invitations.active']()}
											</span>
										{/if}
									</td>
									<td class="py-3 pr-4 text-sm text-text-muted">
										{invitation.createdByName}
									</td>
									<td class="py-3 pr-4 text-sm text-text-muted">
										{formatDateTime(invitation.expiresAt)}
									</td>
									<td class="py-3">
										<div class="flex items-center gap-2">
											{#if !invitation.usedAt && !isExpired(invitation.expiresAt)}
												<button
													type="button"
													onclick={() => copyToClipboard(invitation.code)}
													class="btn btn-sm btn-secondary"
												>
													{copiedCode === invitation.code
														? m['common.copied']()
														: m['common.copy']()}
												</button>
											{/if}
											<form method="POST" action="?/deleteInvitation" use:enhance>
												<input type="hidden" name="id" value={invitation.id} />
												<button type="submit" class="btn btn-sm btn-error">
													{m['common.delete']()}
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
	{/if}

	<!-- Approvals Tab -->
	{#if data.tab === 'approvals'}
		{#if data.signupMode !== 'approval'}
			<div class="rounded-xl bg-yellow/10 p-4 text-yellow-dark">
				<strong>{m['common.note']()}</strong>
				{m['admin.approvals.signupModeNote']({ mode: data.signupMode })}
				<a href="/admin/settings" class="underline">{m['common.changeSettings']()}</a>
			</div>
		{/if}

		<!-- Pending Approvals Section -->
		<div class="card">
			<h2 class="mb-4 text-lg font-semibold text-text-light">
				{m['admin.approvals.pendingTitle']()}
			</h2>
			{#if data.pendingUsers.length === 0}
				<div class="py-8 text-center">
					<div
						class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10"
					>
						<span class="text-2xl">✓</span>
					</div>
					<h3 class="mt-4 text-xl font-semibold text-text-light">
						{m['admin.approvals.allCaughtUp']()}
					</h3>
					<p class="mt-2 text-text-muted">{m['admin.approvals.noPending']()}</p>
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="border-b border-border-light text-left text-sm text-text-muted">
								<th class="pr-4 pb-3">{m['admin.approvals.user']()}</th>
								<th class="pr-4 pb-3">{m['admin.approvals.email']()}</th>
								<th class="pr-4 pb-3">{m['admin.approvals.requested']()}</th>
								<th class="pb-3">{m['admin.approvals.actions']()}</th>
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
													{m['admin.approvals.approve']()}
												</button>
											</form>
											<form method="POST" action="?/rejectUser" use:enhance>
												<input type="hidden" name="userId" value={user.id} />
												<button type="submit" class="btn btn-sm btn-error">
													{m['admin.approvals.reject']()}
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
			<h2 class="mb-4 text-lg font-semibold text-text-light">
				{m['admin.approvals.declinedTitle']()}
			</h2>
			{#if data.rejectedUsers.length === 0}
				<div class="py-8 text-center">
					<div
						class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-border-light/50"
					>
						<span class="text-2xl text-text-muted">-</span>
					</div>
					<h3 class="mt-4 text-xl font-semibold text-text-light">
						{m['admin.approvals.noDeclined']()}
					</h3>
					<p class="mt-2 text-text-muted">{m['admin.approvals.noDeclinedDesc']()}</p>
				</div>
			{:else}
				<p class="mb-4 text-sm text-text-muted">{m['admin.approvals.declinedDesc']()}</p>
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="border-b border-border-light text-left text-sm text-text-muted">
								<th class="pr-4 pb-3">{m['admin.approvals.user']()}</th>
								<th class="pr-4 pb-3">{m['admin.approvals.email']()}</th>
								<th class="pr-4 pb-3">{m['admin.approvals.rejectedOn']()}</th>
								<th class="pb-3">{m['admin.approvals.actions']()}</th>
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
													{m['admin.approvals.allow']()}
												</button>
											</form>
											{#if deleteApprovalConfirm === user.id}
												<form
													method="POST"
													action="?/deleteRejectedUser"
													use:enhance={() => {
														return async ({ update }) => {
															deleteApprovalConfirm = null;
															await update();
														};
													}}
												>
													<input type="hidden" name="userId" value={user.id} />
													<button type="submit" class="btn btn-sm btn-error">
														{m['admin.approvals.confirmDelete']()}
													</button>
												</form>
												<button
													type="button"
													class="btn btn-sm btn-secondary"
													onclick={() => (deleteApprovalConfirm = null)}
												>
													{m['common.cancel']()}
												</button>
											{:else}
												<button
													type="button"
													class="btn btn-sm btn-ghost text-error"
													onclick={() => (deleteApprovalConfirm = user.id)}
												>
													{m['admin.approvals.delete']()}
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
	{/if}
</div>
