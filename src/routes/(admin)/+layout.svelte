<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import * as m from '$lib/paraglide/messages.js';
	import { BarChart3, BookOpen, Users, TrendingUp, Settings } from 'lucide-svelte';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();

	const navItems = [
		{ href: '/admin', label: 'admin.nav.dashboard', icon: 'BarChart3' },
		{ href: '/admin/lessons', label: 'admin.nav.lessons', icon: 'BookOpen' },
		{ href: '/admin/users', label: 'admin.nav.users', icon: 'Users' },
		{ href: '/admin/api-usage', label: 'admin.nav.apiUsage', icon: 'TrendingUp' },
		{ href: '/admin/settings', label: 'admin.nav.settings', icon: 'Settings' }
	];

	const iconMap: Record<string, typeof BarChart3> = {
		BarChart3,
		BookOpen,
		Users,
		TrendingUp,
		Settings
	};

	function isActive(href: string): boolean {
		if (href === '/admin') {
			return $page.url.pathname === '/admin';
		}
		return $page.url.pathname.startsWith(href);
	}
</script>

<div class="min-h-screen bg-bg-light">
	<!-- Top Bar -->
	<header class="sticky top-0 z-50 border-b border-border-light bg-purple">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
			<div class="flex items-center gap-4">
				<a href="/admin" class="flex items-center gap-2">
					<span class="text-xl font-bold text-white">OpenLingo</span>
					<span class="rounded-lg bg-white/20 px-2 py-0.5 text-sm font-medium text-white"
						>Admin</span
					>
				</a>
			</div>

			<nav class="hidden items-center gap-2 md:flex">
				{#each navItems as item}
					{@const IconComponent = iconMap[item.icon]}
					<a
						href={item.href}
						class="flex items-center gap-2 rounded-xl px-4 py-2 font-medium whitespace-nowrap transition-colors
						{isActive(item.href) ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'}"
					>
						{#if IconComponent}
							<IconComponent size={16} />
						{:else}
							{item.icon}
						{/if}
						<span>{(m[item.label as keyof typeof m] as (...args: any[]) => string)()}</span>
					</a>
				{/each}
			</nav>

			<div class="flex items-center gap-4">
				<a href="/dashboard" class="text-white/70 hover:text-white">
					← {m['nav.dashboard']()}
				</a>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="mx-auto max-w-7xl px-4 py-6">
		{@render children()}
	</main>

	<!-- Mobile Bottom Navigation -->
	<nav class="fixed right-0 bottom-0 left-0 z-50 border-t border-border-light bg-white md:hidden">
		<div class="flex items-center justify-around py-2">
			{#each navItems as item}
				{@const IconComponent = iconMap[item.icon]}
				<a
					href={item.href}
					class="flex flex-col items-center gap-1 rounded-xl px-4 py-2 whitespace-nowrap transition-colors
					{isActive(item.href) ? 'text-purple' : 'text-text-muted'}"
				>
					{#if IconComponent}
						<IconComponent size={20} />
					{:else}
						<span class="text-xl">{item.icon}</span>
					{/if}
					<span class="text-xs font-medium"
						>{(m[item.label as keyof typeof m] as (...args: any[]) => string)()}</span
					>
				</a>
			{/each}
		</div>
	</nav>

	<div class="h-20 md:hidden"></div>
</div>
