<script lang="ts">
	interface Props {
		role: 'user' | 'assistant' | 'system';
		content: string;
	}

	let { role, content }: Props = $props();

	const isUser = $derived(role === 'user');
</script>

<div class="flex gap-3 {isUser ? 'flex-row-reverse' : ''}">
	<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full {isUser ? 'bg-success text-white' : 'bg-primary text-white'}">
		{isUser ? '👤' : '🤖'}
	</div>
	<div class="max-w-[80%] rounded-2xl px-4 py-3 {isUser ? 'bg-success text-white' : 'bg-bg-light-secondary text-text-light'}">
		<p class="whitespace-pre-wrap">{content}</p>
	</div>
</div>
