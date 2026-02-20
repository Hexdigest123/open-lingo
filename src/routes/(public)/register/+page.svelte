<script lang="ts">
	import { enhance } from '$app/forms';
	import { t } from '$lib/i18n/index.svelte';
	import type { ActionData, PageData } from './$types';

	let { form, data }: { form: ActionData; data: PageData } = $props();

	let loading = $state(false);

	// Get signup mode from server data or form response
	const signupMode = $derived(form?.signupMode ?? data.signupMode);
	const requiresInvite = $derived(signupMode === 'invitation');
	const requiresApproval = $derived(signupMode === 'approval');
</script>

<svelte:head>
	<title>{t('auth.signUp')} - OpenLingo</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
	<div class="w-full max-w-md animate-fade-in-up">
		<div class="text-center">
			<h1 class="text-3xl font-bold text-text-light">{t('auth.registerTitle')}</h1>
			<p class="mt-2 text-text-muted">{t('auth.registerSubtitle')}</p>
		</div>

		{#if requiresApproval}
			<div class="mt-4 rounded-xl bg-primary/10 p-4 text-center text-sm text-primary">
				{t('auth.approvalRequired')}
			</div>
		{/if}

		{#if data.domainRestricted}
			<div class="mt-4 rounded-xl bg-yellow/10 p-4 text-center text-sm text-yellow-dark">
				{t('auth.domainRestricted', { domains: data.allowedDomains.join(', ') })}
			</div>
		{/if}

		<form
			method="POST"
			class="mt-8 space-y-6"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					loading = false;
					await update();
				};
			}}
		>
			{#if form?.error}
				<div class="animate-shake rounded-xl bg-error/10 p-4 text-center text-error">
					{t(form.error)}
				</div>
			{/if}

			<div>
				<label for="displayName" class="mb-2 block font-medium text-text-light"
					>{t('auth.displayName')}</label
				>
				<input
					type="text"
					id="displayName"
					name="displayName"
					required
					class="input transition-all duration-200 focus:scale-[1.01]"
					placeholder={t('auth.displayNamePlaceholder')}
					value={form?.displayName ?? ''}
					minlength="2"
					maxlength="50"
				/>
			</div>

			<div>
				<label for="email" class="mb-2 block font-medium text-text-light">{t('auth.email')}</label>
				<input
					type="email"
					id="email"
					name="email"
					required
					class="input transition-all duration-200 focus:scale-[1.01]"
					placeholder={t('auth.emailPlaceholder')}
					value={form?.email ?? ''}
					maxlength="50"
				/>
			</div>

			{#if requiresInvite}
				<div>
					<label for="inviteCode" class="mb-2 block font-medium text-text-light">
						{t('auth.invitationCode')}
						<span class="text-error">*</span>
					</label>
					<input
						type="text"
						id="inviteCode"
						name="inviteCode"
						required
						class="input transition-all duration-200 focus:scale-[1.01]"
						placeholder={t('auth.invitationCodePlaceholder')}
						value={data.inviteCode}
						readonly={!!data.inviteCode}
					/>
					{#if data.inviteCode}
						<p class="mt-1 text-sm text-success">
							{t('auth.invitationCodeApplied')}
						</p>
					{:else}
						<p class="mt-1 text-sm text-text-muted">
							{t('auth.invitationCodeHelp')}
						</p>
					{/if}
				</div>
			{/if}

			<div>
				<label for="password" class="mb-2 block font-medium text-text-light"
					>{t('auth.password')}</label
				>
				<input
					type="password"
					id="password"
					name="password"
					required
					class="input transition-all duration-200 focus:scale-[1.01]"
					placeholder={t('auth.passwordMinChars')}
					minlength="8"
					maxlength="50"
					pattern="[a-zA-Z0-9!@#$%^&*\(\)\-_.\/]+"
					title="Only ASCII characters allowed: letters, numbers, and !@#$%^&*()-_./"
				/>
				<p class="mt-1 text-sm text-text-muted">{t('auth.passwordHint')}</p>
			</div>

			<div>
				<label for="confirmPassword" class="mb-2 block font-medium text-text-light"
					>{t('auth.confirmPassword')}</label
				>
				<input
					type="password"
					id="confirmPassword"
					name="confirmPassword"
					required
					class="input transition-all duration-200 focus:scale-[1.01]"
					placeholder={t('auth.confirmPasswordPlaceholder')}
					minlength="8"
					maxlength="50"
					pattern="[a-zA-Z0-9!@#$%^&*\(\)\-_.\/]+"
					title="Only ASCII characters allowed: letters, numbers, and !@#$%^&*()-_./"
				/>
			</div>

			<button
				type="submit"
				class="btn btn-success btn-lg w-full transform transition-transform hover:scale-[1.02] active:scale-[0.98]"
				disabled={loading}
			>
				{#if loading}
					{t('auth.creatingAccount')}
				{:else if requiresApproval}
					{t('auth.requestAccount')}
				{:else}
					{t('auth.registerButton')}
				{/if}
			</button>
		</form>

		<p class="mt-6 text-center text-text-muted">
			{t('auth.hasAccount')}
			<a href="/login" class="font-medium text-primary hover:underline">{t('auth.loginButton')}</a>
		</p>

		<p class="mt-4 text-center text-sm text-text-muted">
			{t('auth.termsAgreement')}
		</p>
	</div>
</div>

<style>
	@keyframes fade-in-up {
		0% {
			opacity: 0;
			transform: translateY(20px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in-up {
		animation: fade-in-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}
</style>
