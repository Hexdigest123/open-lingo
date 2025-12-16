import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import {
	lessons,
	questions,
	userStats,
	userLessonProgress,
	userQuestionAttempts,
	dailyStreaks,
	achievements,
	userAchievements,
	users,
	units,
	levels
} from '$lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { isAnswerCorrect } from '$lib/server/validation/answers';
import { isHeartsEnabledForUser } from '$lib/server/hearts/heartsEnabled';

// Check and unlock achievements based on user stats
async function checkAndUnlockAchievements(
	userId: number,
	stats: {
		lessonsCompleted: number;
		currentStreak: number;
		xpTotal: number;
		totalCorrectAnswers: number;
		freezesEarnedTotal: number;
	},
	lessonScore?: number,
	isExamPassed?: boolean
) {
	const allAchievements = await db.select().from(achievements);
	const userAchievs = await db
		.select()
		.from(userAchievements)
		.where(eq(userAchievements.userId, userId));

	const unlockedIds = new Set(userAchievs.map((a) => a.achievementId));

	// Count perfect lessons (score = 100)
	const [perfectLessonsResult] = await db
		.select({ count: sql<number>`count(*)` })
		.from(userLessonProgress)
		.where(and(eq(userLessonProgress.userId, userId), eq(userLessonProgress.score, 100)));
	const perfectLessonsCount = perfectLessonsResult?.count || 0;

	// Count exams passed
	const [examsPassedResult] = await db
		.select({ count: sql<number>`count(*)` })
		.from(userLessonProgress)
		.innerJoin(lessons, eq(userLessonProgress.lessonId, lessons.id))
		.where(
			and(
				eq(userLessonProgress.userId, userId),
				eq(lessons.isExam, true),
				eq(userLessonProgress.status, 'completed')
			)
		);
	const examsPassedCount = examsPassedResult?.count || 0;

	for (const achievement of allAchievements) {
		if (unlockedIds.has(achievement.id)) continue;

		let shouldUnlock = false;

		switch (achievement.code) {
			// Lessons completed achievements
			case 'first_lesson':
				shouldUnlock = stats.lessonsCompleted >= 1;
				break;
			case 'lessons_5':
				shouldUnlock = stats.lessonsCompleted >= 5;
				break;
			case 'lessons_25':
				shouldUnlock = stats.lessonsCompleted >= 25;
				break;
			case 'lessons_100':
				shouldUnlock = stats.lessonsCompleted >= 100;
				break;
			case 'lessons_500':
				shouldUnlock = stats.lessonsCompleted >= 500;
				break;

			// Streak achievements
			case 'streak_7':
				shouldUnlock = stats.currentStreak >= 7;
				break;
			case 'streak_30':
				shouldUnlock = stats.currentStreak >= 30;
				break;
			case 'streak_100':
				shouldUnlock = stats.currentStreak >= 100;
				break;

			// XP achievements
			case 'xp_100':
				shouldUnlock = stats.xpTotal >= 100;
				break;
			case 'xp_1000':
				shouldUnlock = stats.xpTotal >= 1000;
				break;
			case 'xp_5000':
				shouldUnlock = stats.xpTotal >= 5000;
				break;

			// Perfect lesson achievements
			case 'perfect_lesson':
				shouldUnlock = lessonScore === 100;
				break;
			case 'perfect_10':
				shouldUnlock = perfectLessonsCount >= 10;
				break;

			// Exam achievements
			case 'exam_1':
				shouldUnlock = isExamPassed || examsPassedCount >= 1;
				break;
			case 'exam_10':
				shouldUnlock = examsPassedCount >= 10;
				break;

			// Freeze achievements
			case 'freeze_master':
				shouldUnlock = stats.freezesEarnedTotal >= 5;
				break;

			// Correct answers achievements
			case 'correct_1000':
				shouldUnlock = stats.totalCorrectAnswers >= 1000;
				break;

			// Level completion achievements - check dynamically
			case 'level_a1':
			case 'level_a2':
			case 'level_b1':
			case 'level_b2':
			case 'level_c1':
			case 'level_c2': {
				const levelCode = achievement.code.replace('level_', '').toUpperCase();
				const levelComplete = await checkLevelComplete(userId, levelCode);
				shouldUnlock = levelComplete;
				break;
			}
		}

		if (shouldUnlock) {
			await db
				.insert(userAchievements)
				.values({
					userId,
					achievementId: achievement.id,
					earnedAt: new Date()
				})
				.onConflictDoNothing();
		}
	}
}

// Helper to check if a user has completed all lessons in a level
async function checkLevelComplete(userId: number, levelCode: string): Promise<boolean> {
	// Get all published lessons for this level
	const levelLessons = await db
		.select({ lessonId: lessons.id })
		.from(lessons)
		.innerJoin(units, eq(lessons.unitId, units.id))
		.innerJoin(levels, eq(units.levelId, levels.id))
		.where(and(eq(levels.code, levelCode as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'), eq(lessons.isPublished, true)));

	if (levelLessons.length === 0) return false;

	// Get user's completed lessons for this level
	const completedLessons = await db
		.select({ lessonId: userLessonProgress.lessonId })
		.from(userLessonProgress)
		.where(
			and(
				eq(userLessonProgress.userId, userId),
				eq(userLessonProgress.status, 'completed'),
				sql`${userLessonProgress.lessonId} IN (${sql.join(
					levelLessons.map((l) => sql`${l.lessonId}`),
					sql`, `
				)})`
			)
		);

	return completedLessons.length >= levelLessons.length;
}

function getHeartsWithRegeneration(stats?: typeof userStats.$inferSelect): {
	hearts: number;
	regenerated: boolean;
} {
	let hearts = stats?.hearts ?? 10;
	let regenerated = false;

	if (stats?.heartsLastRefilled) {
		// Regenerate 5 hearts per 30 minutes, max 10
		const halfHoursSinceRefill =
			(Date.now() - new Date(stats.heartsLastRefilled).getTime()) / (1000 * 60 * 30);
		const intervals = Math.floor(halfHoursSinceRefill);
		if (intervals > 0) {
			const heartsToAdd = intervals * 5;
			const updatedHearts = Math.min(10, hearts + heartsToAdd);
			regenerated = updatedHearts > hearts;
			hearts = updatedHearts;
		}
	}

	return { hearts, regenerated };
}

export const load: PageServerLoad = async ({ params, locals }) => {
	const lessonId = parseInt(params.lessonId);
	const userId = locals.user!.id;

	if (isNaN(lessonId)) {
		error(404, 'Lesson not found');
	}

	// Get lesson
	const [lesson] = await db.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1);

	if (!lesson) {
		error(404, 'Lesson not found');
	}

	if (!lesson.isPublished) {
		error(403, 'This lesson is not available yet');
	}

	// Get questions for this lesson
	const lessonQuestions = await db
		.select()
		.from(questions)
		.where(eq(questions.lessonId, lessonId))
		.orderBy(questions.order);

	if (lessonQuestions.length === 0) {
		error(404, 'This lesson has no questions');
	}

	// Get user stats (hearts)
	const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1);

	// Calculate actual hearts (with regeneration)
	const { hearts, regenerated } = getHeartsWithRegeneration(stats);

	// Update DB if hearts regenerated
	if (regenerated && stats) {
		await db
			.update(userStats)
			.set({
				hearts,
				heartsLastRefilled: new Date()
			})
			.where(eq(userStats.userId, userId));
	}

	// Check if lesson is already completed (allow revision with 0 hearts)
	const [progress] = await db
		.select()
		.from(userLessonProgress)
		.where(and(eq(userLessonProgress.userId, userId), eq(userLessonProgress.lessonId, lessonId)))
		.limit(1);

	const isRevision = progress?.status === 'completed' || progress?.status === 'mastered';

	// Check if hearts are enabled for this user
	const heartsEnabled = await isHeartsEnabledForUser(userId);

	// Guard: redirect if no hearts available AND not revising a completed lesson AND hearts are enabled
	if (hearts <= 0 && !isRevision && heartsEnabled) {
		redirect(303, '/lessons?error=no_hearts');
	}

	// Check if user has OpenAI API key configured
	const [user] = await db
		.select({ openaiApiKeyEncrypted: users.openaiApiKeyEncrypted })
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	const hasApiKey = !!user?.openaiApiKeyEncrypted;

	return {
		lesson,
		questions: lessonQuestions,
		hearts,
		heartsEnabled,
		isExam: lesson.isExam,
		examPassThreshold: lesson.examPassThreshold || 80,
		isRevision,
		hasApiKey
	};
};

export const actions: Actions = {
	submit: async ({ request, locals, params }) => {
		const lessonId = parseInt(params.lessonId);
		const userId = locals.user!.id;
		const data = await request.formData();

		const questionId = parseInt(data.get('questionId')?.toString() || '0');
		const answer = data.get('answer')?.toString().trim() || '';
		const isRevision = data.get('isRevision')?.toString() === 'true';

		if (!questionId || !answer) {
			return fail(400, { error: 'Question ID and answer are required' });
		}

		// Ensure lesson exists and is available
		const [lesson] = await db.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1);

		if (!lesson) {
			return fail(404, { error: 'Lesson not found' });
		}

		if (!lesson.isPublished) {
			return fail(403, { error: 'This lesson is not available yet' });
		}

		// Get the question
		const [question] = await db
			.select()
			.from(questions)
			.where(and(eq(questions.id, questionId), eq(questions.lessonId, lessonId)))
			.limit(1);

		if (!question) {
			return fail(404, { error: 'Question not found' });
		}

		// Get user stats
		const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1);
		const { hearts: availableHearts, regenerated } = getHeartsWithRegeneration(stats);

		if (regenerated && stats) {
			await db
				.update(userStats)
				.set({
					hearts: availableHearts,
					heartsLastRefilled: new Date()
				})
				.where(eq(userStats.userId, userId));
		}

		// Check if hearts are enabled for this user
		const heartsEnabled = await isHeartsEnabledForUser(userId);

		if (availableHearts <= 0 && !isRevision && heartsEnabled) {
			return fail(403, { error: 'No hearts remaining' });
		}

		// Check if answer is correct with normalization support
		const isCorrect = isAnswerCorrect(answer, question.correctAnswer);

		// Record the attempt
		await db.insert(userQuestionAttempts).values({
			userId,
			questionId,
			answer,
			isCorrect
		});

		let freezeEarned = false;

		if (isCorrect) {
			// Award XP and track correct answers for freeze earning
			const xpGain = 10;
			const newCorrectTotal = (stats?.totalCorrectAnswers || 0) + 1;
			const freezesFromAnswers = Math.floor(newCorrectTotal / 50);
			const currentFreezes = stats?.freezesEarnedTotal || 0;

			// Calculate streak update on correct answer
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			let newStreak = stats?.currentStreak || 0;
			let newFreezes = stats?.streakFreezes || 0;
			let streakFreezeUsed = false;

			const lastActivity = stats?.lastActivity ? new Date(stats.lastActivity) : null;

			if (lastActivity) {
				const lastActivityDate = new Date(lastActivity);
				lastActivityDate.setHours(0, 0, 0, 0);

				const daysDiff = Math.floor(
					(today.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24)
				);

				if (daysDiff === 0) {
					// Same day - ensure streak is at least 1 (first activity of the day)
					if (newStreak === 0) {
						newStreak = 1;
					}
				} else if (daysDiff === 1) {
					// Next day, increment streak
					newStreak = (stats?.currentStreak || 0) + 1;
				} else if (daysDiff > 1) {
					// Would break streak - check for freeze
					if ((stats?.streakFreezes || 0) > 0) {
						// Use a freeze to protect streak
						newFreezes = (stats?.streakFreezes || 0) - 1;
						streakFreezeUsed = true;
						// Keep the streak, just continue from where it was
					} else {
						// No freeze available - streak resets
						newStreak = 1;
					}
				}
			} else {
				// First activity ever
				newStreak = 1;
			}

			// Check if user earned a new freeze from correct answers
			if (freezesFromAnswers > currentFreezes) {
				freezeEarned = true;
				newFreezes = newFreezes + 1;
			}

			// Update user stats with XP, correct answers, streak, and freezes
			await db
				.update(userStats)
				.set({
					xpTotal: (stats?.xpTotal || 0) + xpGain,
					totalCorrectAnswers: newCorrectTotal,
					currentStreak: newStreak,
					longestStreak: Math.max(stats?.longestStreak || 0, newStreak),
					streakFreezes: freezeEarned ? newFreezes : streakFreezeUsed ? newFreezes : stats?.streakFreezes || 0,
					freezesEarnedTotal: freezeEarned ? freezesFromAnswers : stats?.freezesEarnedTotal || 0,
					lastActivity: new Date()
				})
				.where(eq(userStats.userId, userId));

			// Update daily streak record
			await db
				.insert(dailyStreaks)
				.values({
					userId,
					activityDate: today,
					xpEarned: xpGain
				})
				.onConflictDoUpdate({
					target: [dailyStreaks.userId, dailyStreaks.activityDate],
					set: {
						xpEarned: sql`${dailyStreaks.xpEarned} + ${xpGain}`
					}
				});

			// Return current hearts for correct answers
			return {
				success: true,
				isCorrect,
				correctAnswer: question.correctAnswer,
				freezeEarned,
				hearts: availableHearts,
				heartsEnabled,
				streakFreezeUsed,
				currentStreak: newStreak
			};
		} else {
			// Only deduct hearts if not in revision mode AND hearts are enabled
			if (!isRevision && heartsEnabled) {
				const newHearts = Math.max(0, availableHearts - 1);
				await db
					.update(userStats)
					.set({
						hearts: newHearts,
						heartsLastRefilled:
							newHearts < availableHearts ? new Date() : stats?.heartsLastRefilled
					})
					.where(eq(userStats.userId, userId));

				return {
					success: true,
					isCorrect,
					correctAnswer: question.correctAnswer,
					freezeEarned: false,
					hearts: newHearts,
					heartsEnabled
				};
			}

			// Revision mode or hearts disabled - no heart deduction
			return {
				success: true,
				isCorrect,
				correctAnswer: question.correctAnswer,
				freezeEarned: false,
				hearts: availableHearts,
				heartsEnabled
			};
		}
	},

	complete: async ({ request, locals, params }) => {
		const lessonId = parseInt(params.lessonId);
		const userId = locals.user!.id;
		const data = await request.formData();

		const score = parseInt(data.get('score')?.toString() || '0');
		const xpEarned = parseInt(data.get('xpEarned')?.toString() || '0');

		// Get the lesson to check if it's an exam
		const [lesson] = await db.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1);

		if (!lesson) {
			return fail(404, { error: 'Lesson not found' });
		}

		if (!lesson.isPublished) {
			return fail(403, { error: 'This lesson is not available yet' });
		}

		const isExam = lesson?.isExam || false;
		const examPassThreshold = lesson?.examPassThreshold || 80;
		const passed = !isExam || score >= examPassThreshold;

		// Update or create lesson progress
		await db
			.insert(userLessonProgress)
			.values({
				userId,
				lessonId,
				status: passed ? 'completed' : 'in_progress',
				score,
				attempts: 1,
				completedAt: passed ? new Date() : null
			})
			.onConflictDoUpdate({
				target: [userLessonProgress.userId, userLessonProgress.lessonId],
				set: {
					status: passed ? 'completed' : 'in_progress',
					score,
					attempts: sql`${userLessonProgress.attempts} + 1`,
					completedAt: passed ? new Date() : null
				}
			});

		// Update lessonsCompleted count and check achievements (streak is updated per-task in submit action)
		const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1);

		if (stats && passed) {
			// Restore 5 hearts on lesson completion, capped at 10
			const newHearts = Math.min(10, stats.hearts + 5);

			await db
				.update(userStats)
				.set({
					lessonsCompleted: sql`${userStats.lessonsCompleted} + 1`,
					hearts: newHearts,
					heartsLastRefilled: new Date()
				})
				.where(eq(userStats.userId, userId));

			// Check and unlock achievements
			await checkAndUnlockAchievements(
				userId,
				{
					lessonsCompleted: stats.lessonsCompleted + 1,
					currentStreak: stats.currentStreak,
					xpTotal: stats.xpTotal,
					totalCorrectAnswers: stats.totalCorrectAnswers,
					freezesEarnedTotal: stats.freezesEarnedTotal
				},
				score,
				isExam && passed
			);
		}

		return {
			completed: true,
			xpEarned,
			passed,
			isExam,
			examPassThreshold,
			score
		};
	}
};
