<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { t, i18n } from '$lib/i18n/index.svelte';
	import type { Locale } from '$lib/i18n/index.svelte';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let displayName = $state(data.profile.displayName);
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let isUpdatingProfile = $state(false);
	let isChangingPassword = $state(false);

	function setLocale(locale: Locale) {
		i18n.setLocale(locale);
	}

	function resetPasswordForm() {
		currentPassword = '';
		newPassword = '';
		confirmPassword = '';
	}
</script>

<svelte:head>
	<title>{t('settings.title')} - OpenLingo</title>
</svelte:head>

<div class="space-y-8">
	<h1 class="text-3xl font-bold text-text-light">{t('settings.title')}</h1>

	<!-- Profile Settings -->
	<div class="card">
		<h2 class="text-xl font-bold text-text-light">{t('profile.editProfile')}</h2>
		<p class="mt-1 text-text-muted">{t('settings.profileDescription') || 'Update your display name and profile information.'}</p>

		{#if form?.profileSuccess}
			<div class="mt-4 rounded-xl bg-success/10 p-3 text-success">
				{t('settings.profileUpdated') || 'Profile updated successfully!'}
			</div>
		{/if}

		{#if form?.profileError}
			<div class="mt-4 rounded-xl bg-error/10 p-3 text-error">
				{form.profileError}
			</div>
		{/if}

		<form
			method="POST"
			action="?/updateProfile"
			use:enhance={() => {
				isUpdatingProfile = true;
				return async ({ update }) => {
					isUpdatingProfile = false;
					await update();
				};
			}}
			class="mt-6 space-y-4"
		>
			<div>
				<label for="email" class="block text-sm font-medium text-text-light">
					{t('auth.email')}
				</label>
				<input
					type="email"
					id="email"
					value={data.profile.email}
					disabled
					class="input mt-1 bg-bg-light-secondary text-text-muted cursor-not-allowed"
				/>
				<p class="mt-1 text-xs text-text-muted">{t('settings.emailCannotChange') || 'Email cannot be changed.'}</p>
			</div>

			<div>
				<label for="displayName" class="block text-sm font-medium text-text-light">
					{t('auth.displayName')}
				</label>
				<input
					type="text"
					id="displayName"
					name="displayName"
					bind:value={displayName}
					required
					minlength="2"
					maxlength="50"
					class="input mt-1"
				/>
			</div>

			<button
				type="submit"
				disabled={isUpdatingProfile || displayName === data.profile.displayName}
				class="btn btn-success btn-md"
			>
				{#if isUpdatingProfile}
					{t('common.loading')}
				{:else}
					{t('common.save')}
				{/if}
			</button>
		</form>
	</div>

	<!-- Password Change -->
	<div class="card">
		<h2 class="text-xl font-bold text-text-light">{t('settings.changePassword') || 'Change Password'}</h2>
		<p class="mt-1 text-text-muted">{t('settings.passwordDescription') || 'Update your account password.'}</p>

		{#if form?.passwordSuccess}
			<div class="mt-4 rounded-xl bg-success/10 p-3 text-success">
				{t('settings.passwordChanged') || 'Password changed successfully!'}
			</div>
		{/if}

		{#if form?.passwordError}
			<div class="mt-4 rounded-xl bg-error/10 p-3 text-error">
				{form.passwordError}
			</div>
		{/if}

		<form
			method="POST"
			action="?/changePassword"
			use:enhance={() => {
				isChangingPassword = true;
				return async ({ update, result }) => {
					isChangingPassword = false;
					if (result.type === 'success') {
						resetPasswordForm();
					}
					await update();
				};
			}}
			class="mt-6 space-y-4"
		>
			<div>
				<label for="currentPassword" class="block text-sm font-medium text-text-light">
					{t('settings.currentPassword') || 'Current Password'}
				</label>
				<input
					type="password"
					id="currentPassword"
					name="currentPassword"
					bind:value={currentPassword}
					required
					class="input mt-1"
				/>
			</div>

			<div>
				<label for="newPassword" class="block text-sm font-medium text-text-light">
					{t('settings.newPassword') || 'New Password'}
				</label>
				<input
					type="password"
					id="newPassword"
					name="newPassword"
					bind:value={newPassword}
					required
					minlength="8"
					class="input mt-1"
				/>
				<p class="mt-1 text-xs text-text-muted">{t('auth.passwordHint') || 'Minimum 8 characters'}</p>
			</div>

			<div>
				<label for="confirmPassword" class="block text-sm font-medium text-text-light">
					{t('settings.confirmPassword') || 'Confirm New Password'}
				</label>
				<input
					type="password"
					id="confirmPassword"
					name="confirmPassword"
					bind:value={confirmPassword}
					required
					minlength="8"
					class="input mt-1"
				/>
			</div>

			<button
				type="submit"
				disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
				class="btn btn-primary btn-md"
			>
				{#if isChangingPassword}
					{t('common.loading')}
				{:else}
					{t('settings.changePassword') || 'Change Password'}
				{/if}
			</button>
		</form>
	</div>

	<!-- Language Settings -->
	<div class="card">
		<h2 class="text-xl font-bold text-text-light">{t('settings.language')}</h2>
		<p class="mt-1 text-text-muted">{t('settings.languageDescription')}</p>
		<div class="mt-4 flex gap-4">
			{#each i18n.availableLocales as locale}
				<button
					onclick={() => setLocale(locale.code)}
					class="flex items-center gap-2 rounded-xl border-2 px-4 py-3 font-medium transition-colors
						{i18n.locale === locale.code
						? 'border-primary bg-primary/10 text-primary'
						: 'border-border-light text-text-light hover:border-primary/50'}"
				>
					<span class="text-xl">{locale.code === 'en' ? '🇬🇧' : '🇩🇪'}</span>
					<span>{locale.name}</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- API Key Settings -->
	<div class="card">
		<h2 class="text-xl font-bold text-text-light">{t('settings.apiKey.title')}</h2>
		<p class="mt-1 text-text-muted">{t('settings.apiKey.description')}</p>
		<div class="mt-4">
			<a href="/settings/api-key" class="btn btn-primary btn-md">
				{t('settings.apiKey.configure') || 'Configure API Key'}
			</a>
		</div>
	</div>
</div>
