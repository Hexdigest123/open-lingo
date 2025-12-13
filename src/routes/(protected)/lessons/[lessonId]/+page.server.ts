import type { PageServerLoad, Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import {
	lessons,
	questions,
	userStats,
	userLessonProgress,
	userQuestionAttempts,
	dailyStreaks,
	achievements,
	userAchievements
} from '$lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';

// Check and unlock achievements based on user stats
async function checkAndUnlockAchievements(
	userId: number,
	stats: {
		lessonsCompleted: number;
		currentStreak: number;
		xpTotal: number;
	},
	lessonScore?: number
) {
	const allAchievements = await db.select().from(achievements);
	const userAchievs = await db
		.select()
		.from(userAchievements)
		.where(eq(userAchievements.userId, userId));

	const unlockedIds = new Set(userAchievs.map((a) => a.achievementId));

	for (const achievement of allAchievements) {
		if (unlockedIds.has(achievement.id)) continue;

		let shouldUnlock = false;

		switch (achievement.code) {
			case 'first_lesson':
				shouldUnlock = stats.lessonsCompleted >= 1;
				break;
			case 'streak_7':
				shouldUnlock = stats.currentStreak >= 7;
				break;
			case 'streak_30':
				shouldUnlock = stats.currentStreak >= 30;
				break;
			case 'xp_1000':
				shouldUnlock = stats.xpTotal >= 1000;
				break;
			case 'xp_5000':
				shouldUnlock = stats.xpTotal >= 5000;
				break;
			case 'lessons_10':
				shouldUnlock = stats.lessonsCompleted >= 10;
				break;
			case 'lessons_50':
				shouldUnlock = stats.lessonsCompleted >= 50;
				break;
			case 'lessons_100':
				shouldUnlock = stats.lessonsCompleted >= 100;
				break;
			case 'perfect_lesson':
				shouldUnlock = lessonScore === 100;
				break;
		}

		if (shouldUnlock) {
			await db
				.insert(userAchievements)
				.values({
					userId,
					achievementId: achievement.id,
					unlockedAt: new Date()
				})
				.onConflictDoNothing();
		}
	}
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
	let hearts = stats?.hearts || 5;
	if (stats?.heartsLastRefilled) {
		const hoursSinceRefill = (Date.now() - new Date(stats.heartsLastRefilled).getTime()) / (1000 * 60 * 60);
		const heartsToAdd = Math.floor(hoursSinceRefill);
		hearts = Math.min(5, hearts + heartsToAdd);
	}

	return {
		lesson,
		questions: lessonQuestions,
		hearts,
		isExam: lesson.isExam,
		examPassThreshold: lesson.examPassThreshold || 80
	};
};

export const actions: Actions = {
	submit: async ({ request, locals, params }) => {
		const lessonId = parseInt(params.lessonId);
		const userId = locals.user!.id;
		const data = await request.formData();

		const questionId = parseInt(data.get('questionId')?.toString() || '0');
		const answer = data.get('answer')?.toString().trim() || '';

		if (!questionId || !answer) {
			return fail(400, { error: 'Question ID and answer are required' });
		}

		// Get the question
		const [question] = await db.select().from(questions).where(eq(questions.id, questionId)).limit(1);

		if (!question) {
			return fail(404, { error: 'Question not found' });
		}

		// Check if answer is correct (case-insensitive for text answers)
		const isCorrect = answer.toLowerCase() === question.correctAnswer.toLowerCase();

		// Record the attempt
		await db.insert(userQuestionAttempts).values({
			userId,
			questionId,
			answer,
			isCorrect
		});

		// Get user stats
		const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1);

		let freezeEarned = false;

		if (isCorrect) {
			// Award XP and track correct answers for freeze earning
			const xpGain = 10;
			const newCorrectTotal = (stats?.totalCorrectAnswers || 0) + 1;
			const freezesFromAnswers = Math.floor(newCorrectTotal / 50);
			const currentFreezes = stats?.freezesEarnedTotal || 0;

			// Check if user earned a new freeze
			if (freezesFromAnswers > currentFreezes) {
				freezeEarned = true;
				await db
					.update(userStats)
					.set({
						xpTotal: (stats?.xpTotal || 0) + xpGain,
						totalCorrectAnswers: newCorrectTotal,
						streakFreezes: (stats?.streakFreezes || 0) + 1,
						freezesEarnedTotal: freezesFromAnswers,
						lastActivity: new Date()
					})
					.where(eq(userStats.userId, userId));
			} else {
				await db
					.update(userStats)
					.set({
						xpTotal: (stats?.xpTotal || 0) + xpGain,
						totalCorrectAnswers: newCorrectTotal,
						lastActivity: new Date()
					})
					.where(eq(userStats.userId, userId));
			}

			// Update daily streak
			const today = new Date();
			today.setHours(0, 0, 0, 0);

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
		} else {
			// Lose a heart
			const newHearts = Math.max(0, (stats?.hearts || 5) - 1);
			await db
				.update(userStats)
				.set({
					hearts: newHearts,
					heartsLastRefilled: newHearts < (stats?.hearts || 5) ? new Date() : stats?.heartsLastRefilled
				})
				.where(eq(userStats.userId, userId));
		}

		return {
			success: true,
			isCorrect,
			correctAnswer: question.correctAnswer,
			freezeEarned
		};
	},

	complete: async ({ request, locals, params }) => {
		const lessonId = parseInt(params.lessonId);
		const userId = locals.user!.id;
		const data = await request.formData();

		const score = parseInt(data.get('score')?.toString() || '0');
		const xpEarned = parseInt(data.get('xpEarned')?.toString() || '0');

		// Get the lesson to check if it's an exam
		const [lesson] = await db.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1);
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

		// Update streak (with freeze logic)
		const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1);

		let streakFreezeUsed = false;

		if (stats) {
			const lastActivity = stats.lastActivity ? new Date(stats.lastActivity) : null;
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			let newStreak = stats.currentStreak;
			let newFreezes = stats.streakFreezes;

			if (lastActivity) {
				const lastActivityDate = new Date(lastActivity);
				lastActivityDate.setHours(0, 0, 0, 0);

				const daysDiff = Math.floor((today.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24));

				if (daysDiff === 0) {
					// Same day, keep streak
				} else if (daysDiff === 1) {
					// Next day, increment streak
					newStreak = stats.currentStreak + 1;
				} else if (daysDiff > 1) {
					// Would break streak - check for freeze
					if (stats.streakFreezes > 0) {
						// Use a freeze to protect streak
						newFreezes = stats.streakFreezes - 1;
						streakFreezeUsed = true;
						// Keep the streak, just continue from where it was
					} else {
						// No freeze available - streak resets
						newStreak = 1;
					}
				}
			} else {
				newStreak = 1;
			}

			await db
				.update(userStats)
				.set({
					currentStreak: newStreak,
					longestStreak: Math.max(stats.longestStreak, newStreak),
					streakFreezes: newFreezes,
					lessonsCompleted: passed ? sql`${userStats.lessonsCompleted} + 1` : stats.lessonsCompleted,
					lastActivity: new Date()
				})
				.where(eq(userStats.userId, userId));

			// Check and unlock achievements
			if (passed) {
				await checkAndUnlockAchievements(
					userId,
					{
						lessonsCompleted: stats.lessonsCompleted + 1,
						currentStreak: newStreak,
						xpTotal: stats.xpTotal
					},
					score
				);
			}
		}

		return {
			completed: true,
			xpEarned,
			passed,
			isExam,
			examPassThreshold,
			score,
			streakFreezeUsed
		};
	}
};
