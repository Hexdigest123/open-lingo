import { db } from '$lib/server/db';
import {
	userChallenges,
	userStats,
	weeklyChallenges,
	type ChallengeType,
	type UserChallenge,
	type WeeklyChallenge
} from '$lib/server/db/schema';
import { and, eq, gte, inArray, lte, sql } from 'drizzle-orm';

interface ChallengeTemplate {
	type: ChallengeType;
	titleEn: string;
	titleDe: string;
	descriptionEn: string;
	descriptionDe: string;
	minTarget: number;
	maxTarget: number;
	xpReward: number;
}

export interface ActiveWeeklyChallenge {
	challenge: WeeklyChallenge;
	userChallenge: UserChallenge | null;
	progress: number;
	isCompleted: boolean;
}

export interface ChallengeProgressUpdate {
	challengeId: number;
	previousProgress: number;
	newProgress: number;
	completedNow: boolean;
	xpAwarded: number;
}

const CHALLENGE_TEMPLATES: ChallengeTemplate[] = [
	{
		type: 'xp_goal',
		titleEn: 'XP Sprint',
		titleDe: 'XP Sprint',
		descriptionEn: 'Earn XP this week.',
		descriptionDe: 'Sammle diese Woche XP.',
		minTarget: 120,
		maxTarget: 260,
		xpReward: 75
	},
	{
		type: 'xp_goal',
		titleEn: 'XP Marathon',
		titleDe: 'XP Marathon',
		descriptionEn: 'Push your total XP gain for the week.',
		descriptionDe: 'Steigere deinen gesamten XP-Gewinn diese Woche.',
		minTarget: 280,
		maxTarget: 450,
		xpReward: 110
	},
	{
		type: 'correct_answers',
		titleEn: 'Accuracy Focus',
		titleDe: 'Genauigkeit im Fokus',
		descriptionEn: 'Get correct answers during lessons.',
		descriptionDe: 'Gib richtige Antworten in Lektionen.',
		minTarget: 60,
		maxTarget: 140,
		xpReward: 80
	},
	{
		type: 'correct_answers',
		titleEn: 'Answer Streak',
		titleDe: 'Antwort-Serie',
		descriptionEn: 'Stack up a high number of correct answers.',
		descriptionDe: 'Sammle viele richtige Antworten.',
		minTarget: 150,
		maxTarget: 250,
		xpReward: 120
	},
	{
		type: 'lessons_completed',
		titleEn: 'Lesson Climber',
		titleDe: 'Lektions-Kletterer',
		descriptionEn: 'Complete lessons this week.',
		descriptionDe: 'Schliesse diese Woche Lektionen ab.',
		minTarget: 6,
		maxTarget: 14,
		xpReward: 90
	},
	{
		type: 'lessons_completed',
		titleEn: 'Path Progress',
		titleDe: 'Pfad-Fortschritt',
		descriptionEn: 'Advance by finishing multiple lessons.',
		descriptionDe: 'Komme voran, indem du mehrere Lektionen abschliesst.',
		minTarget: 15,
		maxTarget: 24,
		xpReward: 130
	},
	{
		type: 'perfect_lessons',
		titleEn: 'Perfect Run',
		titleDe: 'Perfekter Lauf',
		descriptionEn: 'Finish lessons with perfect accuracy.',
		descriptionDe: 'Beende Lektionen mit perfekter Genauigkeit.',
		minTarget: 2,
		maxTarget: 6,
		xpReward: 95
	},
	{
		type: 'perfect_lessons',
		titleEn: 'Flawless Week',
		titleDe: 'Fehlerfreie Woche',
		descriptionEn: 'Achieve several perfect lesson results.',
		descriptionDe: 'Erreiche mehrere perfekte Lektionsergebnisse.',
		minTarget: 7,
		maxTarget: 12,
		xpReward: 140
	},
	{
		type: 'review_sessions',
		titleEn: 'Review Rhythm',
		titleDe: 'Review-Rhythmus',
		descriptionEn: 'Complete review sessions this week.',
		descriptionDe: 'Absolviere diese Woche Wiederholungseinheiten.',
		minTarget: 4,
		maxTarget: 10,
		xpReward: 85
	},
	{
		type: 'review_sessions',
		titleEn: 'Memory Builder',
		titleDe: 'Gedächtnis-Booster',
		descriptionEn: 'Keep your memory sharp with review sessions.',
		descriptionDe: 'Halte dein Gedächtnis mit Wiederholungen scharf.',
		minTarget: 11,
		maxTarget: 20,
		xpReward: 125
	}
];

function getCurrentWeekRange(): { weekStart: Date; weekEnd: Date } {
	const now = new Date();
	const weekStart = new Date(now);
	const day = weekStart.getDay();
	const offset = day === 0 ? -6 : 1 - day;
	weekStart.setDate(weekStart.getDate() + offset);
	weekStart.setHours(0, 0, 0, 0);

	const weekEnd = new Date(weekStart);
	weekEnd.setDate(weekEnd.getDate() + 6);
	weekEnd.setHours(23, 59, 59, 999);

	return { weekStart, weekEnd };
}

function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandomTemplates(count: number): ChallengeTemplate[] {
	const shuffled = [...CHALLENGE_TEMPLATES].sort(() => Math.random() - 0.5);
	return shuffled.slice(0, count);
}

export async function getActiveWeeklyChallenges(userId: number): Promise<ActiveWeeklyChallenge[]> {
	const now = new Date();

	const rows = await db
		.select({
			challenge: weeklyChallenges,
			userChallenge: userChallenges
		})
		.from(weeklyChallenges)
		.leftJoin(
			userChallenges,
			and(eq(userChallenges.challengeId, weeklyChallenges.id), eq(userChallenges.userId, userId))
		)
		.where(and(lte(weeklyChallenges.weekStart, now), gte(weeklyChallenges.weekEnd, now)));

	return rows.map((row) => ({
		challenge: row.challenge,
		userChallenge: row.userChallenge,
		progress: row.userChallenge?.progress ?? 0,
		isCompleted: row.userChallenge?.completedAt !== null
	}));
}

export async function ensureUserChallenges(
	userId: number,
	challengeIds: number[]
): Promise<UserChallenge[]> {
	if (challengeIds.length === 0) {
		return [];
	}

	await db
		.insert(userChallenges)
		.values(challengeIds.map((challengeId) => ({ userId, challengeId })))
		.onConflictDoNothing({ target: [userChallenges.userId, userChallenges.challengeId] });

	return db
		.select()
		.from(userChallenges)
		.where(
			and(eq(userChallenges.userId, userId), inArray(userChallenges.challengeId, challengeIds))
		);
}

export async function updateChallengeProgress(
	userId: number,
	type: ChallengeType,
	incrementBy: number
): Promise<ChallengeProgressUpdate[]> {
	if (incrementBy <= 0) {
		return [];
	}

	const now = new Date();
	const activeChallengeRows = await db
		.select({ challengeId: weeklyChallenges.id })
		.from(weeklyChallenges)
		.where(
			and(
				eq(weeklyChallenges.type, type),
				lte(weeklyChallenges.weekStart, now),
				gte(weeklyChallenges.weekEnd, now)
			)
		);

	const challengeIds = activeChallengeRows.map((row) => row.challengeId);
	if (challengeIds.length === 0) {
		return [];
	}

	await ensureUserChallenges(userId, challengeIds);

	const rows = await db
		.select({
			challenge: weeklyChallenges,
			userChallenge: userChallenges
		})
		.from(weeklyChallenges)
		.innerJoin(userChallenges, eq(userChallenges.challengeId, weeklyChallenges.id))
		.where(
			and(
				eq(userChallenges.userId, userId),
				eq(weeklyChallenges.type, type),
				lte(weeklyChallenges.weekStart, now),
				gte(weeklyChallenges.weekEnd, now)
			)
		);

	let totalXpAwarded = 0;
	const updates: ChallengeProgressUpdate[] = [];

	for (const row of rows) {
		const previousProgress = row.userChallenge.progress;
		const newProgress = previousProgress + incrementBy;
		const alreadyCompleted = row.userChallenge.completedAt !== null;
		const reachedTarget = newProgress >= row.challenge.targetValue;
		const completedNow = !alreadyCompleted && reachedTarget;
		const shouldAwardXp = completedNow && !row.userChallenge.xpAwarded;
		const xpAwarded = shouldAwardXp ? row.challenge.xpReward : 0;

		await db
			.update(userChallenges)
			.set({
				progress: newProgress,
				completedAt: completedNow ? now : row.userChallenge.completedAt,
				xpAwarded: shouldAwardXp ? true : row.userChallenge.xpAwarded
			})
			.where(eq(userChallenges.id, row.userChallenge.id));

		if (xpAwarded > 0) {
			totalXpAwarded += xpAwarded;
		}

		updates.push({
			challengeId: row.challenge.id,
			previousProgress,
			newProgress,
			completedNow,
			xpAwarded
		});
	}

	if (totalXpAwarded > 0) {
		await db
			.update(userStats)
			.set({ xpTotal: sql`${userStats.xpTotal} + ${totalXpAwarded}` })
			.where(eq(userStats.userId, userId));
	}

	return updates;
}

export async function generateWeeklyChallenges(): Promise<WeeklyChallenge[]> {
	const now = new Date();
	const { weekStart, weekEnd } = getCurrentWeekRange();

	const existing = await db
		.select()
		.from(weeklyChallenges)
		.where(and(lte(weeklyChallenges.weekStart, now), gte(weeklyChallenges.weekEnd, now)))
		.limit(1);

	if (existing.length > 0) {
		return db
			.select()
			.from(weeklyChallenges)
			.where(and(lte(weeklyChallenges.weekStart, now), gte(weeklyChallenges.weekEnd, now)));
	}

	const selectedTemplates = pickRandomTemplates(3);

	return db
		.insert(weeklyChallenges)
		.values(
			selectedTemplates.map((template) => ({
				type: template.type,
				targetValue: randomInt(template.minTarget, template.maxTarget),
				xpReward: template.xpReward,
				titleEn: template.titleEn,
				titleDe: template.titleDe,
				descriptionEn: template.descriptionEn,
				descriptionDe: template.descriptionDe,
				weekStart,
				weekEnd
			}))
		)
		.returning();
}
