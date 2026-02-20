<script lang="ts">
	import { t } from '$lib/i18n/index.svelte';
</script>

<svelte:head>
	<title>{t('auth.rejected.title')} - OpenLingo</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
	<div class="w-full max-w-md animate-fade-in-up text-center">
		<div class="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-error/10">
			<span class="text-5xl">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-12 w-12 text-error"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
					/>
				</svg>
			</span>
		</div>

		<h1 class="mt-6 text-3xl font-bold text-text-light">{t('auth.rejected.title')}</h1>

		<p class="mt-4 text-text-muted">
			{t('auth.rejected.message')}
		</p>

		<div class="mt-8 rounded-xl bg-border-light/50 p-6">
			<h2 class="font-semibold text-text-light">{t('auth.rejected.whatNow')}</h2>
			<ul class="mt-4 space-y-2 text-left text-sm text-text-muted">
				<li class="flex items-start gap-2">
					<span class="text-error">1.</span>
					<span>{t('auth.rejected.step1')}</span>
				</li>
				<li class="flex items-start gap-2">
					<span class="text-error">2.</span>
					<span>{t('auth.rejected.step2')}</span>
				</li>
			</ul>
		</div>

		<div class="mt-8 space-y-4">
			<a
				href="/"
				class="btn btn-primary btn-lg w-full transform transition-transform hover:scale-[1.02] active:scale-[0.98]"
				>{t('auth.rejected.backHome')}</a
			>
		</div>
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
