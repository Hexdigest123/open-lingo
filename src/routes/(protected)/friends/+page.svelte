<script lang="ts">
	import { enhance } from '$app/forms';
	import * as m from '$lib/paraglide/messages.js';
	import { Check, UserMinus, UserPlus, Users, X } from 'lucide-svelte';
	import type { ActionData, PageData } from './$types';

	let { data }: { data: PageData & { form?: ActionData } } = $props();

	type TabName = 'friends' | 'requests';
	type ToastState = { type: 'success' | 'error'; message: string } | null;

	let activeTab = $state<TabName>('friends');
	let email = $state('');
	let toast = $state<ToastState>(null);
	let sendingRequest = $state(false);
	let mutatingFriendId = $state<number | null>(null);
	let mutatingRequestId = $state<number | null>(null);

	const pendingCount = $derived(data.pendingRequests.length);

	function clearToastSoon() {
		setTimeout(() => {
			toast = null;
		}, 2500);
	}

	function resolveMessage(message: string): string {
		return (m[message as keyof typeof m] as unknown as () => string)?.() ?? message;
	}

	function readActionError(value: unknown, key: string): string | undefined {
		if (!value || typeof value !== 'object') {
			return undefined;
		}

		const maybeMessage = (value as Record<string, unknown>)[key];
		return typeof maybeMessage === 'string' ? maybeMessage : undefined;
	}
</script>

<svelte:head>
	<title>{m['friends.title']()} - OpenLingo</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col gap-4 card sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold text-text-light">{m['friends.title']()}</h1>
			<p class="text-text-muted">{m['friends.subtitle']()}</p>
		</div>
		<div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
			<Users size={22} />
		</div>
	</div>

	<div class="card">
		<h2 class="mb-3 flex items-center gap-2 text-lg font-bold text-text-light">
			<UserPlus size={18} />
			{m['friends.addFriend']()}
		</h2>
		<form
			method="POST"
			action="?/sendRequest"
			use:enhance={() => {
				sendingRequest = true;

				return async ({ result, update }) => {
					sendingRequest = false;
					if (result.type === 'success') {
						email = '';
						toast = { type: 'success', message: m['friends.requestSent']() };
						clearToastSoon();
					} else if (result.type === 'failure') {
						const errorMessage = readActionError(result.data, 'sendRequestError');
						toast = {
							type: 'error',
							message: resolveMessage(errorMessage ?? 'Failed to send request')
						};
						clearToastSoon();
					}

					await update();
				};
			}}
			class="flex flex-col gap-3 sm:flex-row"
		>
			<input
				type="email"
				name="email"
				bind:value={email}
				required
				class="input flex-1"
				placeholder={m['friends.emailPlaceholder']()}
			/>
			<button
				type="submit"
				class="btn btn-primary btn-md"
				disabled={sendingRequest || !email.trim()}
			>
				{#if sendingRequest}
					{m['common.loading']()}
				{:else}
					{m['friends.sendRequest']()}
				{/if}
			</button>
		</form>
	</div>

	<div class="card">
		<div class="mb-5 flex gap-2 rounded-xl bg-bg-light-secondary p-1">
			<button
				type="button"
				onclick={() => (activeTab = 'friends')}
				class="flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors {activeTab ===
				'friends'
					? 'bg-bg-light text-primary shadow'
					: 'text-text-muted'}"
			>
				{m['friends.tabs.friends']()}
			</button>
			<button
				type="button"
				onclick={() => (activeTab = 'requests')}
				class="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors {activeTab ===
				'requests'
					? 'bg-bg-light text-primary shadow'
					: 'text-text-muted'}"
			>
				<span>{m['friends.tabs.requests']()}</span>
				{#if pendingCount > 0}
					<span class="rounded-full bg-error px-2 py-0.5 text-xs font-semibold text-white">
						{pendingCount}
					</span>
				{/if}
			</button>
		</div>

		{#if activeTab === 'friends'}
			{#if data.friends.length === 0}
				<div
					class="rounded-xl border border-dashed border-border-light p-8 text-center text-text-muted"
				>
					{m['friends.noFriends']()}
				</div>
			{:else}
				<div class="space-y-3">
					{#each data.friends as friend}
						<div
							class="flex flex-col gap-3 rounded-xl border border-border-light p-4 sm:flex-row sm:items-center sm:justify-between"
						>
							<div class="flex items-center gap-3">
								{#if friend.avatarUrl}
									<img
										src={friend.avatarUrl}
										alt={friend.displayName}
										class="h-10 w-10 rounded-full object-cover"
									/>
								{:else}
									<div
										class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary"
									>
										{friend.displayName.charAt(0).toUpperCase()}
									</div>
								{/if}
								<div>
									<p class="font-semibold text-text-light">{friend.displayName}</p>
									<p class="text-sm text-text-muted">{friend.xpTotal} XP</p>
								</div>
							</div>

							<form
								method="POST"
								action="?/removeFriend"
								use:enhance={({ formData }) => {
									mutatingFriendId = Number.parseInt(
										formData.get('friendId')?.toString() ?? '',
										10
									);

									return async ({ result, update }) => {
										if (result.type === 'failure') {
											const errorMessage = readActionError(result.data, 'removeFriendError');
											toast = {
												type: 'error',
												message: errorMessage ?? 'Failed to remove friend'
											};
											clearToastSoon();
										}

										mutatingFriendId = null;
										await update();
									};
								}}
							>
								<input type="hidden" name="friendId" value={friend.friendId} />
								<button
									type="submit"
									class="btn btn-ghost btn-md text-error"
									disabled={mutatingFriendId === friend.friendId}
								>
									<UserMinus size={16} />
									<span>{m['friends.remove']()}</span>
								</button>
							</form>
						</div>
					{/each}
				</div>
			{/if}
		{:else if data.pendingRequests.length === 0}
			<div
				class="rounded-xl border border-dashed border-border-light p-8 text-center text-text-muted"
			>
				{m['friends.noRequests']()}
			</div>
		{:else}
			<div class="space-y-3">
				{#each data.pendingRequests as request}
					<div
						class="flex flex-col gap-3 rounded-xl border border-border-light p-4 sm:flex-row sm:items-center sm:justify-between"
					>
						<div class="flex items-center gap-3">
							{#if request.avatarUrl}
								<img
									src={request.avatarUrl}
									alt={request.displayName}
									class="h-10 w-10 rounded-full object-cover"
								/>
							{:else}
								<div
									class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary"
								>
									{request.displayName.charAt(0).toUpperCase()}
								</div>
							{/if}
							<p class="font-semibold text-text-light">{request.displayName}</p>
						</div>

						<div class="flex gap-2">
							<form
								method="POST"
								action="?/acceptRequest"
								use:enhance={({ formData }) => {
									mutatingRequestId = Number.parseInt(
										formData.get('friendshipId')?.toString() ?? '',
										10
									);

									return async ({ result, update }) => {
										if (result.type === 'failure') {
											const errorMessage = readActionError(result.data, 'acceptRequestError');
											toast = {
												type: 'error',
												message: errorMessage ?? 'Failed to accept request'
											};
											clearToastSoon();
										}

										mutatingRequestId = null;
										await update();
									};
								}}
							>
								<input type="hidden" name="friendshipId" value={request.friendshipId} />
								<button
									type="submit"
									class="btn btn-success btn-md"
									disabled={mutatingRequestId === request.friendshipId}
								>
									<Check size={16} />
									<span>{m['friends.accept']()}</span>
								</button>
							</form>

							<form
								method="POST"
								action="?/rejectRequest"
								use:enhance={({ formData }) => {
									mutatingRequestId = Number.parseInt(
										formData.get('friendshipId')?.toString() ?? '',
										10
									);

									return async ({ result, update }) => {
										if (result.type === 'failure') {
											const errorMessage = readActionError(result.data, 'rejectRequestError');
											toast = {
												type: 'error',
												message: errorMessage ?? 'Failed to reject request'
											};
											clearToastSoon();
										}

										mutatingRequestId = null;
										await update();
									};
								}}
							>
								<input type="hidden" name="friendshipId" value={request.friendshipId} />
								<button
									type="submit"
									class="btn btn-ghost btn-md text-error"
									disabled={mutatingRequestId === request.friendshipId}
								>
									<X size={16} />
									<span>{m['friends.reject']()}</span>
								</button>
							</form>
						</div>
					</div>
				{/each}
			</div>
		{/if}
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
