<script lang="ts">
	import type { LayoutData } from '../$types';
	import * as m from '$lib/paraglide/messages.js';
	import { BookOpen, Users, Settings, BarChart3 } from 'lucide-svelte';

	let { data }: { data: LayoutData } = $props();
</script>

<svelte:head>
	<title>{m['admin.title']()} - OpenLingo</title>
</svelte:head>

<div class="space-y-8">
	<h1 class="text-3xl font-bold text-text-light">{m['admin.title']()}</h1>

	<!-- Stats Grid -->
	<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
		<div class="card">
			<div class="text-3xl font-bold text-primary">{data.adminStats.totalUsers}</div>
			<div class="text-sm text-text-muted">{m['admin.stats.totalUsers']()}</div>
		</div>
		<div class="card">
			<div class="text-3xl font-bold text-success">{data.adminStats.totalLessons}</div>
			<div class="text-sm text-text-muted">{m['admin.stats.totalLessons']()}</div>
		</div>
		<div class="card">
			<div class="text-3xl font-bold text-yellow-dark">{data.adminStats.totalQuestions}</div>
			<div class="text-sm text-text-muted">{m['admin.stats.totalQuestions']()}</div>
		</div>
		<div class="card">
			<div class="text-3xl font-bold text-orange">{data.adminStats.activeToday}</div>
			<div class="text-sm text-text-muted">{m['admin.stats.activeToday']()}</div>
		</div>
	</div>

	<!-- Quick Actions -->
	<div class="grid gap-4 md:grid-cols-2">
		<a href="/admin/lessons" class="flex items-center gap-4 card transition-shadow hover:shadow-lg">
			<div
				class="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-2xl text-success"
			>
				<BookOpen size={24} />
			</div>
			<div>
				<h3 class="font-bold text-text-light">{m['admin.lessons.title']()}</h3>
				<p class="text-sm text-text-muted">{m['admin.lessons.description']()}</p>
			</div>
		</a>
		<a href="/admin/users" class="flex items-center gap-4 card transition-shadow hover:shadow-lg">
			<div
				class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl text-primary"
			>
				<Users size={24} />
			</div>
			<div>
				<h3 class="font-bold text-text-light">{m['admin.users.title']()}</h3>
				<p class="text-sm text-text-muted">{m['admin.users.description']()}</p>
			</div>
		</a>
		<a
			href="/admin/settings"
			class="flex items-center gap-4 card transition-shadow hover:shadow-lg"
		>
			<div
				class="flex h-12 w-12 items-center justify-center rounded-xl bg-purple/10 text-2xl text-purple"
			>
				<Settings size={24} />
			</div>
			<div>
				<h3 class="font-bold text-text-light">{m['admin.settings.title']()}</h3>
				<p class="text-sm text-text-muted">{m['admin.settings.description']()}</p>
			</div>
		</a>
		<a
			href="/admin/api-usage"
			class="flex items-center gap-4 card transition-shadow hover:shadow-lg"
		>
			<div
				class="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow/10 text-2xl text-yellow-dark"
			>
				<BarChart3 size={24} />
			</div>
			<div>
				<h3 class="font-bold text-text-light">{m['admin.apiUsage.title']()}</h3>
				<p class="text-sm text-text-muted">{m['admin.apiUsage.description']()}</p>
			</div>
		</a>
	</div>
</div>
