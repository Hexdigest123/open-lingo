<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const hasContact = data.email || data.phone || data.address;
</script>

<svelte:head>
	<title>{m['legal.privacy.title']()} - OpenLingo</title>
</svelte:head>

<div class="py-12 lg:py-16">
	<div class="mx-auto max-w-3xl px-4">
		<h1 class="text-3xl font-bold text-text-light lg:text-4xl">{m['legal.privacy.title']()}</h1>

		<div class="mt-8 space-y-8 text-text-muted">
			<section>
				<h2 class="text-xl font-semibold text-text-light">{m['legal.privacy.intro.title']()}</h2>
				<p class="mt-2">{m['legal.privacy.intro.text']()}</p>
			</section>

			<section>
				<h2 class="text-xl font-semibold text-text-light">
					{m['legal.privacy.dataCollection.title']()}
				</h2>
				<p class="mt-2">{m['legal.privacy.dataCollection.text']()}</p>
				<ul class="mt-2 list-inside list-disc space-y-1">
					<li>{m['legal.privacy.dataCollection.item1']()}</li>
					<li>{m['legal.privacy.dataCollection.item2']()}</li>
					<li>{m['legal.privacy.dataCollection.item3']()}</li>
				</ul>
			</section>

			<section>
				<h2 class="text-xl font-semibold text-text-light">{m['legal.privacy.dataUse.title']()}</h2>
				<p class="mt-2">{m['legal.privacy.dataUse.text']()}</p>
			</section>

			<section>
				<h2 class="text-xl font-semibold text-text-light">{m['legal.privacy.security.title']()}</h2>
				<p class="mt-2">{m['legal.privacy.security.text']()}</p>
				<ul class="mt-2 list-inside list-disc space-y-1">
					<li>{m['legal.privacy.security.item1']()}</li>
					<li>{m['legal.privacy.security.item2']()}</li>
					<li>{m['legal.privacy.security.item3']()}</li>
					<li>{m['legal.privacy.security.item4']()}</li>
				</ul>
			</section>

			<section>
				<h2 class="text-xl font-semibold text-text-light">{m['legal.privacy.cookies.title']()}</h2>
				<p class="mt-2">{m['legal.privacy.cookies.text']()}</p>
			</section>

			<section>
				<h2 class="text-xl font-semibold text-text-light">
					{m['legal.privacy.thirdParty.title']()}
				</h2>
				<p class="mt-2">{m['legal.privacy.thirdParty.text']()}</p>
			</section>

			<section>
				<h2 class="text-xl font-semibold text-text-light">{m['legal.privacy.rights.title']()}</h2>
				<p class="mt-2">{m['legal.privacy.rights.text']()}</p>
			</section>

			{#if hasContact}
				<section>
					<h2 class="text-xl font-semibold text-text-light">
						{m['legal.privacy.contact.title']()}
					</h2>
					<p class="mt-2">{m['legal.privacy.contact.text']()}</p>
					<div class="mt-3 space-y-1">
						{#if data.companyName}
							<p class="font-medium text-text-light">{data.companyName}</p>
						{/if}
						{#if data.address}
							<p class="whitespace-pre-line">{data.address}</p>
						{/if}
						{#if data.email}
							<p>
								{m['legal.imprint.email']()}:
								<a href="mailto:{data.email}" class="text-primary hover:underline">{data.email}</a>
							</p>
						{/if}
						{#if data.phone}
							<p>
								{m['legal.imprint.phone']()}:
								<a href="tel:{data.phone}" class="text-primary hover:underline">{data.phone}</a>
							</p>
						{/if}
					</div>
				</section>
			{/if}
		</div>
	</div>
</div>
