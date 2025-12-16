export type NotificationType = 'success' | 'error' | 'achievement' | 'streak' | 'freeze' | 'xp';

export interface Notification {
	id: string;
	type: NotificationType;
	title: string;
	message?: string;
	icon?: string;
	duration?: number;
	dismissing?: boolean;
}

let notifications = $state<Notification[]>([]);

function generateId(): string {
	return Math.random().toString(36).substring(2, 9);
}

export function showNotification(notification: Omit<Notification, 'id'>): string {
	const id = generateId();
	const newNotification: Notification = {
		...notification,
		id,
		duration: notification.duration ?? 4000
	};

	notifications = [...notifications, newNotification];

	// Auto-dismiss after duration
	if (newNotification.duration && newNotification.duration > 0) {
		setTimeout(() => {
			dismissNotification(id);
		}, newNotification.duration);
	}

	return id;
}

export function dismissNotification(id: string): void {
	// First mark as dismissing for animation
	notifications = notifications.map((n) => (n.id === id ? { ...n, dismissing: true } : n));

	// Then remove after animation
	setTimeout(() => {
		notifications = notifications.filter((n) => n.id !== id);
	}, 300);
}

export function clearAllNotifications(): void {
	notifications = [];
}

export function getNotifications(): Notification[] {
	return notifications;
}

// Convenience functions for specific notification types
export function showAchievement(title: string, message?: string): string {
	return showNotification({
		type: 'achievement',
		title,
		message,
		icon: '🏆',
		duration: 5000
	});
}

export function showStreakUpdate(currentStreak: number): string {
	return showNotification({
		type: 'streak',
		title: `${currentStreak} Day Streak!`,
		message: 'Keep it up!',
		icon: '🔥',
		duration: 4000
	});
}

export function showStreakFreeze(freezesRemaining: number): string {
	return showNotification({
		type: 'freeze',
		title: 'Streak Freeze Earned!',
		message: `You now have ${freezesRemaining} freeze${freezesRemaining !== 1 ? 's' : ''}`,
		icon: '❄️',
		duration: 4000
	});
}

export function showXPGain(amount: number): string {
	return showNotification({
		type: 'xp',
		title: `+${amount} XP`,
		icon: '⭐',
		duration: 2000
	});
}

export function showError(title: string, message?: string): string {
	return showNotification({
		type: 'error',
		title,
		message,
		icon: '❌',
		duration: 5000
	});
}

export function showSuccess(title: string, message?: string): string {
	return showNotification({
		type: 'success',
		title,
		message,
		icon: '✅',
		duration: 3000
	});
}
