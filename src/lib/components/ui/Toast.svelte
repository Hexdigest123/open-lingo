<script lang="ts">
	import {
		getNotifications,
		dismissNotification,
		type Notification
	} from '$lib/stores/notifications.svelte';

	const notifications = $derived(getNotifications());

	function getNotificationStyles(type: Notification['type']): string {
		switch (type) {
			case 'success':
				return 'bg-success/10 border-success text-success';
			case 'error':
				return 'bg-error/10 border-error text-error';
			case 'achievement':
				return 'bg-yellow/10 border-yellow text-yellow-dark';
			case 'streak':
				return 'bg-orange/10 border-orange text-orange-dark';
			case 'freeze':
				return 'bg-primary/10 border-primary text-primary';
			case 'xp':
				return 'bg-yellow/10 border-yellow text-yellow-dark';
			default:
				return 'bg-bg-light-secondary border-border-light text-text-light';
		}
	}

	function getAnimationClass(notification: Notification): string {
		if (notification.dismissing) {
			return 'animate-slide-out-right';
		}
		if (notification.type === 'achievement') {
			return 'animate-achievement-unlock';
		}
		if (notification.type === 'streak') {
			return 'animate-streak-celebrate';
		}
		if (notification.type === 'freeze') {
			return 'animate-freeze-earned';
		}
		return 'animate-slide-in-right';
	}
</script>

{#if notifications.length > 0}
	<div class="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
		{#each notifications as notification (notification.id)}
			<div
				class="pointer-events-auto flex items-start gap-3 p-4 rounded-xl border-2 shadow-lg {getNotificationStyles(
					notification.type
				)} {getAnimationClass(notification)}"
			>
				{#if notification.icon}
					<span class="text-2xl flex-shrink-0">{notification.icon}</span>
				{/if}
				<div class="flex-1 min-w-0">
					<h4 class="font-bold">{notification.title}</h4>
					{#if notification.message}
						<p class="text-sm opacity-80 mt-0.5">{notification.message}</p>
					{/if}
				</div>
				<button
					onclick={() => dismissNotification(notification.id)}
					class="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
					aria-label="Dismiss notification"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
			</div>
		{/each}
	</div>
{/if}
