<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale, setLocale } from '$lib/paraglide/runtime.js';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Toast from '$lib/components/ui/Toast.svelte';
	import CelebrationOverlay from '$lib/components/ui/CelebrationOverlay.svelte';
	import { setSoundEnabled } from '$lib/stores/sounds.svelte';
	import { getRankFromXp, getXpProgress } from '$lib/learning/levels';
	import { onMount } from 'svelte';
	const availableLocales = [
		{ code: 'en' as const, name: 'English' },
		{ code: 'de' as const, name: 'Deutsch' }
	];
	type Locale = 'en' | 'de';

	import {
		Home,
		BookOpen,
		MessageCircle,
		Trophy,
		User,
		Flame,
		Globe,
		Wrench,
		LogOut,
		Heart,
		Gem,
		Shield,
		Menu,
		X,
		Settings,
		ShoppingBag,
		Users,
		ChevronDown
	} from 'lucide-svelte';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();

	let showUserMenu = $state(false);
	let showMobileMenu = $state(false);
	let showMoreMenu = $state(false);

	// Initialize locale from server data if available
	onMount(() => {
		if (data.userLocale && (data.userLocale === 'en' || data.userLocale === 'de')) {
			setLocale(data.userLocale as Locale);
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
		{ href: '/dashboard', labelKey: 'nav.dashboard', icon: Home },
		{ href: '/lessons', labelKey: 'nav.learn', icon: BookOpen },
		{ href: '/chat', labelKey: 'nav.chat', icon: MessageCircle },
		{ href: '/shop', labelKey: 'nav.shop', icon: ShoppingBag },
		{ href: '/friends', labelKey: 'nav.friends', icon: Users },
		{ href: '/leaderboard', labelKey: 'nav.leaderboard', icon: Trophy },
		{ href: '/profile', labelKey: 'nav.profile', icon: User }
	];

	const primaryNavItems = [
		navItems[0], // Dashboard
		navItems[1], // Learn
		navItems[3] // Shop
	];

	const secondaryNavItems = [
		navItems[2], // Chat
		navItems[4], // Friends
		navItems[5], // Leaderboard
		navItems[6] // Profile
	];

	const isAdmin = $derived(data.user.role === 'admin');

	// Detect if user is in an active lesson (hide mobile nav to avoid blocking vision)
	const isInLesson = $derived($page.url.pathname.match(/^\/lessons\/[^/]+$/));
	const levelProgress = $derived(getXpProgress(data.stats.xpTotal));
	const rank = $derived(getRankFromXp(data.stats.xpTotal));
	const rankColor = $derived(rank.color);
	$effect(() => {
		setSoundEnabled(data.stats.soundEnabled);
	});

	function isActive(href: string): boolean {
		return $page.url.pathname === href || $page.url.pathname.startsWith(href + '/');
	}

	function selectLocale(locale: 'en' | 'de') {
		setLocale(locale);
		showUserMenu = false;
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
				{#each primaryNavItems as item}
					<a
						href={item.href}
						class="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-colors
							{isActive(item.href) ? 'bg-success/10 text-success' : 'text-text-muted hover:text-text-light'}"
					>
						<item.icon size={20} />
						<span
							>{(m[item.labelKey as keyof typeof m] as unknown as () => string)?.() ??
								item.labelKey}</span
						>
					</a>
				{/each}

				<!-- More Dropdown -->
				<div class="relative" use:clickOutside={() => (showMoreMenu = false)}>
					<button
						onclick={() => (showMoreMenu = !showMoreMenu)}
						class="flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium text-text-muted transition-colors hover:text-text-light"
					>
						<span>{m['nav.menu']()}</span>
						<ChevronDown size={16} />
					</button>

					{#if showMoreMenu}
						<div
							class="absolute top-full left-0 mt-2 w-48 rounded-xl border border-border-light bg-white py-1 shadow-lg"
						>
							{#each secondaryNavItems as item}
								<a
									href={item.href}
									onclick={() => (showMoreMenu = false)}
									class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-medium transition-colors hover:bg-bg-light-secondary
										{isActive(item.href) ? 'text-success' : 'text-text-muted'}"
								>
									<item.icon size={16} />
									<span
										>{(m[item.labelKey as keyof typeof m] as unknown as () => string)?.() ??
											item.labelKey}</span
									>
								</a>
							{/each}
							{#if isAdmin}
								<div class="my-1 border-t border-border-light"></div>
								<a
									href="/admin"
									onclick={() => (showMoreMenu = false)}
									class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-medium text-text-muted transition-colors hover:bg-purple/10 hover:text-purple"
								>
									<Wrench size={16} />
									<span>{m['nav.admin']()}</span>
								</a>
							{/if}
						</div>
					{/if}
				</div>
			</nav>

			<!-- Gamification Stats -->
			<div class="flex items-center gap-1.5 sm:gap-2">
				<!-- Hearts -->
				<div
					class="flex items-center gap-1 rounded-xl bg-error/10 px-2 py-1"
					title={m['gamification.hearts']()}
				>
					<Heart size={16} class="text-error" />
					<span class="text-sm font-bold text-error">{data.stats.hearts}</span>
				</div>

				<!-- Streak -->
				<div
					class="hidden items-center gap-1 rounded-xl bg-orange/10 px-2 py-1 sm:flex"
					title={m['gamification.streak']()}
				>
					<Flame size={16} class="text-orange" />
					<span class="text-sm font-bold text-orange">{data.stats.currentStreak}</span>
					{#if data.stats.currentStreak >= 7}
						<Shield
							size={12}
							class="text-orange {data.stats.currentStreak >= 30 ? 'animate-shield-pulse' : ''}"
						/>
					{/if}
				</div>

				<!-- Streak Freezes (Removed from header) -->
				<!-- XP (Removed from header) -->

				<div
					class="hidden items-center gap-1 rounded-xl bg-purple/10 px-2 py-1 sm:flex"
					title={m['gamification.gems']()}
				>
					<Gem size={16} class="animate-gem-sparkle text-purple" />
					<span class="text-sm font-bold text-purple">{data.stats.gems}</span>
				</div>

				<!-- User Menu -->
				{#if showUserMenu}
					<div
						class="relative flex items-center gap-1"
						use:clickOutside={() => (showUserMenu = false)}
					>
						<span
							class="text-xs font-bold"
							style="color: {rankColor}"
							title="{m['gamification.level']()} {data.stats.level} ({Math.round(
								levelProgress.progress * 100
							)}%)"
						>
							Lv.{data.stats.level}
						</span>
						<button
							onclick={() => (showUserMenu = !showUserMenu)}
							class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-success to-primary text-xs font-bold text-white hover:opacity-90"
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
							<div class="border-b border-border-light px-4 py-2">
								<p class="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-text-muted">
									<Globe size={12} />
									{m['settings.language']()}
								</p>
								<div class="flex gap-1">
									{#each availableLocales as locale}
										<button
											onclick={() => selectLocale(locale.code)}
											class="rounded-lg px-3 py-1 text-xs font-medium transition-colors {getLocale() ===
											locale.code
												? 'bg-primary/15 text-primary'
												: 'text-text-muted hover:bg-bg-light-secondary'}"
										>
											{locale.name}
										</button>
									{/each}
								</div>
							</div>
							<a
								href="/settings"
								onclick={() => (showUserMenu = false)}
								class="flex w-full items-center gap-2 px-4 py-2 text-left text-text-light hover:bg-bg-light-secondary"
							>
								<Settings size={16} />
								<span>{m['nav.settings']()}</span>
							</a>
							{#if isAdmin}
								<a
									href="/admin"
									onclick={() => (showUserMenu = false)}
									class="flex w-full items-center gap-2 px-4 py-2 text-left text-purple hover:bg-purple/10 lg:hidden"
								>
									<Wrench size={16} />
									<span>{m['nav.admin']()}</span>
								</a>
							{/if}
							<button
								onclick={handleLogout}
								class="flex w-full items-center gap-2 rounded-b-xl px-4 py-2 text-left text-error hover:bg-error/10"
							>
								<LogOut size={16} />
								<span>{m['nav.logout']()}</span>
							</button>
						</div>
					</div>
				{:else}
					<div class="relative flex items-center gap-1">
						<span
							class="text-xs font-bold"
							style="color: {rankColor}"
							title="{m['gamification.level']()} {data.stats.level} ({Math.round(
								levelProgress.progress * 100
							)}%)"
						>
							Lv.{data.stats.level}
						</span>
						<button
							onclick={() => (showUserMenu = !showUserMenu)}
							class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-success to-primary text-xs font-bold text-white hover:opacity-90"
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
				onclick={() => (showMobileMenu = false)}
				aria-label="Close menu"
			></button>
			<!-- Menu Panel -->
			<div class="absolute top-0 bottom-0 left-0 w-64 bg-white shadow-xl">
				<div class="flex items-center justify-between border-b border-border-light p-4">
					<span class="text-lg font-bold text-success">OpenLingo</span>
					<button
						class="p-2 text-text-muted hover:text-text-light"
						onclick={() => (showMobileMenu = false)}
						aria-label="Close menu"
					>
						<X size={24} />
					</button>
				</div>
				<nav class="space-y-2 p-4">
					{#each navItems as item}
						<a
							href={item.href}
							onclick={() => (showMobileMenu = false)}
							class="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors
								{isActive(item.href)
								? 'bg-success/10 text-success'
								: 'text-text-muted hover:bg-bg-light-secondary hover:text-text-light'}"
						>
							<item.icon size={24} />
							<span class="font-medium"
								>{(m[item.labelKey as keyof typeof m] as unknown as () => string)?.() ??
									item.labelKey}</span
							>
						</a>
					{/each}
					{#if isAdmin}
						<a
							href="/admin"
							onclick={() => (showMobileMenu = false)}
							class="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors
								{isActive('/admin')
								? 'bg-purple/10 text-purple'
								: 'text-text-muted hover:bg-purple/10 hover:text-purple'}"
						>
							<Wrench size={24} />
							<span class="font-medium">{m['nav.admin']()}</span>
						</a>
					{/if}
				</nav>
			</div>
		</div>
	{/if}

	{#if !isInLesson}
		<!-- Mobile Bottom Navigation with Burger (< 400px) -->
		<nav
			class="fixed right-0 bottom-0 left-0 z-50 h-16 border-t border-border-light bg-white min-[400px]:hidden lg:hidden"
		>
			<div class="flex h-full items-center justify-center">
				<!-- Burger Menu Button (centered) -->
				<button
					onclick={() => (showMobileMenu = !showMobileMenu)}
					class="flex items-center justify-center rounded-xl p-3 text-text-muted transition-colors hover:text-text-light"
					aria-label="Toggle menu"
				>
					{#if showMobileMenu}
						<X size={32} />
					{:else}
						<Menu size={32} />
					{/if}
				</button>
			</div>
		</nav>

		<!-- Mobile Bottom Navigation (400px - lg) -->
		<nav
			class="fixed right-0 bottom-0 left-0 z-50 hidden border-t border-border-light bg-white min-[400px]:block lg:hidden"
		>
			<div class="flex items-center justify-around py-2">
				{#each navItems as item}
					<a
						href={item.href}
						class="flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-colors
							{isActive(item.href) ? 'text-success' : 'text-text-muted'}"
					>
						<item.icon size={24} />
						<span class="text-xs font-medium"
							>{(m[item.labelKey as keyof typeof m] as unknown as () => string)?.() ??
								item.labelKey}</span
						>
					</a>
				{/each}
			</div>
		</nav>

		<!-- Spacer for mobile bottom nav -->
		<div class="h-20 lg:hidden"></div>
	{/if}
</div>

<Toast />
<CelebrationOverlay />
