<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import { t } from '$lib/i18n/index.svelte';
	import { LayoutDashboard, BookOpen, Users, TrendingUp, Settings, ArrowLeft } from 'lucide-svelte';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();

	const navItems = [
		{ href: '/admin', label: 'admin.nav.dashboard', icon: LayoutDashboard },
		{ href: '/admin/lessons', label: 'admin.nav.lessons', icon: BookOpen },
		{ href: '/admin/users', label: 'admin.nav.users', icon: Users },
		{ href: '/admin/api-usage', label: 'API Usage', icon: TrendingUp },
		{ href: '/admin/settings', label: 'admin.nav.settings', icon: Settings }
	];

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
					<span class="rounded-lg bg-white/20 px-2 py-0.5 text-sm font-medium text-white">Admin</span>
				</a>
			</div>

			<nav class="hidden items-center gap-2 md:flex">
				{#each navItems as item}
					{@const Icon = item.icon}
					<a
						href={item.href}
						class="flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 font-medium transition-colors
							{isActive(item.href) ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'}"
					>
						<Icon size={18} strokeWidth={2.25} />
						<span>{t(item.label)}</span>
					</a>
				{/each}
			</nav>

			<div class="flex items-center gap-4">
				<a href="/dashboard" class="flex items-center gap-1.5 text-white/70 hover:text-white">
					<ArrowLeft size={16} />
					<span>{t('nav.dashboard')}</span>
				</a>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="mx-auto max-w-7xl px-4 py-6">
		{@render children()}
	</main>

	<!-- Mobile Bottom Navigation -->
	<nav class="fixed bottom-0 left-0 right-0 z-50 border-t border-border-light bg-white md:hidden">
		<div class="flex items-center justify-around py-2">
			{#each navItems as item}
				{@const Icon = item.icon}
				<a
					href={item.href}
					class="flex flex-col items-center gap-1 whitespace-nowrap rounded-xl px-4 py-2 transition-colors
						{isActive(item.href) ? 'text-purple' : 'text-text-muted'}"
				>
					<Icon size={22} strokeWidth={2.25} />
					<span class="text-xs font-medium">{t(item.label)}</span>
				</a>
			{/each}
		</div>
	</nav>

	<div class="h-20 md:hidden"></div>
</div>
