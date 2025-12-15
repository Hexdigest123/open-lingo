<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Dashboard - OpenLingo</title>
</svelte:head>

<div class="space-y-8">
	<!-- Welcome Section -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-text-light">
				¡Hola, {data.user?.displayName}!
			</h1>
			<p class="text-text-muted">Ready to continue your Spanish journey?</p>
		</div>
	</div>

	<!-- Stats Overview -->
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<div class="card">
			<div class="flex items-center gap-4">
				<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow/10">
					<span class="text-2xl">⭐</span>
				</div>
				<div>
					<p class="text-sm text-text-muted">Total XP</p>
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
					<p class="text-sm text-text-muted">Day Streak</p>
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
					<p class="text-sm text-text-muted">Hearts</p>
					<p class="text-2xl font-bold text-text-light">{data.stats.hearts}/10</p>
				</div>
			</div>
		</div>

		<div class="card">
			<div class="flex items-center gap-4">
				<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-purple/10">
					<span class="text-2xl">🏆</span>
				</div>
				<div>
					<p class="text-sm text-text-muted">Best Streak</p>
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
					<div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-success to-success-dark text-white text-2xl font-bold">
						A1
					</div>
					<div>
						<h3 class="font-bold text-text-light">Beginner Spanish</h3>
						<p class="text-text-muted">Start with the basics</p>
					</div>
				</div>
				<a href="/lessons" class="btn btn-success btn-md w-full sm:w-auto">
					Start Learning
				</a>
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
