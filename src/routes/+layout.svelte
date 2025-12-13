<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import type { Snippet } from 'svelte';
	import { i18n } from '$lib/i18n/index.svelte';
	import { onMount } from 'svelte';

	let { children }: { children: Snippet } = $props();

	onMount(() => {
		i18n.init();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

{@render children()}
