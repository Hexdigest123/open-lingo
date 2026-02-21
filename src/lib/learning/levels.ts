export type Rank = {
	name: string;
	minXp: number;
	maxXp: number;
	color: string;
};

export type LevelProgress = {
	level: number;
	currentXp: number;
	nextLevelXp: number;
	progress: number;
};

const XP_PER_LEVEL = 100;

export const RANKS: Rank[] = [
	{ name: 'Bronze', minXp: 0, maxXp: 499, color: '#cd7f32' },
	{ name: 'Silver', minXp: 500, maxXp: 1999, color: '#c0c0c0' },
	{ name: 'Gold', minXp: 2000, maxXp: 4999, color: '#ffd700' },
	{ name: 'Platinum', minXp: 5000, maxXp: 9999, color: '#e5e4e2' },
	{ name: 'Diamond', minXp: 10000, maxXp: 24999, color: '#b9f2ff' },
	{ name: 'Master', minXp: 25000, maxXp: Infinity, color: '#ff6b6b' }
];

export function getLevelFromXp(xp: number): number {
	const safeXp = Math.max(0, xp);
	return Math.floor(safeXp / XP_PER_LEVEL) + 1;
}

export function getXpForLevel(level: number): number {
	const safeLevel = Math.max(1, Math.floor(level));
	return (safeLevel - 1) * XP_PER_LEVEL;
}

export function getXpProgress(xp: number): LevelProgress {
	const safeXp = Math.max(0, xp);
	const level = getLevelFromXp(safeXp);
	const levelStartXp = getXpForLevel(level);
	const nextLevelXp = getXpForLevel(level + 1);
	const currentXp = safeXp - levelStartXp;
	const progress = currentXp / XP_PER_LEVEL;

	return {
		level,
		currentXp,
		nextLevelXp,
		progress
	};
}

export function getRankFromXp(xp: number): Rank {
	const safeXp = Math.max(0, xp);

	for (const rank of RANKS) {
		if (safeXp >= rank.minXp && safeXp <= rank.maxXp) {
			return rank;
		}
	}

	return RANKS[RANKS.length - 1];
}
