<script lang="ts">
	import type { LayoutData } from '../$types';
	import { t } from '$lib/i18n/index.svelte';
	import { BookOpen, Users, Settings, BarChart3 } from 'lucide-svelte';

	let { data }: { data: LayoutData } = $props();
</script>

<svelte:head>
	<title>{t('admin.title')} - OpenLingo</title>
</svelte:head>

<div class="space-y-8">
	<h1 class="text-3xl font-bold text-text-light">{t('admin.title')}</h1>

	<!-- Stats Grid -->
	<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
		<div class="card">
			<div class="text-3xl font-bold text-primary">{data.adminStats.totalUsers}</div>
			<div class="text-sm text-text-muted">{t('admin.stats.totalUsers')}</div>
		</div>
		<div class="card">
			<div class="text-3xl font-bold text-success">{data.adminStats.totalLessons}</div>
			<div class="text-sm text-text-muted">{t('admin.stats.totalLessons')}</div>
		</div>
		<div class="card">
			<div class="text-3xl font-bold text-yellow-dark">{data.adminStats.totalQuestions}</div>
			<div class="text-sm text-text-muted">{t('admin.stats.totalQuestions')}</div>
		</div>
		<div class="card">
			<div class="text-3xl font-bold text-orange">{data.adminStats.activeToday}</div>
			<div class="text-sm text-text-muted">{t('admin.stats.activeToday')}</div>
		</div>
	</div>

	<!-- Quick Actions -->
	<div class="grid gap-4 md:grid-cols-2">
		<a href="/admin/lessons" class="card flex items-center gap-4 transition-shadow hover:shadow-lg">
			<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-2xl">
				<BookOpen size={24} />
			</div>
			<div>
				<h3 class="font-bold text-text-light">{t('admin.lessons.title')}</h3>
				<p class="text-sm text-text-muted">Create and manage lessons</p>
			</div>
		</a>
		<a href="/admin/users" class="card flex items-center gap-4 transition-shadow hover:shadow-lg">
			<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
				<Users size={24} />
			</div>
			<div>
				<h3 class="font-bold text-text-light">{t('admin.users.title')}</h3>
				<p class="text-sm text-text-muted">View and manage users</p>
			</div>
		</a>
		<a
			href="/admin/settings"
			class="card flex items-center gap-4 transition-shadow hover:shadow-lg"
		>
			<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-purple/10 text-2xl">
				<Settings size={24} />
			</div>
			<div>
				<h3 class="font-bold text-text-light">{t('admin.settings.title')}</h3>
				<p class="text-sm text-text-muted">Global application settings</p>
			</div>
		</a>
		<a
			href="/admin/api-usage"
			class="card flex items-center gap-4 transition-shadow hover:shadow-lg"
		>
			<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow/10 text-2xl">
				<BarChart3 size={24} />
			</div>
			<div>
				<h3 class="font-bold text-text-light">API Usage</h3>
				<p class="text-sm text-text-muted">Monitor global API key usage</p>
			</div>
		</a>
	</div>
</div>
