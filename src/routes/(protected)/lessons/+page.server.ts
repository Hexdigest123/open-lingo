import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { levels, units, lessons, userLessonProgress } from '$lib/server/db/schema';
import { asc, eq, inArray } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url, locals }) => {
	const levelCode = url.searchParams.get('level');

	if (levelCode) {
		// Load specific level with units and lessons
		const [level] = await db
			.select()
			.from(levels)
			.where(eq(levels.code, levelCode as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'))
			.limit(1);

		if (!level) {
			// Level not found, return to level selection
			const allLevels = await db.select().from(levels).orderBy(asc(levels.order));
			return { levels: allLevels, selectedLevel: null, units: [], userProgress: [] };
		}

		// Get units for this level
		const levelUnits = await db
			.select()
			.from(units)
			.where(eq(units.levelId, level.id))
			.orderBy(asc(units.order));

		// Get all lessons for these units
		const unitIds = levelUnits.map((u) => u.id);
		const levelLessons =
			unitIds.length > 0
				? await db
						.select()
						.from(lessons)
						.where(inArray(lessons.unitId, unitIds))
						.orderBy(asc(lessons.order))
				: [];

		// Get user progress for these lessons
		const lessonIds = levelLessons.map((l) => l.id);
		const userProgress =
			lessonIds.length > 0 && locals.user
				? await db
						.select()
						.from(userLessonProgress)
						.where(eq(userLessonProgress.userId, locals.user.id))
				: [];

		// Group lessons by unit
		const unitsWithLessons = levelUnits.map((unit) => ({
			...unit,
			lessons: levelLessons.filter((lesson) => lesson.unitId === unit.id)
		}));

		return {
			selectedLevel: level,
			units: unitsWithLessons,
			userProgress,
			levels: null
		};
	}

	// No level selected - show level selection
	const allLevels = await db.select().from(levels).orderBy(asc(levels.order));

	// Fetch units count for each level
	const levelsWithUnitCount = await Promise.all(
		allLevels.map(async (level) => {
			const levelUnits = await db
				.select()
				.from(units)
				.where(eq(units.levelId, level.id))
				.orderBy(asc(units.order));

			return {
				...level,
				unitCount: levelUnits.length
			};
		})
	);

	return {
		levels: levelsWithUnitCount,
		selectedLevel: null,
		units: [],
		userProgress: []
	};
};

export const actions: Actions = {
	skip: async ({ request, locals }) => {
		if (!locals.user) {
			return { success: false, error: 'Not authenticated' };
		}

		const data = await request.formData();
		const lessonId = Number(data.get('lessonId'));

		if (!lessonId) {
			return { success: false, error: 'Invalid lesson ID' };
		}

		// Check if progress exists
		const [existing] = await db
			.select()
			.from(userLessonProgress)
			.where(eq(userLessonProgress.userId, locals.user.id))
			.limit(1);

		if (existing) {
			await db
				.update(userLessonProgress)
				.set({
					status: 'completed', // Using 'completed' for now, will add 'skipped' status later
					score: 0,
					completedAt: new Date(),
					updatedAt: new Date()
				})
				.where(eq(userLessonProgress.id, existing.id));
		} else {
			await db.insert(userLessonProgress).values({
				userId: locals.user.id,
				lessonId,
				status: 'completed', // Using 'completed' for now
				score: 0,
				attempts: 0,
				completedAt: new Date()
			});
		}

		// No XP awarded, no achievements checked for skipped lessons
		return { success: true };
	}
};
