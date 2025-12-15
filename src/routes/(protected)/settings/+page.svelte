<script lang="ts">
	import { t, i18n } from '$lib/i18n/index.svelte';
	import type { Locale } from '$lib/i18n/index.svelte';

	function setLocale(locale: Locale) {
		i18n.setLocale(locale);
	}
</script>

<svelte:head>
	<title>{t('settings.title')} - OpenLingo</title>
</svelte:head>

<div class="space-y-8">
	<h1 class="text-3xl font-bold text-text-light">{t('settings.title')}</h1>

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
				{t('settings.apiKey.title')}
			</a>
		</div>
	</div>

	<!-- Profile Settings -->
	<div class="card">
		<h2 class="text-xl font-bold text-text-light">{t('profile.editProfile')}</h2>
		<p class="mt-1 text-text-muted">Update your display name and profile information.</p>
		<div class="mt-4">
			<a href="/profile" class="btn btn-ghost btn-md">
				{t('nav.profile')}
			</a>
		</div>
	</div>
</div>
