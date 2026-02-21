<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale, setLocale } from '$lib/paraglide/runtime.js';
	import { setSoundEnabled } from '$lib/stores/sounds.svelte';
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	const availableLocales = [
		{ code: 'en' as const, name: 'English' },
		{ code: 'de' as const, name: 'Deutsch' }
	];
	type Locale = 'en' | 'de';

	type LearningLanguage = {
		code: string;
		name: string;
		nativeName: string;
		flagEmoji: string;
	};

	type ExtendedPageData = PageData & {
		availableLanguages?: LearningLanguage[];
		currentActiveLanguage?: string;
		gamificationSettings?: {
			dailyXpGoal: number;
			soundEnabled: boolean;
		};
	};

	let { data, form }: { data: ExtendedPageData; form: ActionData } = $props();

	let displayName = $state(data.profile.displayName);
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let isUpdatingProfile = $state(false);
	let isChangingPassword = $state(false);
	let selectedDailyGoal = $state(data.gamificationSettings?.dailyXpGoal ?? 20);
	let soundEnabled = $state(data.gamificationSettings?.soundEnabled ?? true);
	let soundForm = $state<HTMLFormElement | null>(null);
	const dailyGoalOptions = [10, 20, 30, 50] as const;

	async function changeLocale(locale: Locale) {
		setLocale(locale);

		// Persist locale to database
		const formData = new FormData();
		formData.append('locale', locale);
		try {
			await fetch('?/updateLocale', {
				method: 'POST',
				body: formData
			});
		} catch (error) {
			console.error('Failed to save locale preference:', error);
		}
	}

	async function setActiveLanguage(code: string) {
		const formData = new FormData();
		formData.append('languageCode', code);
		try {
			await fetch('?/updateActiveLanguage', {
				method: 'POST',
				body: formData
			});
			await invalidateAll();
		} catch (error) {
			console.error('Failed to save active language:', error);
		}
	}

	function resetPasswordForm() {
		currentPassword = '';
		newPassword = '';
		confirmPassword = '';
	}

	function handleSoundToggleChange(event: Event) {
		const target = event.currentTarget as HTMLInputElement;
		soundEnabled = target.checked;
		setSoundEnabled(soundEnabled);
		soundForm?.requestSubmit();
	}
</script>

<svelte:head>
	<title>{m['settings.title']()} - OpenLingo</title>
</svelte:head>

<div class="space-y-8">
	<h1 class="text-3xl font-bold text-text-light">{m['settings.title']()}</h1>

	<!-- Profile Settings -->
	<div class="card">
		<h2 class="text-xl font-bold text-text-light">{m['profile.editProfile']()}</h2>
		<p class="mt-1 text-text-muted">
			{m['settings.profileDescription']() || 'Update your display name and profile information.'}
		</p>

		{#if form?.profileSuccess}
			<div class="mt-4 rounded-xl bg-success/10 p-3 text-success">
				{m['settings.profileUpdated']() || 'Profile updated successfully!'}
			</div>
		{/if}

		{#if form?.profileError}
			<div class="mt-4 rounded-xl bg-error/10 p-3 text-error">
				{(m[form.profileError as keyof typeof m] as unknown as () => string)?.() ??
					form.profileError}
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
					{m['auth.email']()}
				</label>
				<input
					type="email"
					id="email"
					value={data.profile.email}
					disabled
					class="input mt-1 cursor-not-allowed bg-bg-light-secondary text-text-muted"
				/>
				<p class="mt-1 text-xs text-text-muted">
					{m['settings.emailCannotChange']() || 'Email cannot be changed.'}
				</p>
			</div>

			<div>
				<label for="displayName" class="block text-sm font-medium text-text-light">
					{m['auth.displayName']()}
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
					{m['common.loading']()}
				{:else}
					{m['common.save']()}
				{/if}
			</button>
		</form>
	</div>

	<!-- Password Change -->
	<div class="card">
		<h2 class="text-xl font-bold text-text-light">
			{m['settings.changePassword']() || 'Change Password'}
		</h2>
		<p class="mt-1 text-text-muted">
			{m['settings.passwordDescription']() || 'Update your account password.'}
		</p>

		{#if form?.passwordSuccess}
			<div class="mt-4 rounded-xl bg-success/10 p-3 text-success">
				{m['settings.passwordChanged']() || 'Password changed successfully!'}
			</div>
		{/if}

		{#if form?.passwordError}
			<div class="mt-4 rounded-xl bg-error/10 p-3 text-error">
				{(m[form.passwordError as keyof typeof m] as unknown as () => string)?.() ??
					form.passwordError}
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
					{m['settings.currentPassword']() || 'Current Password'}
				</label>
				<input
					type="password"
					id="currentPassword"
					name="currentPassword"
					bind:value={currentPassword}
					required
					maxlength="50"
					pattern="[a-zA-Z0-9!@#$%^&*\(\)\-_.\/]+"
					title="Only ASCII characters allowed: letters, numbers, and !@#$%^&*()-_./"
					class="input mt-1"
				/>
			</div>

			<div>
				<label for="newPassword" class="block text-sm font-medium text-text-light">
					{m['settings.newPassword']() || 'New Password'}
				</label>
				<input
					type="password"
					id="newPassword"
					name="newPassword"
					bind:value={newPassword}
					required
					minlength="8"
					maxlength="50"
					pattern="[a-zA-Z0-9!@#$%^&*\(\)\-_.\/]+"
					title="Only ASCII characters allowed: letters, numbers, and !@#$%^&*()-_./"
					class="input mt-1"
				/>
				<p class="mt-1 text-xs text-text-muted">
					{m['auth.passwordHint']() || 'Minimum 8 characters'}
				</p>
			</div>

			<div>
				<label for="confirmPassword" class="block text-sm font-medium text-text-light">
					{m['settings.confirmPassword']() || 'Confirm New Password'}
				</label>
				<input
					type="password"
					id="confirmPassword"
					name="confirmPassword"
					bind:value={confirmPassword}
					required
					minlength="8"
					maxlength="50"
					pattern="[a-zA-Z0-9!@#$%^&*\(\)\-_.\/]+"
					title="Only ASCII characters allowed: letters, numbers, and !@#$%^&*()-_./"
					class="input mt-1"
				/>
			</div>

			<button
				type="submit"
				disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
				class="btn btn-primary btn-md"
			>
				{#if isChangingPassword}
					{m['common.loading']()}
				{:else}
					{m['settings.changePassword']() || 'Change Password'}
				{/if}
			</button>
		</form>
	</div>

	<div class="card">
		<h2 class="text-xl font-bold text-text-light">{m['settings.dailyGoal.title']()}</h2>
		<p class="mt-1 text-text-muted">{m['settings.dailyGoal.description']()}</p>
		<div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
			{#each dailyGoalOptions as goal}
				<form
					method="POST"
					action="?/updateDailyGoal"
					use:enhance={({ formData }) => {
						const nextGoal = Number.parseInt(formData.get('dailyXpGoal')?.toString() ?? '', 10);
						return async ({ update, result }) => {
							if (
								result.type === 'success' &&
								dailyGoalOptions.includes(nextGoal as (typeof dailyGoalOptions)[number])
							) {
								selectedDailyGoal = nextGoal;
							}
							await update();
						};
					}}
				>
					<input type="hidden" name="dailyXpGoal" value={goal} />
					<button
						type="submit"
						class="w-full cursor-pointer rounded-xl border-2 px-4 py-3 text-left font-medium transition-colors
							{selectedDailyGoal === goal
							? 'border-primary bg-primary/10 text-primary'
							: 'border-border-light text-text-light hover:border-primary/50'}"
					>
						{m['settings.dailyGoal.xpPerDay']({ amount: String(goal) })}
					</button>
				</form>
			{/each}
		</div>
	</div>

	<div class="card">
		<h2 class="text-xl font-bold text-text-light">{m['settings.sound.title']()}</h2>
		<p class="mt-1 text-text-muted">{m['settings.sound.description']()}</p>
		<form
			method="POST"
			action="?/updateSound"
			bind:this={soundForm}
			use:enhance={({ formData }) => {
				const nextEnabled = formData.get('soundEnabled') === 'on';
				return async ({ update, result }) => {
					if (result.type !== 'success') {
						soundEnabled = !nextEnabled;
						setSoundEnabled(soundEnabled);
					}
					await update();
				};
			}}
			class="mt-4"
		>
			<label
				class="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border-light p-4"
			>
				<span class="text-sm font-medium text-text-light">
					{soundEnabled ? m['settings.sound.enabled']() : m['settings.sound.disabled']()}
				</span>
				<span class="relative inline-flex h-7 w-12 items-center">
					<input
						type="checkbox"
						name="soundEnabled"
						checked={soundEnabled}
						onchange={handleSoundToggleChange}
						class="peer sr-only"
					/>
					<span
						class="absolute inset-0 rounded-full bg-border-light transition-colors peer-checked:bg-primary"
					></span>
					<span
						class="absolute left-1 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5"
					></span>
				</span>
			</label>
		</form>
	</div>

	<!-- Language Settings -->
	<div class="card">
		<h2 class="text-xl font-bold text-text-light">Learning Language</h2>
		<p class="mt-1 text-text-muted">Choose the language you want to learn.</p>
		<div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.availableLanguages || [] as language}
				<button
					onclick={() => setActiveLanguage(language.code)}
					class="flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 text-left font-medium transition-colors
						{data.currentActiveLanguage === language.code
						? 'border-primary bg-primary/10 text-primary'
						: 'border-border-light text-text-light hover:border-primary/50'}"
				>
					<span class="text-2xl">{language.flagEmoji}</span>
					<div>
						<div>{language.name}</div>
						{#if language.nativeName && language.nativeName !== language.name}
							<div class="text-xs text-text-muted">{language.nativeName}</div>
						{/if}
					</div>
				</button>
			{/each}
		</div>
	</div>

	<div class="card">
		<h2 class="text-xl font-bold text-text-light">{m['settings.language']()}</h2>
		<p class="mt-1 text-text-muted">{m['settings.languageDescription']()}</p>
		<div class="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-4">
			{#each availableLocales as locale}
				<button
					onclick={() => changeLocale(locale.code)}
					class="flex cursor-pointer items-center gap-2 rounded-xl border-2 px-4 py-3 font-medium transition-colors
						{getLocale() === locale.code
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
		<h2 class="text-xl font-bold text-text-light">{m['settings.apiKey.title']()}</h2>
		<p class="mt-1 text-text-muted">{m['settings.apiKey.description']()}</p>
		<div class="mt-4">
			<a href="/settings/api-key" class="btn btn-primary btn-md">
				{m['settings.apiKey.configure']() || 'Configure API Key'}
			</a>
		</div>
	</div>
</div>
