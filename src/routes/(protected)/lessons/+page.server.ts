import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import {
	languages,
	levels,
	units,
	lessons,
	userLessonProgress,
	users
} from '$lib/server/db/schema';
import { and, asc, eq, inArray, ne } from 'drizzle-orm';
import { pickFromJson } from '$lib/server/i18n/resolve';

export const load: PageServerLoad = async ({ url, locals }) => {
	const levelCode = url.searchParams.get('level');
	const errorParam = url.searchParams.get('error');
	const locale = locals.locale ?? 'en';

	const [userLanguage] = await db
		.select({ activeLanguage: users.activeLanguage })
		.from(users)
		.where(eq(users.id, locals.user!.id))
		.limit(1);

	let activeLanguageCode = userLanguage?.activeLanguage ?? 'es';

	let [activeLanguage] = await db
		.select({ code: languages.code, name: languages.name })
		.from(languages)
		.where(eq(languages.code, activeLanguageCode))
		.limit(1);

	if (!activeLanguage && activeLanguageCode !== 'es') {
		[activeLanguage] = await db
			.select({ code: languages.code, name: languages.name })
			.from(languages)
			.where(eq(languages.code, 'es'))
			.limit(1);
		activeLanguageCode = activeLanguage?.code ?? 'es';
	}

	if (levelCode) {
		const [level] = await db
			.select()
			.from(levels)
			.where(
				and(
					eq(levels.code, levelCode as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'),
					eq(levels.languageCode, activeLanguageCode)
				)
			)
			.limit(1);

		if (!level) {
			const allLevels = await db
				.select()
				.from(levels)
				.where(eq(levels.languageCode, activeLanguageCode))
				.orderBy(asc(levels.order));
			return {
				levels: allLevels.map((l) => ({
					...l,
					name: pickFromJson(l.name, locale),
					description: pickFromJson(l.description, locale)
				})),
				selectedLevel: null,
				units: [],
				userProgress: [],
				error: errorParam,
				activeLanguage: {
					code: activeLanguage?.code ?? activeLanguageCode,
					name: activeLanguage?.name ?? 'Target Language'
				}
			};
		}

		const levelUnits = await db
			.select()
			.from(units)
			.where(eq(units.levelId, level.id))
			.orderBy(asc(units.order));

		const unitIds = levelUnits.map((u) => u.id);
		const levelLessons =
			unitIds.length > 0
				? await db
						.select()
						.from(lessons)
						.where(and(inArray(lessons.unitId, unitIds), ne(lessons.mode, 'guided_skill')))
						.orderBy(asc(lessons.order))
				: [];

		const lessonIds = levelLessons.map((l) => l.id);
		const userProgress =
			lessonIds.length > 0 && locals.user
				? await db
						.select()
						.from(userLessonProgress)
						.where(eq(userLessonProgress.userId, locals.user.id))
				: [];

		const unitsWithLessons = levelUnits.map((unit) => ({
			...unit,
			title: pickFromJson(unit.title, locale),
			description: pickFromJson(unit.description, locale),
			lessons: levelLessons
				.filter((lesson) => lesson.unitId === unit.id)
				.map((lesson) => ({
					...lesson,
					title: pickFromJson(lesson.title, locale),
					description: pickFromJson(lesson.description, locale)
				}))
		}));

		return {
			selectedLevel: {
				...level,
				name: pickFromJson(level.name, locale),
				description: pickFromJson(level.description, locale)
			},
			units: unitsWithLessons,
			userProgress,
			levels: null,
			error: errorParam,
			activeLanguage: {
				code: activeLanguage?.code ?? activeLanguageCode,
				name: activeLanguage?.name ?? 'Target Language'
			}
		};
	}

	const allLevels = await db
		.select()
		.from(levels)
		.where(eq(levels.languageCode, activeLanguageCode))
		.orderBy(asc(levels.order));

	const levelsWithUnitCount = await Promise.all(
		allLevels.map(async (level) => {
			const levelUnits = await db
				.select()
				.from(units)
				.where(eq(units.levelId, level.id))
				.orderBy(asc(units.order));

			return {
				...level,
				name: pickFromJson(level.name, locale),
				description: pickFromJson(level.description, locale),
				unitCount: levelUnits.length
			};
		})
	);

	return {
		levels: levelsWithUnitCount,
		selectedLevel: null,
		units: [],
		userProgress: [],
		error: errorParam,
		activeLanguage: {
			code: activeLanguage?.code ?? activeLanguageCode,
			name: activeLanguage?.name ?? 'Target Language'
		}
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

		// Check if progress exists for this specific lesson
		const [existing] = await db
			.select()
			.from(userLessonProgress)
			.where(
				and(
					eq(userLessonProgress.userId, locals.user.id),
					eq(userLessonProgress.lessonId, lessonId)
				)
			)
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
