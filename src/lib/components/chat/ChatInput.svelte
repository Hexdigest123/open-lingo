<script lang="ts">
	import { t } from '$lib/i18n/index.svelte';

	interface Props {
		onSend: (message: string) => void;
		disabled: boolean;
		placeholder?: string;
	}

	let { onSend, disabled, placeholder }: Props = $props();

	let message = $state('');

	function handleSubmit() {
		if (!message.trim() || disabled) return;
		onSend(message.trim());
		message = '';
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	}
</script>

<div class="flex gap-3">
	<textarea
		bind:value={message}
		onkeydown={handleKeydown}
		{placeholder}
		{disabled}
		rows="1"
		class="input flex-1 resize-none"
		style="min-height: 48px; max-height: 120px;"
	></textarea>
	<button
		onclick={handleSubmit}
		disabled={disabled || !message.trim()}
		class="btn btn-success btn-md shrink-0"
	>
		{t('chat.send')}
	</button>
</div>
