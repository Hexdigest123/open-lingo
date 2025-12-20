<script lang="ts">
	import { page } from '$app/stores';
	import { t } from '$lib/i18n/index.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const accountDeleted = $derived($page.url.searchParams.get('deleted') === 'true');
</script>

<svelte:head>
	<title>OpenLingo - Learn Spanish for Free</title>
	<meta name="description" content="Learn Spanish with AI-powered lessons, voice practice, and gamification. Free and fun!" />
</svelte:head>

<div class="py-16 lg:py-24">
	{#if accountDeleted}
		<div class="mx-auto max-w-7xl px-4 mb-8">
			<div class="rounded-xl bg-success/10 p-4 text-success text-center">
				{t('landing.accountDeleted')}
			</div>
		</div>
	{/if}

	<div class="mx-auto max-w-7xl px-4">
		<!-- Hero Section -->
		<div class="flex flex-col items-center text-center lg:flex-row lg:text-left lg:gap-16">
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
				<div class="mx-auto aspect-square max-w-xs sm:max-w-md rounded-3xl bg-gradient-to-br from-success/20 to-primary/20 p-4 sm:p-8 relative overflow-hidden">
					<div class="absolute inset-0 flex items-center justify-center">
						<div class="w-48 h-48 sm:w-72 sm:h-72 rounded-2xl bg-white shadow-2xl p-3 sm:p-6 transform rotate-3 animate-float">
							<div class="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
								<div class="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-success flex items-center justify-center text-white font-bold text-xs sm:text-base">A1</div>
								<div class="flex-1">
									<div class="h-2 bg-gray-200 rounded-full overflow-hidden">
										<div class="h-full w-3/4 bg-success rounded-full"></div>
									</div>
								</div>
							</div>
							<div class="space-y-1 sm:space-y-3 mt-2 sm:mt-6">
								<div class="p-1.5 sm:p-3 rounded-lg sm:rounded-xl bg-success/10 border-2 border-success text-xs sm:text-base">
									<span class="text-text-light font-medium">Hola</span>
									<span class="text-text-muted ml-1 sm:ml-2">Hello</span>
								</div>
								<div class="p-1.5 sm:p-3 rounded-lg sm:rounded-xl bg-gray-100 text-xs sm:text-base">
									<span class="text-text-light font-medium">Buenos d&iacute;as</span>
									<span class="text-text-muted ml-1 sm:ml-2">Good morning</span>
								</div>
								<div class="p-1.5 sm:p-3 rounded-lg sm:rounded-xl bg-gray-100 text-xs sm:text-base">
									<span class="text-text-light font-medium">Gracias</span>
									<span class="text-text-muted ml-1 sm:ml-2">Thank you</span>
								</div>
							</div>
							<div class="mt-2 sm:mt-4 flex items-center justify-between text-xs sm:text-base">
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
		</div>

		<!-- Stats Section -->
		{#if data.stats.totalUsers > 0 || data.stats.totalLessons > 0}
			<div class="mt-16 flex justify-center gap-8 sm:gap-16">
				<div class="text-center">
					<div class="text-4xl font-bold text-success">{data.stats.totalUsers.toLocaleString()}+</div>
					<div class="text-text-muted">{t('landing.stats.users')}</div>
				</div>
				<div class="text-center">
					<div class="text-4xl font-bold text-primary">{data.stats.totalLessons.toLocaleString()}+</div>
					<div class="text-text-muted">{t('landing.stats.lessons')}</div>
				</div>
			</div>
		{/if}

		<!-- Features Section -->
		<div class="mt-24">
			<h2 class="text-center text-3xl font-bold text-text-light">{t('landing.whyTitle')}</h2>
			<div class="mt-12 grid gap-8 md:grid-cols-3">
				<!-- Feature 1: Gamified Learning -->
				<div class="card text-center group hover:shadow-xl transition-shadow duration-300">
					<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 group-hover:bg-success/20 transition-colors">
						<span class="text-3xl">🎮</span>
					</div>
					<h3 class="text-xl font-bold text-text-light">{t('landing.features.gamified.title')}</h3>
					<p class="mt-2 text-text-muted">
						{t('landing.features.gamified.description')}
					</p>
				</div>

				<!-- Feature 2: Voice Practice -->
				<div class="card text-center group hover:shadow-xl transition-shadow duration-300">
					<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
						<span class="text-3xl">🎤</span>
					</div>
					<h3 class="text-xl font-bold text-text-light">{t('landing.features.voice.title')}</h3>
					<p class="mt-2 text-text-muted">
						{t('landing.features.voice.description')}
					</p>
				</div>

				<!-- Feature 3: AI Tutor -->
				<div class="card text-center group hover:shadow-xl transition-shadow duration-300">
					<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple/10 group-hover:bg-purple/20 transition-colors">
						<span class="text-3xl">🤖</span>
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
			<h2 class="text-center text-3xl font-bold text-text-light">{t('landing.howItWorks.title')}</h2>
			<div class="mt-12 grid gap-8 md:grid-cols-4">
				<div class="text-center">
					<div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success text-white font-bold text-xl">1</div>
					<h3 class="font-bold text-text-light">{t('landing.howItWorks.step1.title')}</h3>
					<p class="mt-1 text-sm text-text-muted">{t('landing.howItWorks.step1.description')}</p>
				</div>
				<div class="text-center">
					<div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success text-white font-bold text-xl">2</div>
					<h3 class="font-bold text-text-light">{t('landing.howItWorks.step2.title')}</h3>
					<p class="mt-1 text-sm text-text-muted">{t('landing.howItWorks.step2.description')}</p>
				</div>
				<div class="text-center">
					<div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success text-white font-bold text-xl">3</div>
					<h3 class="font-bold text-text-light">{t('landing.howItWorks.step3.title')}</h3>
					<p class="mt-1 text-sm text-text-muted">{t('landing.howItWorks.step3.description')}</p>
				</div>
				<div class="text-center">
					<div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success text-white font-bold text-xl">4</div>
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
					{@const colors = ['from-success to-success-dark', 'from-success to-primary', 'from-primary to-primary', 'from-primary to-purple', 'from-purple to-purple', 'from-purple to-error']}
					<div class="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br {colors[i]} text-white font-bold text-xl shadow-lg transform hover:scale-110 transition-transform cursor-default">
						{level}
					</div>
				{/each}
			</div>
		</div>

		<!-- CTA Section -->
		<div class="mt-24 rounded-3xl bg-gradient-to-r from-success to-success-dark p-8 text-center text-white lg:p-12">
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
		0%, 100% {
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
