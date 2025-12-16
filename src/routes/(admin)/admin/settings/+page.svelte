<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { t } from '$lib/i18n/index.svelte';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let showKey = $state(false);
	let apiKey = $state('');
	let domainsInput = $state(data.allowedDomains.join(', '));

	// Track which action completed for showing messages
	const lastAction = $derived(form?.action as string | undefined);
</script>

<svelte:head>
	<title>{t('admin.settings.title')} - OpenLingo</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-text-light">{t('admin.settings.title')}</h1>
	</div>

	<!-- Registration Settings Section -->
	<div class="card">
		<h2 class="text-xl font-bold text-text-light">Registration Settings</h2>
		<p class="mt-2 text-text-muted">Control how new users can register for the platform.</p>

		<!-- Signup Mode -->
		<div class="mt-6">
			<h3 class="font-semibold text-text-light">Signup Mode</h3>
			<p class="mt-1 text-sm text-text-muted">Choose how users can create accounts.</p>

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
				<label class="flex items-center gap-3 rounded-lg border border-border-light p-4 hover:bg-background-light cursor-pointer">
					<input
						type="radio"
						name="signupMode"
						value="open"
						checked={data.signupMode === 'open'}
						class="h-4 w-4 text-primary"
					/>
					<div>
						<div class="font-medium text-text-light">Open Registration</div>
						<div class="text-sm text-text-muted">Anyone can create an account</div>
					</div>
				</label>

				<label class="flex items-center gap-3 rounded-lg border border-border-light p-4 hover:bg-background-light cursor-pointer">
					<input
						type="radio"
						name="signupMode"
						value="invitation"
						checked={data.signupMode === 'invitation'}
						class="h-4 w-4 text-primary"
					/>
					<div>
						<div class="font-medium text-text-light">Invitation Only</div>
						<div class="text-sm text-text-muted">Users need an invitation code to register</div>
					</div>
				</label>

				<label class="flex items-center gap-3 rounded-lg border border-border-light p-4 hover:bg-background-light cursor-pointer">
					<input
						type="radio"
						name="signupMode"
						value="approval"
						checked={data.signupMode === 'approval'}
						class="h-4 w-4 text-primary"
					/>
					<div>
						<div class="font-medium text-text-light">Requires Approval</div>
						<div class="text-sm text-text-muted">New accounts must be approved by an admin</div>
					</div>
				</label>

				<button type="submit" class="btn btn-primary btn-md">
					Save Signup Mode
				</button>
			</form>

			{#if data.signupMode === 'invitation'}
				<div class="mt-4 rounded-xl bg-primary/10 p-4 text-sm text-primary">
					<strong>Note:</strong> Manage invitations in the
					<a href="/admin/invitations" class="underline">Invitations</a> page.
				</div>
			{/if}

			{#if data.signupMode === 'approval'}
				<div class="mt-4 rounded-xl bg-primary/10 p-4 text-sm text-primary">
					<strong>Note:</strong> Approve pending users in the
					<a href="/admin/approvals" class="underline">Pending Approvals</a> page.
				</div>
			{/if}
		</div>

		<!-- Domain Restriction -->
		<div class="mt-8 border-t border-border-light pt-6">
			<h3 class="font-semibold text-text-light">Email Domain Restriction</h3>
			<p class="mt-1 text-sm text-text-muted">
				Restrict registration to specific email domains. Leave empty to allow all domains.
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
						Allowed Domains (comma-separated)
					</label>
					<input
						type="text"
						id="allowedDomains"
						name="allowedDomains"
						bind:value={domainsInput}
						placeholder="example.com, company.org"
						class="input mt-1"
					/>
					<p class="mt-1 text-xs text-text-muted">
						Example: example.com, company.org
					</p>
				</div>

				<button type="submit" class="btn btn-primary btn-md">
					Save Domain Restriction
				</button>
			</form>

			{#if data.allowedDomains.length > 0}
				<div class="mt-4">
					<span class="text-sm text-text-muted">Currently restricted to:</span>
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
		<h2 class="text-xl font-bold text-text-light">Hearts System</h2>
		<p class="mt-2 text-text-muted">Control the gamification hearts system for all users.</p>

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
			<span class="text-sm text-text-muted">Current status:</span>
			{#if data.heartsDisabledGlobal}
				<span class="rounded-full bg-error/10 px-3 py-1 text-sm text-error">
					Disabled globally
				</span>
			{:else}
				<span class="rounded-full bg-success/10 px-3 py-1 text-sm text-success">
					Enabled
				</span>
			{/if}
		</div>

		<form method="POST" action="?/toggleGlobalHearts" use:enhance class="mt-4">
			<input type="hidden" name="heartsDisabled" value={data.heartsDisabledGlobal ? 'false' : 'true'} />
			<button type="submit" class="btn {data.heartsDisabledGlobal ? 'btn-success' : 'btn-error'} btn-md">
				{data.heartsDisabledGlobal ? 'Enable Hearts System' : 'Disable Hearts System'}
			</button>
		</form>

		<div class="mt-4 rounded-xl bg-yellow/10 p-4 text-sm text-yellow-dark">
			<strong>Note:</strong> When disabled globally, users won't lose hearts for incorrect answers.
			You can also disable hearts for individual users in the
			<a href="/admin/users" class="underline">Users</a> page.
		</div>
	</div>

	<!-- Global OpenAI API Key Section -->
	<div class="card">
		<h2 class="text-xl font-bold text-text-light">{t('admin.settings.globalApiKey.title')}</h2>
		<p class="mt-2 text-text-muted">{t('admin.settings.globalApiKey.description')}</p>

		<!-- Status -->
		<div class="mt-4 flex items-center gap-2">
			{#if data.hasGlobalApiKey}
				<span class="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-sm text-success">
					<span>✓</span>
					{t('admin.settings.globalApiKey.status.configured')}
				</span>
			{:else}
				<span class="flex items-center gap-2 rounded-full bg-warning/10 px-3 py-1 text-sm text-warning">
					<span>!</span>
					{t('admin.settings.globalApiKey.status.notConfigured')}
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
			<strong>{t('admin.settings.globalApiKey.note')}:</strong>
			{t('admin.settings.globalApiKey.noteText')}
		</div>

		<!-- Save Form -->
		<form method="POST" action="?/saveGlobalKey" use:enhance class="mt-6 space-y-4">
			<div>
				<label for="apiKey" class="block text-sm font-medium text-text-light">
					{t('admin.settings.globalApiKey.label')}
				</label>
				<div class="relative mt-1">
					<input
						type={showKey ? 'text' : 'password'}
						id="apiKey"
						name="apiKey"
						bind:value={apiKey}
						placeholder={t('admin.settings.globalApiKey.placeholder')}
						class="input pr-12"
					/>
					<button
						type="button"
						onclick={() => (showKey = !showKey)}
						class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-light"
					>
						{showKey ? '🙈' : '👁️'}
					</button>
				</div>
			</div>

			<div class="flex gap-4">
				<button type="submit" class="btn btn-success btn-md" disabled={!apiKey}>
					{t('admin.settings.globalApiKey.save')}
				</button>
			</div>
		</form>

		<!-- Remove Form -->
		{#if data.hasGlobalApiKey}
			<form method="POST" action="?/removeGlobalKey" use:enhance class="mt-4 border-t border-border-light pt-4">
				<button type="submit" class="btn btn-error btn-sm">
					{t('admin.settings.globalApiKey.remove')}
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
				{t('settings.apiKey.getKey')} →
			</a>
		</div>
	</div>

	<!-- Email Configuration Section -->
	<div class="card">
		<h2 class="text-xl font-bold text-text-light">Email Configuration</h2>
		<p class="mt-2 text-text-muted">
			Email is used to send invitation links and approval notifications.
		</p>

		<!-- Status -->
		<div class="mt-4 flex items-center gap-2">
			{#if data.emailConfigured}
				<span class="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-sm text-success">
					<span>✓</span>
					Email configured
				</span>
			{:else}
				<span class="flex items-center gap-2 rounded-full bg-yellow/10 px-3 py-1 text-sm text-yellow-dark">
					<span>!</span>
					Email not configured
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
				<button type="submit" class="btn btn-primary btn-sm">
					Test Email Connection
				</button>
			</form>
		{:else}
			<div class="mt-4 rounded-xl bg-yellow/10 p-4 text-sm text-yellow-dark">
				<p class="font-medium">To enable email, set these environment variables:</p>
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
