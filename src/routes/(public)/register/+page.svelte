<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { form, data }: { form: ActionData; data: PageData } = $props();

	let loading = $state(false);

	// Get signup mode from server data or form response
	const signupMode = $derived(form?.signupMode ?? data.signupMode);
	const requiresInvite = $derived(signupMode === 'invitation');
	const requiresApproval = $derived(signupMode === 'approval');
</script>

<svelte:head>
	<title>Sign up - OpenLingo</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
	<div class="w-full max-w-md">
		<div class="text-center">
			<h1 class="text-3xl font-bold text-text-light">Create your account</h1>
			<p class="mt-2 text-text-muted">Start learning Spanish for free</p>
		</div>

		{#if requiresApproval}
			<div class="mt-4 rounded-xl bg-primary/10 p-4 text-center text-sm text-primary">
				New accounts require administrator approval before you can start learning.
			</div>
		{/if}

		{#if data.domainRestricted}
			<div class="mt-4 rounded-xl bg-yellow/10 p-4 text-center text-sm text-yellow-dark">
				Registration is restricted to: {data.allowedDomains.join(', ')}
			</div>
		{/if}

		<form
			method="POST"
			class="mt-8 space-y-6"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					loading = false;
					await update();
				};
			}}
		>
			{#if form?.error}
				<div class="rounded-xl bg-error/10 p-4 text-center text-error">
					{form.error}
				</div>
			{/if}

			<div>
				<label for="displayName" class="mb-2 block font-medium text-text-light">Display name</label>
				<input
					type="text"
					id="displayName"
					name="displayName"
					required
					class="input"
					placeholder="How should we call you?"
					value={form?.displayName ?? ''}
					minlength="2"
					maxlength="50"
				/>
			</div>

			<div>
				<label for="email" class="mb-2 block font-medium text-text-light">Email</label>
				<input
					type="email"
					id="email"
					name="email"
					required
					class="input"
					placeholder="you@example.com"
					value={form?.email ?? ''}
				/>
			</div>

			{#if requiresInvite}
				<div>
					<label for="inviteCode" class="mb-2 block font-medium text-text-light">
						Invitation code
						<span class="text-error">*</span>
					</label>
					<input
						type="text"
						id="inviteCode"
						name="inviteCode"
						required
						class="input"
						placeholder="Enter your invitation code"
						value={data.inviteCode}
						readonly={!!data.inviteCode}
					/>
					{#if data.inviteCode}
						<p class="mt-1 text-sm text-success">
							Invitation code applied
						</p>
					{:else}
						<p class="mt-1 text-sm text-text-muted">
							Contact an administrator to get an invitation code
						</p>
					{/if}
				</div>
			{/if}

			<div>
				<label for="password" class="mb-2 block font-medium text-text-light">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					required
					class="input"
					placeholder="At least 8 characters"
					minlength="8"
				/>
				<p class="mt-1 text-sm text-text-muted">Must be at least 8 characters</p>
			</div>

			<div>
				<label for="confirmPassword" class="mb-2 block font-medium text-text-light"
					>Confirm password</label
				>
				<input
					type="password"
					id="confirmPassword"
					name="confirmPassword"
					required
					class="input"
					placeholder="Confirm your password"
					minlength="8"
				/>
			</div>

			<button type="submit" class="btn btn-success btn-lg w-full" disabled={loading}>
				{#if loading}
					Creating account...
				{:else if requiresApproval}
					Request account
				{:else}
					Create account
				{/if}
			</button>
		</form>

		<p class="mt-6 text-center text-text-muted">
			Already have an account?
			<a href="/login" class="font-medium text-primary hover:underline">Log in</a>
		</p>

		<p class="mt-4 text-center text-sm text-text-muted">
			By signing up, you agree to our Terms of Service and Privacy Policy.
		</p>
	</div>
</div>
