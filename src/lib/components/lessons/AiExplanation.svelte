<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
import { Bot } from 'lucide-svelte';

	interface Props {
		explanation: string | null;
		isLoading: boolean;
		error: string | null;
	}

	let { explanation, isLoading, error }: Props = $props();
</script>

{#if isLoading}
	<div class="mt-4 rounded-xl bg-primary/10 p-4">
		<div class="flex items-center gap-3">
			<div
				class="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"
			></div>
			<span class="text-sm text-primary">{m["lesson.explaining"]()}</span>
		</div>
	</div>
{:else if error}
	<div class="mt-4 rounded-xl bg-error/10 p-4">
		<p class="text-sm text-error">{error}</p>
	</div>
{:else if explanation}
	<div class="mt-4 rounded-xl bg-primary/10 p-4">
		<div class="mb-2 flex items-center gap-2">
			<Bot size={20} class="text-primary" />
			<span class="font-medium text-primary">{m["lesson.explanation.title"]()}</span>
		</div>
		<p class="text-sm leading-relaxed text-text-light">{explanation}</p>
	</div>
{/if}
