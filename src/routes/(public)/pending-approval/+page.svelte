<script lang="ts">
	import { t } from '$lib/i18n/index.svelte';
</script>

<svelte:head>
	<title>{t('auth.pendingApproval.title')} - OpenLingo</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
	<div class="w-full max-w-md text-center">
		<div class="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
			<span class="text-5xl">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-12 w-12 text-primary"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
					/>
				</svg>
			</span>
		</div>

		<h1 class="mt-6 text-3xl font-bold text-text-light">{t('auth.pendingApproval.title')}</h1>

		<p class="mt-4 text-text-muted">
			{t('auth.pendingApproval.message')}
		</p>

		<div class="mt-8 rounded-xl bg-border-light/50 p-6">
			<h2 class="font-semibold text-text-light">{t('auth.pendingApproval.whatNext')}</h2>
			<ul class="mt-4 space-y-2 text-left text-sm text-text-muted">
				<li class="flex items-start gap-2">
					<span class="text-primary">1.</span>
					<span>{t('auth.pendingApproval.step1')}</span>
				</li>
				<li class="flex items-start gap-2">
					<span class="text-primary">2.</span>
					<span>{t('auth.pendingApproval.step2')}</span>
				</li>
				<li class="flex items-start gap-2">
					<span class="text-primary">3.</span>
					<span>{t('auth.pendingApproval.step3')}</span>
				</li>
			</ul>
		</div>

		<div class="mt-8 space-y-4">
			<a href="/login" class="btn btn-primary btn-lg w-full">{t('auth.pendingApproval.tryLogin')}</a>
			<a href="/" class="btn btn-secondary btn-md w-full">{t('auth.pendingApproval.backToHome')}</a>
		</div>
	</div>
</div>
