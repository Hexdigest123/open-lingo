<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import * as m from '$lib/paraglide/messages.js';
	import { enhance } from '$app/forms';
	import { Eye, EyeOff } from 'lucide-svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let showKey = $state(false);
	let apiKey = $state('');
	let domainsInput = $state(data.allowedDomains.join(', '));

	// Track which action completed for showing messages
	const lastAction = $derived(form?.action as string | undefined);
</script>

<svelte:head>
	<title>{m["admin.settings.title"]()} - OpenLingo</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-text-light">{m["admin.settings.title"]()}</h1>
	</div>

	<!-- Registration Settings Section -->
	<div class="card">
		<h2 class="text-xl font-bold text-text-light">{m["admin.settings.registration.title"]()}</h2>
		<p class="mt-2 text-text-muted">{m["admin.settings.registration.description"]()}</p>

		<!-- Signup Mode -->
		<div class="mt-6">
			<h3 class="font-semibold text-text-light">{m["admin.settings.signupMode.title"]()}</h3>
			<p class="mt-1 text-sm text-text-muted">{m["admin.settings.signupMode.description"]()}</p>

			{#if form?.success && lastAction === 'updateSignupMode'}
				<div class="mt-3 rounded-xl bg-success/10 p-3 text-sm text-success">
					{form.message}
				</div>
			{/if}
			{#if form?.error && lastAction === 'updateSignupMode'}
				<div class="mt-3 rounded-xl bg-error/10 p-3 text-sm text-error">
					{form.error}
				</div>
			{/if}

			<form method="POST" action="?/updateSignupMode" use:enhance class="mt-4 space-y-3">
				<label
					class="hover:bg-background-light flex cursor-pointer items-center gap-3 rounded-lg border border-border-light p-4"
				>
					<input
						type="radio"
						name="signupMode"
						value="open"
						checked={data.signupMode === 'open'}
						class="h-4 w-4 text-primary"
					/>
					<div>
						<div class="font-medium text-text-light">{m["admin.settings.signupMode.open"]()}</div>
						<div class="text-sm text-text-muted">{m["admin.settings.signupMode.openDesc"]()}</div>
					</div>
				</label>

				<label
					class="hover:bg-background-light flex cursor-pointer items-center gap-3 rounded-lg border border-border-light p-4"
				>
					<input
						type="radio"
						name="signupMode"
						value="invitation"
						checked={data.signupMode === 'invitation'}
						class="h-4 w-4 text-primary"
					/>
					<div>
						<div class="font-medium text-text-light">
							{m["admin.settings.signupMode.invitation"]()}
						</div>
						<div class="text-sm text-text-muted">
							{m["admin.settings.signupMode.invitationDesc"]()}
						</div>
					</div>
				</label>

				<label
					class="hover:bg-background-light flex cursor-pointer items-center gap-3 rounded-lg border border-border-light p-4"
				>
					<input
						type="radio"
						name="signupMode"
						value="approval"
						checked={data.signupMode === 'approval'}
						class="h-4 w-4 text-primary"
					/>
					<div>
						<div class="font-medium text-text-light">{m["admin.settings.signupMode.approval"]()}</div>
						<div class="text-sm text-text-muted">{m["admin.settings.signupMode.approvalDesc"]()}</div>
					</div>
				</label>

				<button type="submit" class="btn btn-primary btn-md"
					>{m["admin.settings.signupMode.save"]()}</button
				>
			</form>

			{#if data.signupMode === 'invitation'}
				<div class="mt-4 rounded-xl bg-primary/10 p-4 text-sm text-primary">
					<strong>{m["common.note"]()}</strong>
					{@html m["admin.settings.signupMode.invitationsNote"]({
						link: `<a href="/admin/invitations" class="underline">${m["admin.nav.invitations"]()}</a>`
					})}
				</div>
			{/if}

			{#if data.signupMode === 'approval'}
				<div class="mt-4 rounded-xl bg-primary/10 p-4 text-sm text-primary">
					<strong>{m["common.note"]()}</strong>
					{@html m["admin.settings.signupMode.approvalsNote"]({
						link: `<a href="/admin/approvals" class="underline">${m["admin.nav.approvals"]()}</a>`
					})}
				</div>
			{/if}
		</div>

		<!-- Domain Restriction -->
		<div class="mt-8 border-t border-border-light pt-6">
			<h3 class="font-semibold text-text-light">{m["admin.settings.domainRestriction.title"]()}</h3>
			<p class="mt-1 text-sm text-text-muted">
				{m["admin.settings.domainRestriction.description"]()}
			</p>

			{#if form?.success && lastAction === 'updateAllowedDomains'}
				<div class="mt-3 rounded-xl bg-success/10 p-3 text-sm text-success">
					{form.message}
				</div>
			{/if}
			{#if form?.error && lastAction === 'updateAllowedDomains'}
				<div class="mt-3 rounded-xl bg-error/10 p-3 text-sm text-error">
					{form.error}
				</div>
			{/if}

			<form method="POST" action="?/updateAllowedDomains" use:enhance class="mt-4 space-y-4">
				<div>
					<label for="allowedDomains" class="block text-sm font-medium text-text-light">
						{m["admin.settings.domainRestriction.label"]()}
					</label>
					<input
						type="text"
						id="allowedDomains"
						name="allowedDomains"
						bind:value={domainsInput}
						placeholder="example.com, company.org"
						class="input mt-1"
					/>
					<p class="mt-1 text-xs text-text-muted">Example: example.com, company.org</p>
				</div>

				<button type="submit" class="btn btn-primary btn-md"
					>{m["admin.settings.domainRestriction.save"]()}</button
				>
			</form>

			{#if data.allowedDomains.length > 0}
				<div class="mt-4">
					<span class="text-sm text-text-muted"
						>{m["admin.settings.domainRestriction.currentlyRestricted"]()}</span
					>
					<div class="mt-2 flex flex-wrap gap-2">
						{#each data.allowedDomains as domain}
							<span class="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
								{domain}
							</span>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Hearts System Settings -->
	<div class="card">
		<h2 class="text-xl font-bold text-text-light">{m["admin.settings.hearts.title"]()}</h2>
		<p class="mt-2 text-text-muted">{m["admin.settings.hearts.description"]()}</p>

		{#if form?.success && lastAction === 'toggleGlobalHearts'}
			<div class="mt-3 rounded-xl bg-success/10 p-3 text-sm text-success">
				{form.message}
			</div>
		{/if}
		{#if form?.error && lastAction === 'toggleGlobalHearts'}
			<div class="mt-3 rounded-xl bg-error/10 p-3 text-sm text-error">
				{form.error}
			</div>
		{/if}

		<div class="mt-4 flex items-center gap-2">
			<span class="text-sm text-text-muted">{m["admin.settings.hearts.currentStatus"]()}</span>
			{#if data.heartsDisabledGlobal}
				<span class="rounded-full bg-error/10 px-3 py-1 text-sm text-error">
					{m["admin.settings.hearts.disabledGlobally"]()}
				</span>
			{:else}
				<span class="rounded-full bg-success/10 px-3 py-1 text-sm text-success">
					{m["admin.settings.hearts.enabled"]()}
				</span>
			{/if}
		</div>

		<form method="POST" action="?/toggleGlobalHearts" use:enhance class="mt-4">
			<input
				type="hidden"
				name="heartsDisabled"
				value={data.heartsDisabledGlobal ? 'false' : 'true'}
			/>
			<button
				type="submit"
				class="btn {data.heartsDisabledGlobal ? 'btn-success' : 'btn-error'} btn-md"
			>
				{data.heartsDisabledGlobal
					? m["admin.settings.hearts.enable"]()
					: m["admin.settings.hearts.disable"]()}
			</button>
		</form>

		<div class="mt-4 rounded-xl bg-yellow/10 p-4 text-sm text-yellow-dark">
			<strong>{m["common.note"]()}</strong>
			{@html m["admin.settings.hearts.note"]({
				link: `<a href="/admin/users" class="underline">${m["admin.nav.users"]()}</a>`
			})}
		</div>
	</div>

	<!-- Global OpenAI API Key Section -->
	<div class="card">
		<h2 class="text-xl font-bold text-text-light">{m["admin.settings.globalApiKey.title"]()}</h2>
		<p class="mt-2 text-text-muted">{m["admin.settings.globalApiKey.description"]()}</p>

		<!-- Status -->
		<div class="mt-4 flex items-center gap-2">
			{#if data.hasGlobalApiKey}
				<span
					class="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-sm text-success"
				>
					<span>✓</span>
					{m["admin.settings.globalApiKey.status.configured"]()}
				</span>
			{:else}
				<span
					class="bg-warning/10 text-warning flex items-center gap-2 rounded-full px-3 py-1 text-sm"
				>
					<span>!</span>
					{m["admin.settings.globalApiKey.status.notConfigured"]()}
				</span>
			{/if}
		</div>

		<!-- Success/Error Messages -->
		{#if form?.success && (lastAction === 'saveGlobalKey' || lastAction === 'removeGlobalKey')}
			<div class="mt-4 rounded-xl bg-success/10 p-4 text-success">
				{form.message}
			</div>
		{/if}
		{#if form?.error && (lastAction === 'saveGlobalKey' || lastAction === 'removeGlobalKey')}
			<div class="mt-4 rounded-xl bg-error/10 p-4 text-error">
				{form.error}
			</div>
		{/if}

		<!-- Info Box -->
		<div class="mt-4 rounded-xl bg-primary/10 p-4 text-sm text-primary">
			<strong>{m["admin.settings.globalApiKey.note"]()}:</strong>
			{m["admin.settings.globalApiKey.noteText"]()}
		</div>

		<!-- Save Form -->
		<form method="POST" action="?/saveGlobalKey" use:enhance class="mt-6 space-y-4">
			<div>
				<label for="apiKey" class="block text-sm font-medium text-text-light">
					{m["admin.settings.globalApiKey.label"]()}
				</label>
				<div class="relative mt-1">
					<input
						type={showKey ? 'text' : 'password'}
						id="apiKey"
						name="apiKey"
						bind:value={apiKey}
						placeholder={m["admin.settings.globalApiKey.placeholder"]()}
						class="input pr-12"
					/>
					<button
						type="button"
						onclick={() => (showKey = !showKey)}
						class="absolute top-1/2 right-3 -translate-y-1/2 text-text-muted hover:text-text-light"
					>
						{#if showKey}
							<EyeOff size={18} />
						{:else}
							<Eye size={18} />
						{/if}
					</button>
				</div>
			</div>

			<div class="flex gap-4">
				<button type="submit" class="btn btn-success btn-md" disabled={!apiKey}>
					{m["admin.settings.globalApiKey.save"]()}
				</button>
			</div>
		</form>

		<!-- Remove Form -->
		{#if data.hasGlobalApiKey}
			<form
				method="POST"
				action="?/removeGlobalKey"
				use:enhance
				class="mt-4 border-t border-border-light pt-4"
			>
				<button type="submit" class="btn btn-error btn-sm">
					{m["admin.settings.globalApiKey.remove"]()}
				</button>
			</form>
		{/if}

		<!-- Help Link -->
		<div class="mt-6 border-t border-border-light pt-4">
			<a
				href="https://platform.openai.com/api-keys"
				target="_blank"
				rel="noopener noreferrer"
				class="text-primary hover:underline"
			>
				{m["settings.apiKey.getKey"]()} →
			</a>
		</div>
	</div>

	<!-- Email Configuration Section -->
	<div class="card">
		<h2 class="text-xl font-bold text-text-light">{m["admin.settings.emailConfig.title"]()}</h2>
		<p class="mt-2 text-text-muted">
			{m["admin.settings.emailConfig.description"]()}
		</p>

		<!-- Status -->
		<div class="mt-4 flex items-center gap-2">
			{#if data.emailConfigured}
				<span
					class="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-sm text-success"
				>
					<span>✓</span>
					{m["admin.settings.emailConfig.configured"]()}
				</span>
			{:else}
				<span
					class="flex items-center gap-2 rounded-full bg-yellow/10 px-3 py-1 text-sm text-yellow-dark"
				>
					<span>!</span>
					{m["admin.settings.emailConfig.notConfigured"]()}
				</span>
			{/if}
		</div>

		<!-- Success/Error Messages -->
		{#if form?.success && lastAction === 'testEmail'}
			<div class="mt-4 rounded-xl bg-success/10 p-4 text-success">
				{form.message}
			</div>
		{/if}
		{#if form?.error && lastAction === 'testEmail'}
			<div class="mt-4 rounded-xl bg-error/10 p-4 text-error">
				{form.error}
			</div>
		{/if}

		{#if data.emailConfigured}
			<form method="POST" action="?/testEmail" use:enhance class="mt-4">
				<button type="submit" class="btn btn-primary btn-sm"
					>{m["admin.settings.emailConfig.testConnection"]()}</button
				>
			</form>
		{:else}
			<div class="mt-4 rounded-xl bg-yellow/10 p-4 text-sm text-yellow-dark">
				<p class="font-medium">{m["admin.settings.emailConfig.envVarsTitle"]()}</p>
				<ul class="mt-2 space-y-1 font-mono text-xs">
					<li>SMTP_HOST - SMTP server hostname</li>
					<li>SMTP_PORT - SMTP port (default: 587)</li>
					<li>SMTP_USER - SMTP username</li>
					<li>SMTP_PASS - SMTP password</li>
					<li>SMTP_FROM - From address (optional)</li>
					<li>PUBLIC_APP_URL - Application URL for links</li>
				</ul>
			</div>
		{/if}
	</div>
</div>
