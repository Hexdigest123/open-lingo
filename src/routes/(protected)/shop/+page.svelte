<script lang="ts">
	import { enhance } from '$app/forms';
	import { getLocale } from '$lib/paraglide/runtime.js';
	import * as m from '$lib/paraglide/messages.js';
	import { Gem } from 'lucide-svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	type ToastState = { type: 'success' | 'error'; message: string } | null;

	const oneTimeItemKeys = new Set(['xp_boost']);

	let gemBalance = $state(0);
	let toast = $state<ToastState>(null);
	let isPurchasingItemId = $state<number | null>(null);
	let gemDeduction = $state<number | null>(null);

	const locale = $derived(getLocale());
	const purchaseCounts = $derived.by(() => {
		const counts = new Map<number, number>();

		for (const entry of data.purchases) {
			const existing = counts.get(entry.item.id) ?? 0;
			counts.set(entry.item.id, existing + 1);
		}

		return counts;
	});

	$effect(() => {
		gemBalance = data.gems;
	});

	function getItemTitle(item: (typeof data.items)[number]): string {
		return locale === 'de' ? item.titleDe : item.titleEn;
	}

	function getItemDescription(item: (typeof data.items)[number]): string {
		return locale === 'de'
			? (item.descriptionDe ?? item.descriptionEn ?? '')
			: (item.descriptionEn ?? item.descriptionDe ?? '');
	}

	function isOneTimeItem(item: (typeof data.items)[number]): boolean {
		return oneTimeItemKeys.has(item.key);
	}

	function isPurchased(item: (typeof data.items)[number]): boolean {
		return (purchaseCounts.get(item.id) ?? 0) > 0;
	}

	function clearToastSoon() {
		setTimeout(() => {
			toast = null;
		}, 2500);
	}

	function clearGemDeductionSoon() {
		setTimeout(() => {
			gemDeduction = null;
		}, 1000);
	}

	function readPurchaseError(value: unknown): string | undefined {
		if (!value || typeof value !== 'object') {
			return undefined;
		}

		const maybeMessage = (value as Record<string, unknown>).purchaseError;
		return typeof maybeMessage === 'string' ? maybeMessage : undefined;
	}
</script>

<svelte:head>
	<title>{m['shop.title']()} - OpenLingo</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col gap-4 card sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold text-text-light">{m['shop.title']()}</h1>
			<p class="text-text-muted">{m['shop.subtitle']()}</p>
		</div>
		<div class="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3">
			<div class="text-sm text-text-muted">
				{m['shop.gemBalance']({ count: String(gemBalance) })}
			</div>
			<div class="mt-1 flex items-center gap-2 text-xl font-bold text-primary">
				<Gem size={20} />
				<span class:animate-pulse={gemDeduction !== null}>{gemBalance}</span>
				{#if gemDeduction !== null}
					<span class="animate-fade-up text-sm font-semibold text-error">-{gemDeduction}</span>
				{/if}
			</div>
		</div>
	</div>

	{#if form?.purchaseError}
		<div class="rounded-xl bg-error/10 p-3 text-error">
			{typeof form.purchaseError === 'string' && form.purchaseError === 'Insufficient gems'
				? m['shop.insufficientGems']()
				: form.purchaseError}
		</div>
	{/if}

	<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
		{#each data.items as item}
			{@const oneTime = isOneTimeItem(item)}
			{@const purchased = isPurchased(item)}
			{@const insufficientGems = gemBalance < item.costGems}
			{@const isDisabled =
				isPurchasingItemId === item.id || insufficientGems || (oneTime && purchased)}
			<div class="flex h-full flex-col card border border-border-light">
				<div class="mb-4 flex items-start justify-between gap-3">
					<div class="flex items-center gap-3">
						<div
							class="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg bg-primary/10 text-primary"
						>
							{#if item.iconUrl}
								<img
									src={item.iconUrl}
									alt={getItemTitle(item)}
									class="h-full w-full object-cover"
								/>
							{:else}
								<Gem size={20} />
							{/if}
						</div>
						<div>
							<h2 class="font-bold text-text-light">{getItemTitle(item)}</h2>
							<p class="text-xs text-text-muted">
								{m['shop.cost']({ cost: String(item.costGems) })}
							</p>
						</div>
					</div>
				</div>

				<p class="mb-5 flex-1 text-sm text-text-muted">{getItemDescription(item)}</p>

				<form
					method="POST"
					action="?/purchase"
					use:enhance={({ formData }) => {
						const currentItemId = Number.parseInt(formData.get('itemId')?.toString() ?? '', 10);
						isPurchasingItemId = currentItemId;

						return async ({ result, update }) => {
							if (result.type === 'success') {
								gemBalance = Math.max(0, gemBalance - item.costGems);
								gemDeduction = item.costGems;
								toast = { type: 'success', message: m['shop.purchaseSuccess']() };
								clearGemDeductionSoon();
								clearToastSoon();
							} else if (result.type === 'failure') {
								const errorMessage = readPurchaseError(result.data);
								toast = {
									type: 'error',
									message:
										errorMessage === 'Insufficient gems'
											? m['shop.insufficientGems']()
											: (errorMessage ?? 'Purchase failed')
								};
								clearToastSoon();
							}

							isPurchasingItemId = null;
							await update();
						};
					}}
				>
					<input type="hidden" name="itemId" value={item.id} />
					<button type="submit" class="btn btn-primary btn-md w-full" disabled={isDisabled}>
						{#if isPurchasingItemId === item.id}
							{m['common.loading']()}
						{:else if oneTime && purchased}
							{m['shop.purchased']()}
						{:else if insufficientGems}
							{m['shop.insufficientGems']()}
						{:else}
							{m['shop.buy']()}
						{/if}
					</button>
				</form>
			</div>
		{/each}
	</div>

	{#if toast}
		<div
			class="fixed right-4 bottom-4 z-50 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg {toast.type ===
			'success'
				? 'bg-success'
				: 'bg-error'}"
		>
			{toast.message}
		</div>
	{/if}
</div>

<style>
	@keyframes fade-up {
		from {
			opacity: 0;
			transform: translateY(6px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-up {
		animation: fade-up 220ms ease-out;
	}
</style>
