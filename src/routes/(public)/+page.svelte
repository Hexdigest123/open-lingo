<script lang="ts">
	import { page } from '$app/stores';
	import { t } from '$lib/i18n/index.svelte';
	import type { PageData } from './$types';
	import { Gamepad2, Mic, Bot } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	const accountDeleted = $derived($page.url.searchParams.get('deleted') === 'true');
</script>

<svelte:head>
	<title>OpenLingo - Learn Languages for Free</title>
	<meta
		name="description"
		content="Learn languages with AI-powered lessons, voice practice, and gamification. Practice Spanish, Japanese, and Italian for free."
	/>
</svelte:head>

<div class="py-16 lg:py-24">
	{#if accountDeleted}
		<div class="mx-auto mb-8 max-w-7xl px-4">
			<div class="rounded-xl bg-success/10 p-4 text-center text-success">
				{t('landing.accountDeleted')}
			</div>
		</div>
	{/if}

	<div class="mx-auto max-w-7xl px-4">
		<!-- Hero Section -->
		<div class="flex flex-col items-center text-center lg:flex-row lg:gap-16 lg:text-left">
			<div class="flex-1">
				<h1 class="text-4xl font-bold text-text-light lg:text-6xl">
					{t('landing.title')}
					<span class="text-success">{t('landing.titleHighlight')}</span>
				</h1>
				<p class="mt-6 text-xl text-text-muted">
					{t('landing.subtitle')}
				</p>
				<div class="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
					<a href="/register" class="btn btn-success btn-lg w-full sm:w-auto">
						{t('landing.getStarted')}
					</a>
					<a href="/login" class="btn btn-ghost btn-lg w-full sm:w-auto">
						{t('landing.haveAccount')}
					</a>
				</div>
			</div>
			<div class="mt-12 flex-1 lg:mt-0">
				<!-- Hero illustration -->
				<div
					class="mx-auto flex h-72 w-full max-w-xs items-center justify-center rounded-3xl bg-gradient-to-br from-success/20 to-primary/20 p-4 sm:h-80 sm:max-w-sm sm:p-6 md:h-96 md:max-w-md"
				>
					<div
						class="animate-float h-52 w-52 rotate-3 rounded-2xl bg-white p-3 shadow-2xl sm:h-64 sm:w-64 sm:p-5 md:h-72 md:w-72 md:p-6"
					>
						<div class="mb-2 flex items-center gap-2 sm:mb-3 sm:gap-3">
							<div
								class="flex h-7 w-7 items-center justify-center rounded-full bg-success text-xs font-bold text-white sm:h-9 sm:w-9 sm:text-sm md:h-10 md:w-10 md:text-base"
							>
								A1
							</div>
							<div class="flex-1">
								<div class="h-1.5 overflow-hidden rounded-full bg-gray-200 sm:h-2">
									<div class="h-full w-3/4 rounded-full bg-success"></div>
								</div>
							</div>
						</div>
						<div class="mt-2 space-y-1 sm:mt-4 sm:space-y-2 md:mt-5 md:space-y-3">
							<div
								class="rounded-lg border-2 border-success bg-success/10 p-1.5 text-xs sm:p-2 sm:text-sm md:p-3 md:text-base"
							>
								<span class="font-medium text-text-light">Hola</span>
								<span class="ml-1 text-text-muted sm:ml-2">Hello</span>
							</div>
							<div
								class="rounded-lg bg-gray-100 p-1.5 text-xs sm:p-2 sm:text-sm md:p-3 md:text-base"
							>
								<span class="font-medium text-text-light">Buenos d&iacute;as</span>
								<span class="ml-1 text-text-muted sm:ml-2">Good morning</span>
							</div>
							<div
								class="rounded-lg bg-gray-100 p-1.5 text-xs sm:p-2 sm:text-sm md:p-3 md:text-base"
							>
								<span class="font-medium text-text-light">Gracias</span>
								<span class="ml-1 text-text-muted sm:ml-2">Thank you</span>
							</div>
						</div>
						<div
							class="mt-2 flex items-center justify-between text-xs sm:mt-3 sm:text-sm md:mt-4 md:text-base"
						>
							<div class="flex items-center gap-1 text-error">
								<span>&#10084;</span>
								<span class="font-bold">5</span>
							</div>
							<div class="flex items-center gap-1 text-yellow">
								<span>&#9733;</span>
								<span class="font-bold">150 XP</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Stats Section -->
		{#if data.stats.totalUsers > 0 || data.stats.totalLessons > 0}
			<div class="mt-16 flex justify-center gap-8 sm:gap-16">
				<div class="text-center">
					<div class="text-4xl font-bold text-success">
						{data.stats.totalUsers.toLocaleString()}+
					</div>
					<div class="text-text-muted">{t('landing.stats.users')}</div>
				</div>
				<div class="text-center">
					<div class="text-4xl font-bold text-primary">
						{data.stats.totalLessons.toLocaleString()}+
					</div>
					<div class="text-text-muted">{t('landing.stats.lessons')}</div>
				</div>
			</div>
		{/if}

		<!-- Features Section -->
		<div class="mt-24">
			<h2 class="text-center text-3xl font-bold text-text-light">{t('landing.whyTitle')}</h2>
			<div class="mt-12 grid gap-8 md:grid-cols-3">
				<!-- Feature 1: Gamified Learning -->
				<div class="card group text-center transition-shadow duration-300 hover:shadow-xl">
					<div
						class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 transition-colors group-hover:bg-success/20"
					>
						<Gamepad2 size={28} class="text-success" />
					</div>
					<h3 class="text-xl font-bold text-text-light">{t('landing.features.gamified.title')}</h3>
					<p class="mt-2 text-text-muted">
						{t('landing.features.gamified.description')}
					</p>
				</div>

				<!-- Feature 2: Voice Practice -->
				<div class="card group text-center transition-shadow duration-300 hover:shadow-xl">
					<div
						class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20"
					>
						<Mic size={28} class="text-primary" />
					</div>
					<h3 class="text-xl font-bold text-text-light">{t('landing.features.voice.title')}</h3>
					<p class="mt-2 text-text-muted">
						{t('landing.features.voice.description')}
					</p>
				</div>

				<!-- Feature 3: AI Tutor -->
				<div class="card group text-center transition-shadow duration-300 hover:shadow-xl">
					<div
						class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple/10 transition-colors group-hover:bg-purple/20"
					>
						<Bot size={28} class="text-purple" />
					</div>
					<h3 class="text-xl font-bold text-text-light">{t('landing.features.ai.title')}</h3>
					<p class="mt-2 text-text-muted">
						{t('landing.features.ai.description')}
					</p>
				</div>
			</div>
		</div>

		<!-- How It Works Section -->
		<div class="mt-24">
			<h2 class="text-center text-3xl font-bold text-text-light">
				{t('landing.howItWorks.title')}
			</h2>
			<div class="mt-12 grid gap-8 md:grid-cols-4">
				<div class="text-center">
					<div
						class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success text-xl font-bold text-white"
					>
						1
					</div>
					<h3 class="font-bold text-text-light">{t('landing.howItWorks.step1.title')}</h3>
					<p class="mt-1 text-sm text-text-muted">{t('landing.howItWorks.step1.description')}</p>
				</div>
				<div class="text-center">
					<div
						class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success text-xl font-bold text-white"
					>
						2
					</div>
					<h3 class="font-bold text-text-light">{t('landing.howItWorks.step2.title')}</h3>
					<p class="mt-1 text-sm text-text-muted">{t('landing.howItWorks.step2.description')}</p>
				</div>
				<div class="text-center">
					<div
						class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success text-xl font-bold text-white"
					>
						3
					</div>
					<h3 class="font-bold text-text-light">{t('landing.howItWorks.step3.title')}</h3>
					<p class="mt-1 text-sm text-text-muted">{t('landing.howItWorks.step3.description')}</p>
				</div>
				<div class="text-center">
					<div
						class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success text-xl font-bold text-white"
					>
						4
					</div>
					<h3 class="font-bold text-text-light">{t('landing.howItWorks.step4.title')}</h3>
					<p class="mt-1 text-sm text-text-muted">{t('landing.howItWorks.step4.description')}</p>
				</div>
			</div>
		</div>

		<!-- Levels Section -->
		<div class="mt-24">
			<h2 class="text-center text-3xl font-bold text-text-light">{t('landing.levelsTitle')}</h2>
			<p class="mt-4 text-center text-text-muted">
				{t('landing.levelsSubtitle')}
			</p>
			<div class="mt-12 flex flex-wrap justify-center gap-4">
				{#each ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as level, i}
					{@const colors = [
						'from-success to-success-dark',
						'from-success to-primary',
						'from-primary to-primary',
						'from-primary to-purple',
						'from-purple to-purple',
						'from-purple to-error'
					]}
					<div
						class="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br {colors[
							i
						]} transform cursor-default text-xl font-bold text-white shadow-lg transition-transform hover:scale-110"
					>
						{level}
					</div>
				{/each}
			</div>
		</div>

		<!-- CTA Section -->
		<div
			class="mt-24 rounded-3xl bg-gradient-to-r from-success to-success-dark p-8 text-center text-white lg:p-12"
		>
			<h2 class="text-3xl font-bold">{t('landing.ctaTitle')}</h2>
			<p class="mt-4 text-lg opacity-90">
				{t('landing.ctaSubtitle')}
			</p>
			<a href="/register" class="btn btn-lg mt-8 bg-white text-success hover:bg-gray-100">
				{t('landing.ctaButton')}
			</a>
		</div>
	</div>
</div>

<style>
	@keyframes float {
		0%,
		100% {
			transform: translateY(0px) rotate(3deg);
		}
		50% {
			transform: translateY(-10px) rotate(3deg);
		}
	}

	.animate-float {
		animation: float 4s ease-in-out infinite;
	}
</style>
