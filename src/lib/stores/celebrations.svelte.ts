export type CelebrationType =
	| 'first_correct_today'
	| 'achievement'
	| 'streak_milestone'
	| 'level_up'
	| 'combo';

export interface Celebration {
	id: string;
	type: CelebrationType;
	title: string;
	message?: string;
	value?: number;
}

let celebrations = $state<Celebration[]>([]);
let active = $state<Celebration | null>(null);

function generateId(): string {
	return Math.random().toString(36).substring(2, 9);
}

export function queueCelebration(celebration: Omit<Celebration, 'id'>): void {
	const entry: Celebration = { ...celebration, id: generateId() };
	celebrations = [...celebrations, entry];

	if (!active) {
		showNext();
	}
}

function showNext(): void {
	if (celebrations.length === 0) {
		active = null;
		return;
	}

	const [next, ...rest] = celebrations;
	active = next;
	celebrations = rest;
}

export function dismissCelebration(): void {
	active = null;
	setTimeout(showNext, 300);
}

export function getActiveCelebration(): Celebration | null {
	return active;
}

export function celebrateFirstCorrectToday(title: string, message?: string): void {
	queueCelebration({ type: 'first_correct_today', title, message });
}

export function celebrateAchievement(achievementName: string, message?: string): void {
	queueCelebration({ type: 'achievement', title: achievementName, message });
}

export function celebrateStreakMilestone(days: number, message?: string): void {
	queueCelebration({
		type: 'streak_milestone',
		title: `${days} Day Streak!`,
		message,
		value: days
	});
}

export function celebrateLevelUp(level: number, rankName?: string): void {
	const message = rankName ? `You reached ${rankName} rank!` : undefined;
	queueCelebration({ type: 'level_up', title: `Level ${level}!`, message, value: level });
}

export function celebrateCombo(multiplier: number): void {
	queueCelebration({
		type: 'combo',
		title: `${multiplier}x Combo!`,
		message: `${multiplier}x XP multiplier active!`,
		value: multiplier
	});
}
