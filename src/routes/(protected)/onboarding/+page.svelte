<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { t } from '$lib/i18n/index.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let step = $state(1);
	let selectedLanguage = $state(data.activeLanguage ?? '');

	$effect(() => {
		if (form?.languageSuccess && step === 1) {
			step = 2;
		}
		if (form?.apiKeySuccess && step === 2) {
			step = 3;
		}
	});

	const steps = [
		{ num: 1, key: 'onboarding.steps.language' },
		{ num: 2, key: 'onboarding.steps.apiKey' },
		{ num: 3, key: 'onboarding.steps.done' }
	];

	function handleEnhance() {
		return async ({ update }: { update: () => Promise<void> }) => {
			await update();
			await invalidateAll();
		};
	}
</script>

<svelte:head>
	<title>Get Started - OpenLingo</title>
</svelte:head>

<div class="mx-auto w-full max-w-2xl py-8">
	<div class="mb-8 text-center">
		<h1 class="mb-2 text-3xl font-bold text-text-light">{t('onboarding.title')}</h1>
		<p class="text-lg text-text-muted">{t('onboarding.subtitle')}</p>
	</div>

	<div class="mb-12 flex items-center justify-center gap-4">
		{#each steps as s, i}
			<div class="flex flex-col items-center gap-2">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold transition-all
						{step >= s.num ? 'bg-success text-white' : 'bg-bg-light-secondary text-text-muted'}"
				>
					{s.num}
				</div>
				<span
					class="text-xs font-bold tracking-wider uppercase
						{step >= s.num ? 'text-success' : 'text-text-muted'}"
				>
					{t(s.key)}
				</span>
			</div>
			{#if i < steps.length - 1}
				<div class="h-1 w-12 overflow-hidden rounded-full bg-border-light">
					<div
						class="h-full bg-success transition-all duration-500"
						style="width: {step > s.num ? '100%' : '0%'}"
					></div>
				</div>
			{/if}
		{/each}
	</div>

	{#if step === 1}
		<div class="animate-bounce-in">
			<div class="mb-8 text-center">
				<h2 class="mb-2 text-2xl font-bold text-text-light">
					{t('onboarding.language.title')}
				</h2>
				<p class="text-text-muted">{t('onboarding.language.subtitle')}</p>
			</div>

			<form method="POST" action="?/setLanguage" use:enhance={handleEnhance} class="space-y-8">
				<input type="hidden" name="languageCode" value={selectedLanguage} />

				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each data.availableLanguages as lang}
						{@const isSelected = selectedLanguage === lang.code}
						<button
							type="button"
							class="relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 p-5 transition-all
								{isSelected
								? 'border-success bg-success/10 shadow-md ring-2 ring-success/30'
								: 'border-border-light hover:border-primary/50 hover:bg-bg-light-secondary'}"
							onclick={() => (selectedLanguage = lang.code)}
						>
							{#if isSelected}
								<div
									class="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-success text-white"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"
										/>
									</svg>
								</div>
							{/if}
							<span class="text-4xl">{lang.flagEmoji}</span>
							<div class="text-center">
								<div class="text-lg font-bold {isSelected ? 'text-success' : 'text-text-light'}">
									{lang.name}
								</div>
								{#if lang.nativeName && lang.nativeName !== lang.name}
									<div class="text-sm text-text-muted">{lang.nativeName}</div>
								{/if}
							</div>
						</button>
					{/each}
				</div>

				{#if form?.languageError}
					<div class="rounded-xl bg-error/10 p-3 text-error">{form.languageError}</div>
				{/if}

				{#if !selectedLanguage}
					<p class="text-center text-sm text-text-muted">
						{t('onboarding.language.select')}
					</p>
				{/if}

				<div class="flex justify-end">
					<button
						type="submit"
						class="btn btn-success btn-lg w-full sm:w-auto"
						disabled={!selectedLanguage}
					>
						{t('common.next')}
					</button>
				</div>
			</form>
		</div>
	{/if}

	{#if step === 2}
		<div class="animate-bounce-in">
			<div class="mb-8 text-center">
				<h2 class="mb-2 text-2xl font-bold text-text-light">
					{t('onboarding.apiKey.title')}
				</h2>
				<p class="text-text-muted">{t('onboarding.apiKey.subtitle')}</p>
			</div>

			<form method="POST" action="?/setApiKey" use:enhance={handleEnhance} class="space-y-6 card">
				<div>
					<label for="apiKey" class="mb-1 block text-sm font-medium text-text-light">
						{t('onboarding.steps.apiKey')}
					</label>
					<input
						type="text"
						id="apiKey"
						name="apiKey"
						placeholder={t('onboarding.apiKey.placeholder')}
						class="input"
					/>
					<p class="mt-2 text-xs text-text-muted">{t('onboarding.apiKey.hint')}</p>
				</div>

				<div class="text-center">
					<a
						href="https://platform.openai.com/api-keys"
						target="_blank"
						rel="noopener noreferrer"
						class="text-sm font-medium text-primary hover:underline"
					>
						{t('onboarding.apiKey.getKey')}
					</a>
				</div>

				{#if form?.apiKeyError}
					<div class="rounded-xl bg-error/10 p-3 text-error">{form.apiKeyError}</div>
				{/if}

				<div class="flex flex-col gap-3 pt-2 sm:flex-row">
					<button type="button" class="btn btn-ghost btn-md flex-1" onclick={() => (step = 1)}>
						{t('common.back')}
					</button>
					<button type="button" class="btn btn-ghost btn-md flex-1" onclick={() => (step = 3)}>
						{t('onboarding.apiKey.skip')}
					</button>
					<button type="submit" class="btn btn-primary btn-md flex-1">
						{t('onboarding.apiKey.save')}
					</button>
				</div>
			</form>
		</div>
	{/if}

	{#if step === 3}
		<div class="animate-bounce-in text-center">
			<div class="mb-8 flex justify-center">
				<div class="flex h-32 w-32 items-center justify-center rounded-full bg-success/10">
					<span class="text-6xl">&#x1F389;</span>
				</div>
			</div>

			<h2 class="mb-4 text-3xl font-bold text-success">{t('onboarding.done.title')}</h2>
			<p class="mx-auto mb-12 max-w-md text-xl text-text-muted">
				{t('onboarding.done.subtitle')}
			</p>

			<p class="mx-auto mb-6 max-w-md text-sm text-text-muted">
				{t('onboarding.done.choosePath', {
					defaultValue: 'Choose your starting point to personalize your learning journey.'
				})}
			</p>

			<div class="mx-auto flex w-full max-w-sm flex-col gap-3">
				<a href="/placement" class="btn btn-primary btn-lg w-full">
					{t('placement.start', { defaultValue: 'Take Placement Test' })}
				</a>
				<form method="POST" action="?/complete" use:enhance={handleEnhance}>
					<button type="submit" class="btn btn-success btn-lg w-full">
						{t('placement.skip', { defaultValue: 'Start from Scratch' })}
					</button>
				</form>
			</div>
		</div>
	{/if}
</div>
