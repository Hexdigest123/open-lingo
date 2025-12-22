<script lang="ts">
	import { t } from '$lib/i18n/index.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const hasContent = data.companyName || data.address || data.email || data.phone;
</script>

<svelte:head>
	<title>{t('legal.imprint.title')} - OpenLingo</title>
</svelte:head>

<div class="py-12 lg:py-16">
	<div class="mx-auto max-w-3xl px-4">
		<h1 class="text-3xl font-bold text-text-light lg:text-4xl">{t('legal.imprint.title')}</h1>

		{#if hasContent}
			<div class="mt-8 space-y-6">
				{#if data.companyName}
					<section>
						<h2 class="text-lg font-semibold text-text-light">{t('legal.imprint.companyName')}</h2>
						<p class="mt-1 text-text-muted">{data.companyName}</p>
					</section>
				{/if}

				{#if data.representative}
					<section>
						<h2 class="text-lg font-semibold text-text-light">{t('legal.imprint.representative')}</h2>
						<p class="mt-1 text-text-muted">{data.representative}</p>
					</section>
				{/if}

				{#if data.address}
					<section>
						<h2 class="text-lg font-semibold text-text-light">{t('legal.imprint.address')}</h2>
						<p class="mt-1 text-text-muted whitespace-pre-line">{data.address}</p>
					</section>
				{/if}

				{#if data.email || data.phone}
					<section>
						<h2 class="text-lg font-semibold text-text-light">{t('legal.imprint.contact')}</h2>
						<div class="mt-1 space-y-1">
							{#if data.email}
								<p class="text-text-muted">
									{t('legal.imprint.email')}: <a href="mailto:{data.email}" class="text-primary hover:underline">{data.email}</a>
								</p>
							{/if}
							{#if data.phone}
								<p class="text-text-muted">
									{t('legal.imprint.phone')}: <a href="tel:{data.phone}" class="text-primary hover:underline">{data.phone}</a>
								</p>
							{/if}
						</div>
					</section>
				{/if}

				{#if data.vatId}
					<section>
						<h2 class="text-lg font-semibold text-text-light">{t('legal.imprint.vatId')}</h2>
						<p class="mt-1 text-text-muted">{data.vatId}</p>
					</section>
				{/if}
			</div>
		{:else}
			<div class="mt-8 rounded-xl bg-yellow/10 p-6 text-center">
				<p class="text-text-muted">{t('legal.imprint.notConfigured')}</p>
			</div>
		{/if}
	</div>
</div>
