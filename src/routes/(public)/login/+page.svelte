<script lang="ts">
	import { enhance } from '$app/forms';
	import { t } from '$lib/i18n/index.svelte';
	import type { ActionData, PageData } from './$types';

	let { form, data }: { form: ActionData; data: PageData } = $props();

	let loading = $state(false);
</script>

<svelte:head>
	<title>{t('nav.login')} - OpenLingo</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
	<div class="w-full max-w-md animate-fade-in-up">
		<div class="text-center">
			<h1 class="text-3xl font-bold text-text-light">{t('auth.loginTitle')}</h1>
			<p class="mt-2 text-text-muted">{t('auth.loginSubtitle')}</p>
		</div>

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
			{#if data.redirect}
				<input type="hidden" name="redirect" value={data.redirect} />
			{/if}

			{#if form?.error}
				<div class="animate-shake rounded-xl bg-error/10 p-4 text-center text-error">
					{t(form.error)}
				</div>
			{/if}

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
					placeholder={t('auth.passwordPlaceholder')}
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
					{t('auth.loggingIn')}
				{:else}
					{t('auth.loginButton')}
				{/if}
			</button>
		</form>

		<p class="mt-6 text-center text-text-muted">
			{t('auth.noAccount')}
			<a href="/register" class="font-medium text-primary hover:underline">{t('auth.signUp')}</a>
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
