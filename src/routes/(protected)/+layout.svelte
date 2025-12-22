<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { i18n, t, type Locale } from '$lib/i18n/index.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { onMount } from 'svelte';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();

	let showLangMenu = $state(false);
	let showUserMenu = $state(false);
	let showMobileMenu = $state(false);

	// Initialize locale from server data if available
	onMount(() => {
		if (data.userLocale && (data.userLocale === 'en' || data.userLocale === 'de')) {
			i18n.setLocale(data.userLocale as Locale);
		}
	});

	// Click-outside action for closing dropdowns
	function clickOutside(node: HTMLElement, callback: () => void) {
		function handleClick(event: MouseEvent) {
			if (!node.contains(event.target as Node)) {
				callback();
			}
		}

		document.addEventListener('click', handleClick, true);

		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			}
		};
	}

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

	// Detect if user is in an active lesson (hide mobile nav to avoid blocking vision)
	const isInLesson = $derived($page.url.pathname.match(/^\/lessons\/[^/]+$/));

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
			<nav class="hidden items-center gap-3 lg:flex">
				{#each navItems as item}
					<a
						href={item.href}
						class="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-colors
							{isActive(item.href) ? 'bg-success/10 text-success' : 'text-text-muted hover:text-text-light'}"
					>
						<span>{item.icon}</span>
						<span>{t(item.labelKey)}</span>
					</a>
				{/each}
				{#if isAdmin}
					<a
						href="/admin"
						class="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-colors
							{isActive('/admin') ? 'bg-purple/10 text-purple' : 'text-text-muted hover:text-purple'}"
					>
						<span>⚙️</span>
						<span>{t('nav.admin')}</span>
					</a>
				{/if}
			</nav>

			<!-- Gamification Stats -->
			<div class="flex items-center gap-2">
				<!-- Hearts -->
				<div
					class="flex items-center gap-1 rounded-xl bg-error/10 px-2 py-1"
					title={t('gamification.hearts')}
				>
					<span class="text-sm text-error">❤️</span>
					<span class="text-sm font-bold text-error">{data.stats.hearts}</span>
				</div>

				<!-- Streak -->
				<div
					class="hidden items-center gap-1 rounded-xl bg-orange/10 px-2 py-1 sm:flex"
					title={t('gamification.streak')}
				>
					<span class="text-sm">🔥</span>
					<span class="text-sm font-bold text-orange">{data.stats.currentStreak}</span>
				</div>

				<!-- Streak Freezes -->
				{#if data.stats.streakFreezes > 0}
					<div
						class="hidden items-center gap-1 rounded-xl bg-primary/10 px-2 py-1 md:flex"
						title={t('gamification.streakFreezes')}
					>
						<span class="text-sm">🧊</span>
						<span class="text-sm font-bold text-primary">{data.stats.streakFreezes}</span>
					</div>
				{/if}

				<!-- XP -->
				<div
					class="flex items-center gap-1 rounded-xl bg-yellow/10 px-2 py-1"
					title={t('gamification.xp')}
				>
					<span class="text-sm">⭐</span>
					<span class="text-sm font-bold text-yellow-dark">{data.stats.xpTotal}</span>
				</div>

				<!-- Language Switcher -->
				{#if showLangMenu}
					<div class="relative" use:clickOutside={() => (showLangMenu = false)}>
						<button
							onclick={toggleLangMenu}
							class="flex items-center gap-1 rounded-xl bg-primary/10 px-2 py-1 text-sm font-medium text-primary hover:bg-primary/20 cursor-pointer"
						>
							<span>🌐</span>
							<span class="hidden sm:inline">{i18n.locale === 'de' ? 'DE' : 'EN'}</span>
						</button>
						<div
							class="absolute top-full right-0 mt-2 w-32 rounded-xl border border-border-light bg-white py-1 shadow-lg"
						>
							{#each i18n.availableLocales as locale}
								<button
									onclick={() => selectLocale(locale.code)}
									class="w-full px-4 py-2 text-left hover:bg-bg-light-secondary first:rounded-t-lg last:rounded-b-lg {i18n.locale ===
									locale.code
										? 'font-bold text-primary'
										: 'text-text-light'}"
								>
									{locale.name}
								</button>
							{/each}
						</div>
					</div>
				{:else}
					<div class="relative">
						<button
							onclick={toggleLangMenu}
							class="flex items-center gap-1 rounded-xl bg-primary/10 px-2 py-1 text-sm font-medium text-primary hover:bg-primary/20 cursor-pointer"
						>
							<span>🌐</span>
							<span class="hidden sm:inline">{i18n.locale === 'de' ? 'DE' : 'EN'}</span>
						</button>
					</div>
				{/if}

				<!-- User Menu with Logout -->
				{#if showUserMenu}
					<div class="relative" use:clickOutside={() => (showUserMenu = false)}>
						<button
							onclick={() => (showUserMenu = !showUserMenu)}
							class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-success to-primary text-xs font-bold text-white hover:opacity-90 cursor-pointer"
							title={data.user.displayName}
						>
							{data.user.displayName.charAt(0).toUpperCase()}
						</button>
						<div
							class="absolute top-full right-0 mt-2 w-48 rounded-xl border border-border-light bg-white py-1 shadow-lg"
						>
							<div class="border-b border-border-light px-4 py-2">
								<p class="font-medium text-text-light">{data.user.displayName}</p>
								<p class="text-xs text-text-muted">{data.user.email}</p>
							</div>
							<a
								href="/settings"
								onclick={() => (showUserMenu = false)}
								class="flex w-full items-center gap-2 px-4 py-2 text-left text-text-light hover:bg-bg-light-secondary"
							>
								<span>⚙️</span>
								<span>{t('nav.settings')}</span>
							</a>
							{#if isAdmin}
								<a
									href="/admin"
									onclick={() => (showUserMenu = false)}
									class="flex w-full items-center gap-2 px-4 py-2 text-left text-purple hover:bg-purple/10 lg:hidden"
								>
									<span>🛠️</span>
									<span>{t('nav.admin')}</span>
								</a>
							{/if}
							<button
								onclick={handleLogout}
								class="flex w-full items-center gap-2 px-4 py-2 text-left text-error hover:bg-error/10 rounded-b-xl"
							>
								<span>🚪</span>
								<span>{t('nav.logout')}</span>
							</button>
						</div>
					</div>
				{:else}
					<div class="relative">
						<button
							onclick={() => (showUserMenu = !showUserMenu)}
							class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-success to-primary text-xs font-bold text-white hover:opacity-90 cursor-pointer"
							title={data.user.displayName}
						>
							{data.user.displayName.charAt(0).toUpperCase()}
						</button>
					</div>
				{/if}
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="mx-auto max-w-7xl px-4 py-6">
		{@render children()}
	</main>

	<!-- Mobile Slide-out Menu (< 400px) -->
	{#if showMobileMenu}
		<div class="fixed inset-0 z-[60] min-[400px]:hidden">
			<!-- Backdrop -->
			<button
				class="absolute inset-0 bg-black/50"
				onclick={() => showMobileMenu = false}
				aria-label="Close menu"
			></button>
			<!-- Menu Panel -->
			<div class="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl">
				<div class="flex items-center justify-between border-b border-border-light p-4">
					<span class="text-lg font-bold text-success">OpenLingo</span>
					<button
						class="p-2 text-text-muted hover:text-text-light"
						onclick={() => showMobileMenu = false}
						aria-label="Close menu"
					>
						<span class="text-xl">✕</span>
					</button>
				</div>
				<nav class="p-4 space-y-2">
					{#each navItems as item}
						<a
							href={item.href}
							onclick={() => showMobileMenu = false}
							class="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors
								{isActive(item.href) ? 'bg-success/10 text-success' : 'text-text-muted hover:bg-bg-light-secondary hover:text-text-light'}"
						>
							<span class="text-xl">{item.icon}</span>
							<span class="font-medium">{t(item.labelKey)}</span>
						</a>
					{/each}
					{#if isAdmin}
						<a
							href="/admin"
							onclick={() => showMobileMenu = false}
							class="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors
								{isActive('/admin') ? 'bg-purple/10 text-purple' : 'text-text-muted hover:bg-purple/10 hover:text-purple'}"
						>
							<span class="text-xl">⚙️</span>
							<span class="font-medium">{t('nav.admin')}</span>
						</a>
					{/if}
				</nav>
			</div>
		</div>
	{/if}

	{#if !isInLesson}
		<!-- Mobile Bottom Navigation with Burger (< 400px) -->
		<nav class="fixed right-0 bottom-0 left-0 z-50 h-16 border-t border-border-light bg-white min-[400px]:hidden lg:hidden">
			<div class="flex h-full items-center justify-center">
				<!-- Burger Menu Button (centered) -->
				<button
					onclick={() => showMobileMenu = !showMobileMenu}
					class="flex items-center justify-center rounded-xl p-3 transition-colors text-text-muted hover:text-text-light"
					aria-label="Toggle menu"
				>
					<span class="text-4xl">{showMobileMenu ? '✕' : '☰'}</span>
				</button>
			</div>
		</nav>

		<!-- Mobile Bottom Navigation (400px - lg) -->
		<nav class="fixed right-0 bottom-0 left-0 z-50 border-t border-border-light bg-white hidden min-[400px]:block lg:hidden">
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
			</div>
		</nav>

		<!-- Spacer for mobile bottom nav -->
		<div class="h-20 lg:hidden"></div>
	{/if}
</div>

<!-- Toast Notifications -->
<Toast />
