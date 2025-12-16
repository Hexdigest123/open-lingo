<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { form, data }: { form: ActionData; data: PageData } = $props();

	let loading = $state(false);
</script>

<svelte:head>
	<title>Log in - OpenLingo</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
	<div class="w-full max-w-md">
		<div class="text-center">
			<h1 class="text-3xl font-bold text-text-light">Welcome back!</h1>
			<p class="mt-2 text-text-muted">Log in to continue your learning journey</p>
		</div>

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
			{#if data.redirect}
				<input type="hidden" name="redirect" value={data.redirect} />
			{/if}

			{#if form?.error}
				<div class="rounded-xl bg-error/10 p-4 text-center text-error">
					{form.error}
				</div>
			{/if}

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

			<div>
				<label for="password" class="mb-2 block font-medium text-text-light">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					required
					class="input"
					placeholder="Your password"
					minlength="8"
				/>
			</div>

			<button type="submit" class="btn btn-success btn-lg w-full" disabled={loading}>
				{#if loading}
					Logging in...
				{:else}
					Log in
				{/if}
			</button>
		</form>

		<p class="mt-6 text-center text-text-muted">
			Don't have an account?
			<a href="/register" class="font-medium text-primary hover:underline">Sign up</a>
		</p>
	</div>
</div>
