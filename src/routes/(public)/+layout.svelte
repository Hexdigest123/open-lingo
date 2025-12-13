<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="min-h-screen bg-bg-light">
	<!-- Header -->
	<header class="border-b border-border-light bg-white">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
			<a href="/" class="flex items-center gap-2">
				<span class="text-2xl font-bold text-success">OpenLingo</span>
			</a>
			<nav class="flex items-center gap-4">
				<a href="/login" class="btn btn-ghost btn-sm">Log in</a>
				<a href="/register" class="btn btn-success btn-sm">Get started</a>
			</nav>
		</div>
	</header>

	<!-- Main content -->
	<main>
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="border-t border-border-light bg-white py-8">
		<div class="mx-auto max-w-7xl px-4 text-center text-text-muted">
			<p>OpenLingo - Learn Spanish the fun way</p>
		</div>
	</footer>
</div>
