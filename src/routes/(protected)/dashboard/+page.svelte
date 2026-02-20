<script lang="ts">
	import type { PageData } from './$types';
	import { t } from '$lib/i18n/index.svelte';

	type ActiveLanguage = {
		code: string;
		name: string;
		nativeName: string;
		flagEmoji: string;
		whisperCode: string;
		tutorName: string;
		tutorGreeting: string | null;
	};

	let { data }: { data: PageData & { activeLanguage?: ActiveLanguage } } = $props();

	const activeLanguageName = $derived(
		data.activeLanguage?.name || t('lesson.languages.targetLanguage')
	);
	const greeting = $derived(
		data.activeLanguage?.tutorGreeting ||
			t('dashboard.greeting', { name: data.user?.displayName ?? '' })
	);
	const learningSubtitle = $derived(`Start learning ${activeLanguageName} with the basics`);

	// Calculate progress to next freeze (every 50 correct answers)
	const answersToNextFreeze = 50 - (data.stats.totalCorrectAnswers % 50);
	const freezeProgress = ((50 - answersToNextFreeze) / 50) * 100;
</script>

<svelte:head>
	<title>{t('nav.dashboard')} - OpenLingo</title>
</svelte:head>

<div class="space-y-8">
	<!-- Welcome Section -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-text-light">
				{greeting}
			</h1>
			<p class="text-text-muted">{t('dashboard.continueSubtitle')}</p>
		</div>
	</div>

	<!-- Stats Overview -->
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
		<div class="card">
			<div class="flex items-center gap-4">
				<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow/10">
					<span class="text-2xl">⭐</span>
				</div>
				<div>
					<p class="text-sm text-text-muted">{t('dashboard.stats.xp')}</p>
					<p class="text-2xl font-bold text-text-light">{data.stats.xpTotal}</p>
				</div>
			</div>
		</div>

		<div class="card">
			<div class="flex items-center gap-4">
				<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-orange/10">
					<span class="text-2xl">🔥</span>
				</div>
				<div>
					<p class="text-sm text-text-muted">{t('dashboard.stats.streak')}</p>
					<p class="text-2xl font-bold text-text-light">{data.stats.currentStreak}</p>
				</div>
			</div>
		</div>

		<div class="card">
			<div class="flex items-center gap-4">
				<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-error/10">
					<span class="text-2xl">❤️</span>
				</div>
				<div>
					<p class="text-sm text-text-muted">{t('dashboard.stats.hearts')}</p>
					<p class="text-2xl font-bold text-text-light">{data.stats.hearts}/10</p>
				</div>
			</div>
		</div>

		<!-- Streak Freezes - Enhanced Display -->
		<div class="card {data.stats.streakFreezes > 0 ? 'border-primary/30 bg-primary/5' : ''}">
			<div class="flex items-center gap-4">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 {data.stats
						.streakFreezes > 0
						? 'animate-freeze-earned'
						: ''}"
				>
					<span class="text-2xl">❄️</span>
				</div>
				<div class="flex-1">
					<p class="text-sm text-text-muted">{t('gamification.streakFreezes')}</p>
					<p class="text-2xl font-bold text-primary">{data.stats.streakFreezes}</p>
				</div>
			</div>
			<!-- Progress to next freeze -->
			<div class="mt-3">
				<div class="mb-1 flex justify-between text-xs text-text-muted">
					<span>{t('dashboard.nextFreeze')}</span>
					<span>{50 - answersToNextFreeze}/50</span>
				</div>
				<div class="h-1.5 overflow-hidden rounded-full bg-border-light">
					<div
						class="h-full rounded-full bg-primary transition-all"
						style="width: {freezeProgress}%"
					></div>
				</div>
			</div>
		</div>

		<div class="card">
			<div class="flex items-center gap-4">
				<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-purple/10">
					<span class="text-2xl">🏆</span>
				</div>
				<div>
					<p class="text-sm text-text-muted">{t('dashboard.stats.bestStreak')}</p>
					<p class="text-2xl font-bold text-text-light">{data.stats.longestStreak}</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Continue Learning Section -->
	<div>
		<h2 class="mb-4 text-xl font-bold text-text-light">Continue Learning</h2>
		<div class="card">
			<div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
				<div class="flex items-center gap-4">
					<div
						class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-success to-success-dark text-2xl font-bold text-white"
					>
						A1
					</div>
					<div>
						<h3 class="font-bold text-text-light">Beginner {activeLanguageName}</h3>
						<p class="text-text-muted">{learningSubtitle}</p>
					</div>
				</div>
				<a href="/lessons" class="btn btn-success btn-md w-full sm:w-auto"> Start Learning </a>
			</div>
		</div>
	</div>

	<!-- Quick Actions -->
	<div>
		<h2 class="mb-4 text-xl font-bold text-text-light">Quick Actions</h2>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<a href="/lessons" class="card transition-shadow hover:shadow-lg">
				<div class="flex items-center gap-4">
					<span class="text-3xl">📚</span>
					<div>
						<h3 class="font-bold text-text-light">Browse Lessons</h3>
						<p class="text-sm text-text-muted">Explore all available lessons</p>
					</div>
				</div>
			</a>

			<a href="/leaderboard" class="card transition-shadow hover:shadow-lg">
				<div class="flex items-center gap-4">
					<span class="text-3xl">🏆</span>
					<div>
						<h3 class="font-bold text-text-light">Leaderboard</h3>
						<p class="text-sm text-text-muted">See how you rank</p>
					</div>
				</div>
			</a>

			<a href="/settings/api-key" class="card transition-shadow hover:shadow-lg">
				<div class="flex items-center gap-4">
					<span class="text-3xl">🤖</span>
					<div>
						<h3 class="font-bold text-text-light">AI Settings</h3>
						<p class="text-sm text-text-muted">Configure your OpenAI key</p>
					</div>
				</div>
			</a>
		</div>
	</div>
</div>
