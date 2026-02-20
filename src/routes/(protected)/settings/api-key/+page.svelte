<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import type { PageData, ActionData } from './$types';
import { enhance } from '$app/forms';
	import { Eye, EyeOff } from 'lucide-svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let showKey = $state(false);
	let apiKey = $state('');
</script>

<svelte:head>
	<title>{m["settings.apiKey.title"]()} - OpenLingo</title>
</svelte:head>

<div class="mx-auto max-w-2xl space-y-6">
	<div>
		<a href="/settings" class="text-primary hover:underline">&larr; {m["common.back"]()}</a>
	</div>

	<div class="card">
		<h1 class="text-2xl font-bold text-text-light">{m["settings.apiKey.title"]()}</h1>
		<p class="mt-2 text-text-muted">{m["settings.apiKey.description"]()}</p>

		<!-- Status -->
		<div class="mt-4 flex items-center gap-2">
			{#if data.hasApiKey}
				<span
					class="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-sm text-success"
				>
					<span>✓</span>
					{m["settings.apiKey.status.configured"]()}
				</span>
			{:else}
				<span class="flex items-center gap-2 rounded-full bg-error/10 px-3 py-1 text-sm text-error">
					<span>✗</span>
					{m["settings.apiKey.status.notConfigured"]()}
				</span>
			{/if}
		</div>

		<!-- Success/Error Messages -->
		{#if form?.success}
			<div class="mt-4 rounded-xl bg-success/10 p-4 text-success">
				{form.message}
			</div>
		{/if}
		{#if form?.error}
			<div class="mt-4 rounded-xl bg-error/10 p-4 text-error">
				{form.error}
			</div>
		{/if}

		<!-- Save Form -->
		<form method="POST" action="?/save" use:enhance class="mt-6 space-y-4">
			<div>
				<label for="apiKey" class="block text-sm font-medium text-text-light">
					{m["settings.apiKey.title"]()}
				</label>
				<div class="relative mt-1">
					<input
						type={showKey ? 'text' : 'password'}
						id="apiKey"
						name="apiKey"
						bind:value={apiKey}
						placeholder={m["settings.apiKey.placeholder"]()}
						class="input pr-12"
					/>
					<button
						type="button"
						onclick={() => (showKey = !showKey)}
						class="absolute top-1/2 right-3 -translate-y-1/2 text-text-muted hover:text-text-light"
					>
						{#if showKey}<EyeOff size={18} />{:else}<Eye size={18} />{/if}
					</button>
				</div>
			</div>

			<div class="flex gap-4">
				<button type="submit" class="btn btn-success btn-md" disabled={!apiKey}>
					{m["settings.apiKey.save"]()}
				</button>
			</div>
		</form>

		<!-- Remove Form -->
		{#if data.hasApiKey}
			<form
				method="POST"
				action="?/remove"
				use:enhance
				class="mt-4 border-t border-border-light pt-4"
			>
				<button type="submit" class="btn btn-error btn-sm">
					{m["settings.apiKey.remove"]()}
				</button>
			</form>
		{/if}

		<!-- Help Link -->
		<div class="mt-6 border-t border-border-light pt-4">
			<a
				href="https://platform.openai.com/api-keys"
				target="_blank"
				rel="noopener noreferrer"
				class="text-primary hover:underline"
			>
				{m["settings.apiKey.getKey"]()} →
			</a>
		</div>
	</div>
</div>
