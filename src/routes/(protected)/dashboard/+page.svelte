<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import AnimatedCounter from '$lib/components/ui/AnimatedCounter.svelte';
	import {
		Flame,
		Trophy,
		TreePine,
		RefreshCw,
		BookOpen,
		Bot,
		Globe,
		Star,
		Heart,
		Snowflake,
		Check,
		Target,
		Gem,
		Zap
	} from 'lucide-svelte';

	type ActiveLanguage = {
		code: string;
		name: string;
		nativeName: string;
		flagEmoji: string;
		whisperCode: string;
		tutorName: string;
		tutorGreeting: string | null;
	};

	type AvailableLanguage = {
		code: string;
		name: string;
		nativeName: string;
		flagEmoji: string;
	};

	type WeeklyChallenge = {
		id: number;
		targetValue: number;
		xpReward: number;
		titleEn: string;
		titleDe: string;
		progress: number;
		completedAt: string | Date | null;
		xpAwarded: boolean;
	};

	let {
		data,
		form
	}: {
		data: PageData & {
			activeLanguage?: ActiveLanguage;
			availableLanguages?: AvailableLanguage[];
			dueReviewCount?: number;
			dailyXpProgress?: number;
			dailyXpGoal?: number;
			gems?: number;
			weeklyChallenges?: WeeklyChallenge[];
		};
		form: ActionData;
	} = $props();

	const activeLanguageName = $derived(
		data.activeLanguage?.name || m['lesson.languages.targetLanguage']()
	);
	const greeting = $derived(
		data.activeLanguage?.tutorGreeting ||
			m['dashboard.greeting']({ name: data.user?.displayName ?? '' })
	);
	const dueReviewCount = $derived(data.dueReviewCount ?? 0);
	const dailyXpProgress = $derived(data.dailyXpProgress ?? 0);
	const dailyXpGoal = $derived(Math.max(1, data.dailyXpGoal ?? 20));
	const gems = $derived(data.gems ?? 0);
	const isDailyGoalComplete = $derived(dailyXpProgress >= dailyXpGoal);
	const dailyGoalProgressPercent = $derived(Math.min((dailyXpProgress / dailyXpGoal) * 100, 100));
	const dailyRingRadius = 18;
	const dailyRingCircumference = 2 * Math.PI * dailyRingRadius;
	const dailyRingOffset = $derived(
		dailyRingCircumference - (dailyGoalProgressPercent / 100) * dailyRingCircumference
	);
	const weeklyChallenges = $derived(
		(data.weeklyChallenges ?? []).slice(0, 3).map((challenge) => ({
			...challenge,
			title: getLocale() === 'de' ? challenge.titleDe : challenge.titleEn,
			isCompleted: challenge.completedAt !== null
		}))
	);

	let showLanguagePicker = $state(false);

	function handleLanguageChange() {
		return async ({ update }: { update: () => Promise<void> }) => {
			await update();
			await invalidateAll();
			showLanguagePicker = false;
		};
	}

	const answersToNextFreeze = 50 - (data.stats.totalCorrectAnswers % 50);
	const freezeProgress = ((50 - answersToNextFreeze) / 50) * 100;
</script>

<svelte:head>
	<title>{m['nav.dashboard']()} - OpenLingo</title>
</svelte:head>

<div class="space-y-8">
	<!-- Welcome Section -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-text-light">
				{greeting}
			</h1>
			<p class="text-text-muted">{m['dashboard.continueSubtitle']()}</p>
		</div>
	</div>

	<!-- Learning Path Switcher -->
	{#if data.availableLanguages && data.availableLanguages.length > 1}
		<div class="card">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					{#if data.activeLanguage?.flagEmoji}
						<span class="text-2xl">{data.activeLanguage.flagEmoji}</span>
					{:else}
						<Globe size={24} />
					{/if}
					<div>
						<h2 class="font-bold text-text-light">{m['dashboard.learningPath']()}</h2>
						<p class="text-sm text-text-muted">{activeLanguageName}</p>
					</div>
				</div>
				<button
					onclick={() => (showLanguagePicker = !showLanguagePicker)}
					class="btn btn-ghost btn-sm"
				>
					{m['dashboard.changeLanguage']()}
				</button>
			</div>

			{#if showLanguagePicker}
				<div
					class="mt-4 grid gap-3 border-t border-border-light pt-4 sm:grid-cols-2 lg:grid-cols-3"
				>
					{#each data.availableLanguages as language}
						{@const isActive = data.activeLanguage?.code === language.code}
						<form method="POST" action="?/changeLanguage" use:enhance={handleLanguageChange}>
							<input type="hidden" name="languageCode" value={language.code} />
							<button
								type="submit"
								class="flex w-full cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all
									{isActive
									? 'border-success bg-success/10 text-success'
									: 'border-border-light hover:border-primary/50 hover:bg-bg-light-secondary'}"
							>
								{#if language.flagEmoji}
									<span class="text-2xl">{language.flagEmoji}</span>
								{:else}
									<Globe size={24} />
								{/if}
								<div class="flex-1">
									<div class="font-bold {isActive ? 'text-success' : 'text-text-light'}">
										{language.name}
									</div>
									{#if language.nativeName && language.nativeName !== language.name}
										<div class="text-xs text-text-muted">{language.nativeName}</div>
									{/if}
								</div>
								{#if isActive}
									<Check size={20} class="text-success" />
								{/if}
							</button>
						</form>
					{/each}
				</div>
			{/if}
		</div>
	{/if}

	<!-- Stats Overview -->
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
		<div class="card">
			<div class="flex items-center gap-4">
				<div
					class="relative flex h-14 w-14 items-center justify-center rounded-xl {isDailyGoalComplete
						? 'bg-success/10 text-success'
						: 'bg-yellow/10 text-yellow-dark'}"
				>
					<Target size={16} class={isDailyGoalComplete ? 'text-success' : 'text-yellow-dark'} />
					<svg
						width="48"
						height="48"
						viewBox="0 0 48 48"
						class="pointer-events-none absolute inset-0"
						style="--ring-circumference: {dailyRingCircumference}; --ring-offset: {dailyRingOffset};"
					>
						<circle
							cx="24"
							cy="24"
							r={dailyRingRadius}
							fill="none"
							stroke="currentColor"
							stroke-width="4"
							class={isDailyGoalComplete ? 'text-success/25' : 'text-yellow-dark/25'}
						/>
						<circle
							cx="24"
							cy="24"
							r={dailyRingRadius}
							fill="none"
							stroke="currentColor"
							stroke-width="4"
							stroke-linecap="round"
							class="animate-progress-ring {isDailyGoalComplete
								? 'text-success'
								: 'text-yellow-dark'}"
							style="stroke-dasharray: var(--ring-circumference); stroke-dashoffset: var(--ring-offset); transform: rotate(-90deg); transform-origin: 50% 50%;"
						/>
					</svg>
				</div>
				<div>
					<p class="text-sm text-text-muted">{m['dashboard.dailyGoal.title']()}</p>
					<p class="text-sm font-semibold text-text-light">
						{m['dashboard.dailyGoal.progress']({
							current: String(Math.round(dailyXpProgress)),
							goal: String(dailyXpGoal)
						})}
					</p>
					{#if isDailyGoalComplete}
						<p class="text-xs font-semibold text-success">{m['dashboard.dailyGoal.complete']()}</p>
					{/if}
				</div>
			</div>
		</div>

		<div class="card">
			<div class="flex items-center gap-4">
				<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow/10">
					<Star size={24} class="text-yellow-dark" />
				</div>
				<div>
					<p class="text-sm text-text-muted">{m['dashboard.stats.xp']()}</p>
					<p class="text-2xl font-bold text-text-light">{data.stats.xpTotal}</p>
				</div>
			</div>
		</div>

		<div class="card">
			<div class="flex items-center gap-4">
				<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-purple/10">
					<Gem size={24} class="text-purple" />
				</div>
				<div>
					<p class="text-sm text-text-muted">{m['dashboard.gems']()}</p>
					<AnimatedCounter value={gems} class="text-2xl font-bold text-purple" />
				</div>
			</div>
		</div>

		<div class="card">
			<div class="flex items-center gap-4">
				<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-orange/10">
					<Flame size={24} class="text-orange" />
				</div>
				<div>
					<p class="text-sm text-text-muted">{m['dashboard.stats.streak']()}</p>
					<p class="text-2xl font-bold text-text-light">{data.stats.currentStreak}</p>
				</div>
			</div>
		</div>

		<div class="card">
			<div class="flex items-center gap-4">
				<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-error/10">
					<Heart size={24} class="text-error" />
				</div>
				<div>
					<p class="text-sm text-text-muted">{m['dashboard.stats.hearts']()}</p>
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
					<Snowflake size={24} class="text-primary" />
				</div>
				<div class="flex-1">
					<p class="text-sm text-text-muted">{m['gamification.streakFreezes']()}</p>
					<p class="text-2xl font-bold text-primary">{data.stats.streakFreezes}</p>
				</div>
			</div>
			<!-- Progress to next freeze -->
			<div class="mt-3">
				<div class="mb-1 flex justify-between text-xs text-text-muted">
					<span>{m['dashboard.nextFreeze']()}</span>
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
					<Trophy size={24} class="text-purple" />
				</div>
				<div>
					<p class="text-sm text-text-muted">{m['dashboard.stats.bestStreak']()}</p>
					<p class="text-2xl font-bold text-text-light">{data.stats.longestStreak}</p>
				</div>
			</div>
		</div>
	</div>

	<div>
		<h2 class="mb-4 text-xl font-bold text-text-light">{m['dashboard.challenges.title']()}</h2>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each weeklyChallenges as challenge}
				{@const target = Math.max(1, challenge.targetValue)}
				{@const progress = Math.min(challenge.progress, target)}
				{@const progressPercent = Math.min((progress / target) * 100, 100)}
				<div
					class="card {challenge.isCompleted
						? 'border-success/30 bg-success/5'
						: 'border-border-light'}"
				>
					<div class="flex items-start justify-between gap-3">
						<h3 class="font-bold text-text-light">{challenge.title}</h3>
						{#if challenge.isCompleted}
							<div class="flex items-center gap-1 text-success">
								<Check size={16} />
								<span class="text-xs font-semibold">{m['dashboard.challenges.completed']()}</span>
							</div>
						{/if}
					</div>
					<div class="mt-3 space-y-2">
						<div class="h-2 overflow-hidden rounded-full bg-border-light">
							<div
								class="h-full rounded-full transition-all {challenge.isCompleted
									? 'bg-success'
									: 'bg-primary'}"
								style="width: {progressPercent}%"
							></div>
						</div>
						<div class="flex items-center justify-between text-sm">
							<span class="text-text-muted">
								{m['dashboard.challenges.progress']({
									current: String(progress),
									target: String(target)
								})}
							</span>
							<div class="flex items-center gap-1 font-semibold text-yellow-dark">
								<Zap size={14} />
								<span>{m['dashboard.challenges.reward']({ xp: String(challenge.xpReward) })}</span>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Continue Learning Section -->
	<div>
		<h2 class="mb-4 text-xl font-bold text-text-light">{m['dashboard.continueTitle']()}</h2>
		<div class="card">
			<div class="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-start">
				<div class="flex items-center gap-4">
					<div
						class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-success to-success-dark text-2xl font-bold text-white"
					>
						<TreePine size={32} />
					</div>
					<div>
						<div class="flex flex-wrap items-center gap-2">
							<h3 class="font-bold text-text-light">{m['skills.title']()}</h3>
							{#if dueReviewCount > 0}
								<span
									class="bg-warning/20 text-warning rounded-full px-2 py-0.5 text-xs font-semibold"
								>
									{m['review.dueCount']({ count: dueReviewCount })}
								</span>
							{/if}
						</div>
						<p class="text-text-muted">{m['dashboard.skillProgress']()}</p>
					</div>
				</div>
				<div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
					<a href="/skills" class="btn btn-success btn-md w-full sm:w-auto">
						{m['skills.title']()}
					</a>
					<a href="/lessons" class="btn btn-ghost btn-md w-full sm:w-auto">
						{m['lesson.startLearning']()}
					</a>
				</div>
			</div>
		</div>
	</div>

	<!-- Quick Actions -->
	<div>
		<h2 class="mb-4 text-xl font-bold text-text-light">{m['dashboard.quickActions']()}</h2>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<a href="/skills" class="card transition-shadow hover:shadow-lg">
				<div class="flex items-center gap-4">
					<TreePine size={32} class="shrink-0 text-success" />
					<div>
						<h3 class="font-bold text-text-light">{m['skills.title']()}</h3>
						<p class="text-sm text-text-muted">{m['dashboard.skillProgress']()}</p>
					</div>
				</div>
			</a>

			<a href="/review" class="card transition-shadow hover:shadow-lg">
				<div class="flex items-center gap-4">
					<RefreshCw size={32} class="shrink-0 text-primary" />
					<div>
						<div class="flex items-center gap-2">
							<h3 class="font-bold text-text-light">{m['review.title']()}</h3>
							{#if dueReviewCount > 0}
								<span
									class="bg-warning/20 text-warning rounded-full px-2 py-0.5 text-xs font-semibold"
								>
									{dueReviewCount}
								</span>
							{/if}
						</div>
						<p class="text-sm text-text-muted">
							{dueReviewCount > 0
								? m['review.dueCount']({ count: dueReviewCount })
								: m['review.noDue']()}
						</p>
					</div>
				</div>
			</a>

			<a href="/lessons" class="card transition-shadow hover:shadow-lg">
				<div class="flex items-center gap-4">
					<BookOpen size={32} class="shrink-0 text-primary" />
					<div>
						<h3 class="font-bold text-text-light">{m['lesson.spanishLessons']()}</h3>
						<p class="text-sm text-text-muted">{m['lesson.chooseLevelToStart']()}</p>
					</div>
				</div>
			</a>

			<a href="/leaderboard" class="card transition-shadow hover:shadow-lg">
				<div class="flex items-center gap-4">
					<Trophy size={32} class="shrink-0 text-yellow-dark" />
					<div>
						<h3 class="font-bold text-text-light">{m['dashboard.actions.leaderboard.title']()}</h3>
						<p class="text-sm text-text-muted">
							{m['dashboard.actions.leaderboard.description']()}
						</p>
					</div>
				</div>
			</a>

			<a href="/settings/api-key" class="card transition-shadow hover:shadow-lg">
				<div class="flex items-center gap-4">
					<Bot size={32} class="shrink-0 text-purple" />
					<div>
						<h3 class="font-bold text-text-light">{m['dashboard.actions.aiSettings.title']()}</h3>
						<p class="text-sm text-text-muted">{m['dashboard.actions.aiSettings.description']()}</p>
					</div>
				</div>
			</a>
		</div>
	</div>
</div>
