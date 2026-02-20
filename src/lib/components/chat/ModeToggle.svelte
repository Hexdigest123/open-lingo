<script lang="ts">
	import { t } from '$lib/i18n/index.svelte';
	import { MessageCircle, Mic } from 'lucide-svelte';

	interface Props {
		mode: 'voice' | 'text';
		onModeChange: (mode: 'voice' | 'text') => void;
		disabled?: boolean;
	}

	let { mode, onModeChange, disabled = false }: Props = $props();
</script>

<div class="flex items-center gap-2 rounded-xl bg-bg-light-secondary p-1">
	<button
		onclick={() => onModeChange('text')}
		{disabled}
		class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors
			{mode === 'text' ? 'bg-white text-success shadow-sm' : 'text-text-muted hover:text-text-light'}
			{disabled ? 'cursor-not-allowed opacity-50' : ''}"
	>
		<MessageCircle size={16} />
		<span>{t('chat.textMode')}</span>
	</button>
	<button
		onclick={() => onModeChange('voice')}
		{disabled}
		class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors
			{mode === 'voice' ? 'bg-white text-primary shadow-sm' : 'text-text-muted hover:text-text-light'}
			{disabled ? 'cursor-not-allowed opacity-50' : ''}"
	>
		<Mic size={16} />
		<span>{t('chat.voiceMode')}</span>
	</button>
</div>
