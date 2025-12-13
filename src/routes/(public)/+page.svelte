<script lang="ts">
	// Landing page
</script>

<svelte:head>
	<title>OpenLingo - Learn Spanish for Free</title>
	<meta name="description" content="Learn Spanish with AI-powered lessons, voice practice, and gamification. Free and fun!" />
</svelte:head>

<div class="py-16 lg:py-24">
	<div class="mx-auto max-w-7xl px-4">
		<!-- Hero Section -->
		<div class="flex flex-col items-center text-center lg:flex-row lg:text-left lg:gap-16">
			<div class="flex-1">
				<h1 class="text-4xl font-bold text-text-light lg:text-6xl">
					The free, fun, and effective way to learn
					<span class="text-success">Spanish</span>
				</h1>
				<p class="mt-6 text-xl text-text-muted">
					Learn with AI-powered lessons, practice speaking with voice mode, and stay motivated with gamification.
				</p>
				<div class="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
					<a href="/register" class="btn btn-success btn-lg w-full sm:w-auto">
						Get started for free
					</a>
					<a href="/login" class="btn btn-ghost btn-lg w-full sm:w-auto">
						I already have an account
					</a>
				</div>
			</div>
			<div class="mt-12 flex-1 lg:mt-0">
				<!-- Hero illustration placeholder -->
				<div class="mx-auto aspect-square max-w-md rounded-3xl bg-gradient-to-br from-success/20 to-primary/20 p-8">
					<div class="flex h-full flex-col items-center justify-center gap-4">
						<div class="text-8xl">🇪🇸</div>
						<div class="text-2xl font-bold text-text-light">¡Hola!</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Features Section -->
		<div class="mt-24">
			<h2 class="text-center text-3xl font-bold text-text-light">Why OpenLingo?</h2>
			<div class="mt-12 grid gap-8 md:grid-cols-3">
				<!-- Feature 1 -->
				<div class="card text-center">
					<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
						<span class="text-3xl">🎮</span>
					</div>
					<h3 class="text-xl font-bold text-text-light">Gamified Learning</h3>
					<p class="mt-2 text-text-muted">
						Earn XP, maintain streaks, and compete on leaderboards. Learning has never been this fun!
					</p>
				</div>

				<!-- Feature 2 -->
				<div class="card text-center">
					<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
						<span class="text-3xl">🎤</span>
					</div>
					<h3 class="text-xl font-bold text-text-light">Voice Practice</h3>
					<p class="mt-2 text-text-muted">
						Practice speaking with AI-powered voice mode and get instant feedback on your pronunciation.
					</p>
				</div>

				<!-- Feature 3 -->
				<div class="card text-center">
					<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple/10">
						<span class="text-3xl">🤖</span>
					</div>
					<h3 class="text-xl font-bold text-text-light">AI Tutor</h3>
					<p class="mt-2 text-text-muted">
						Stuck on a question? Ask our AI tutor for personalized explanations and tips.
					</p>
				</div>
			</div>
		</div>

		<!-- Levels Section -->
		<div class="mt-24">
			<h2 class="text-center text-3xl font-bold text-text-light">From Beginner to Fluent</h2>
			<p class="mt-4 text-center text-text-muted">
				Our curriculum covers all CEFR levels from A1 to C2
			</p>
			<div class="mt-12 flex flex-wrap justify-center gap-4">
				{#each ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as level}
					<div class="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-success to-success-dark text-white font-bold text-xl shadow-lg">
						{level}
					</div>
				{/each}
			</div>
		</div>

		<!-- CTA Section -->
		<div class="mt-24 rounded-3xl bg-gradient-to-r from-success to-success-dark p-8 text-center text-white lg:p-12">
			<h2 class="text-3xl font-bold">Ready to start learning?</h2>
			<p class="mt-4 text-lg opacity-90">
				Join thousands of learners and start your Spanish journey today.
			</p>
			<a href="/register" class="btn btn-lg mt-8 bg-white text-success hover:bg-gray-100">
				Create free account
			</a>
		</div>
	</div>
</div>
