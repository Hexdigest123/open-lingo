<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { i18n, t } from '$lib/i18n/index.svelte';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();

	let showLangMenu = $state(false);
	let showUserMenu = $state(false);

	async function handleLogout() {
		try {
			await fetch('/api/auth/logout', { method: 'POST' });
			goto('/login');
		} catch (error) {
			console.error('Logout failed:', error);
			// Force redirect anyway
			goto('/login');
		}
	}

	const navItems = [
		{ href: '/dashboard', labelKey: 'nav.dashboard', icon: '🏠' },
		{ href: '/lessons', labelKey: 'nav.learn', icon: '📚' },
		{ href: '/chat', labelKey: 'nav.chat', icon: '💬' },
		{ href: '/leaderboard', labelKey: 'nav.leaderboard', icon: '🏆' },
		{ href: '/profile', labelKey: 'nav.profile', icon: '👤' }
	];

	const isAdmin = $derived(data.user.role === 'admin');

	function isActive(href: string): boolean {
		return $page.url.pathname === href || $page.url.pathname.startsWith(href + '/');
	}

	function toggleLangMenu() {
		showLangMenu = !showLangMenu;
	}

	function selectLocale(locale: 'en' | 'de') {
		i18n.setLocale(locale);
		showLangMenu = false;
	}
</script>

<div class="min-h-screen bg-bg-light">
	<!-- Top Bar -->
	<header class="sticky top-0 z-50 border-b border-border-light bg-white">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
			<!-- Logo -->
			<a href="/dashboard" class="flex items-center gap-2">
				<span class="text-xl font-bold text-success">OpenLingo</span>
			</a>

			<!-- Desktop Navigation -->
			<nav class="hidden items-center gap-6 md:flex">
				{#each navItems as item}
					<a
						href={item.href}
						class="flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-colors
							{isActive(item.href) ? 'bg-success/10 text-success' : 'text-text-muted hover:text-text-light'}"
					>
						<span>{item.icon}</span>
						<span>{t(item.labelKey)}</span>
					</a>
				{/each}
				{#if isAdmin}
					<a
						href="/admin"
						class="flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-colors
							{isActive('/admin') ? 'bg-purple/10 text-purple' : 'text-text-muted hover:text-purple'}"
					>
						<span>⚙️</span>
						<span>{t('nav.admin')}</span>
					</a>
				{/if}
			</nav>

			<!-- Gamification Stats -->
			<div class="flex items-center gap-4">
				<!-- Hearts -->
				<div class="flex items-center gap-1 rounded-xl bg-error/10 px-3 py-1.5" title="{t('gamification.hearts')}">
					<span class="text-error">❤️</span>
					<span class="font-bold text-error">{data.stats.hearts}</span>
				</div>

				<!-- Streak -->
				<div class="hidden items-center gap-1 rounded-xl bg-orange/10 px-3 py-1.5 sm:flex" title="{t('gamification.streak')}">
					<span>🔥</span>
					<span class="font-bold text-orange">{data.stats.currentStreak}</span>
				</div>

				<!-- Streak Freezes -->
				{#if data.stats.streakFreezes > 0}
					<div class="hidden items-center gap-1 rounded-xl bg-primary/10 px-3 py-1.5 sm:flex" title="{t('gamification.streakFreezes')}">
						<span>🧊</span>
						<span class="font-bold text-primary">{data.stats.streakFreezes}</span>
					</div>
				{/if}

				<!-- XP -->
				<div class="flex items-center gap-1 rounded-xl bg-yellow/10 px-3 py-1.5" title="{t('gamification.xp')}">
					<span>⭐</span>
					<span class="font-bold text-yellow-dark">{data.stats.xpTotal}</span>
				</div>

				<!-- Language Switcher -->
				<div class="relative">
					<button
						onclick={toggleLangMenu}
						class="flex items-center gap-1 rounded-xl bg-primary/10 px-3 py-1.5 font-medium text-primary hover:bg-primary/20"
					>
						<span>🌐</span>
						<span class="hidden sm:inline">{i18n.locale === 'de' ? 'DE' : 'EN'}</span>
					</button>
					{#if showLangMenu}
						<div class="absolute right-0 top-full mt-2 w-32 rounded-xl border border-border-light bg-white py-1 shadow-lg">
							{#each i18n.availableLocales as locale}
								<button
									onclick={() => selectLocale(locale.code)}
									class="w-full px-4 py-2 text-left hover:bg-bg-light-secondary {i18n.locale === locale.code ? 'font-bold text-primary' : ''}"
								>
									{locale.name}
								</button>
							{/each}
						</div>
					{/if}
				</div>

				<!-- User Menu with Logout -->
				<div class="relative">
					<button
						onclick={() => (showUserMenu = !showUserMenu)}
						class="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-success to-primary text-sm font-bold text-white hover:opacity-90"
						title={data.user.displayName}
					>
						{data.user.displayName.charAt(0).toUpperCase()}
					</button>
					{#if showUserMenu}
						<div class="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border-light bg-white py-1 shadow-lg">
							<div class="px-4 py-2 border-b border-border-light">
								<p class="font-medium text-text-light">{data.user.displayName}</p>
								<p class="text-xs text-text-muted">{data.user.email}</p>
							</div>
							<a
								href="/settings"
								onclick={() => (showUserMenu = false)}
								class="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-bg-light-secondary"
							>
								<span>⚙️</span>
								<span>{t('nav.settings')}</span>
							</a>
							<button
								onclick={handleLogout}
								class="flex w-full items-center gap-2 px-4 py-2 text-left text-error hover:bg-error/10"
							>
								<span>🚪</span>
								<span>{t('nav.logout')}</span>
							</button>
						</div>
					{/if}
				</div>
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
				<a
					href={item.href}
					class="flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-colors
						{isActive(item.href) ? 'text-success' : 'text-text-muted'}"
				>
					<span class="text-xl">{item.icon}</span>
					<span class="text-xs font-medium">{t(item.labelKey)}</span>
				</a>
			{/each}
			{#if isAdmin}
				<a
					href="/admin"
					class="flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-colors
						{isActive('/admin') ? 'text-purple' : 'text-text-muted'}"
				>
					<span class="text-xl">⚙️</span>
					<span class="text-xs font-medium">{t('nav.admin')}</span>
				</a>
			{/if}
		</div>
	</nav>

	<!-- Spacer for mobile bottom nav -->
	<div class="h-20 md:hidden"></div>
</div>
