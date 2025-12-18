import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { lessons, units, levels, questions } from '$lib/server/db/schema';
import { eq, desc, count } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	// Get all lessons with unit and level info
	const lessonList = await db
		.select({
			id: lessons.id,
			title: lessons.title,
			description: lessons.description,
			xpReward: lessons.xpReward,
			order: lessons.order,
			isPublished: lessons.isPublished,
			unitId: lessons.unitId,
			unitTitle: units.title,
			levelCode: levels.code,
			levelName: levels.name
		})
		.from(lessons)
		.innerJoin(units, eq(lessons.unitId, units.id))
		.innerJoin(levels, eq(units.levelId, levels.id))
		.orderBy(levels.order, units.order, lessons.order);

	// Get question counts per lesson
	const questionCounts = await db
		.select({
			lessonId: questions.lessonId,
			count: count()
		})
		.from(questions)
		.groupBy(questions.lessonId);

	const questionCountMap = new Map(questionCounts.map((q) => [q.lessonId, q.count]));

	// Get all units for the create form
	const unitList = await db
		.select({
			id: units.id,
			title: units.title,
			levelCode: levels.code
		})
		.from(units)
		.innerJoin(levels, eq(units.levelId, levels.id))
		.orderBy(levels.order, units.order);

	return {
		lessons: lessonList.map((lesson) => ({
			...lesson,
			questionCount: questionCountMap.get(lesson.id) || 0
		})),
		units: unitList
	};
};

export const actions: Actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const titleEn = data.get('title')?.toString().trim();
		const titleDe = data.get('titleDe')?.toString().trim();
		const descEn = data.get('description')?.toString().trim();
		const descDe = data.get('descriptionDe')?.toString().trim();
		const unitId = parseInt(data.get('unitId')?.toString() || '0');
		const xpReward = parseInt(data.get('xpReward')?.toString() || '10');
		const isPublished = data.get('isPublished') === 'on';

		if (!titleEn || !unitId) {
			return fail(400, { error: 'Title (English) and unit are required' });
		}

		// Build JSON objects for translations
		const title = JSON.stringify({ en: titleEn, de: titleDe || titleEn });
		const description = descEn ? JSON.stringify({ en: descEn, de: descDe || descEn }) : null;

		// Get the highest order for this unit
		const [maxOrder] = await db
			.select({ maxOrder: lessons.order })
			.from(lessons)
			.where(eq(lessons.unitId, unitId))
			.orderBy(desc(lessons.order))
			.limit(1);

		const order = (maxOrder?.maxOrder || 0) + 1;

		try {
			await db.insert(lessons).values({
				title,
				description,
				unitId,
				xpReward,
				order,
				isPublished
			});

			return { success: true };
		} catch (error) {
			console.error('Failed to create lesson:', error);
			return fail(500, { error: 'Failed to create lesson' });
		}
	},

	togglePublish: async ({ request }) => {
		const data = await request.formData();
		const lessonId = parseInt(data.get('lessonId')?.toString() || '0');
		const isPublished = data.get('isPublished') === 'true';

		if (!lessonId) {
			return fail(400, { error: 'Lesson ID is required' });
		}

		try {
			await db
				.update(lessons)
				.set({ isPublished: !isPublished })
				.where(eq(lessons.id, lessonId));

			return { success: true };
		} catch (error) {
			console.error('Failed to toggle publish:', error);
			return fail(500, { error: 'Failed to update lesson' });
		}
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const lessonId = parseInt(data.get('lessonId')?.toString() || '0');

		if (!lessonId) {
			return fail(400, { error: 'Lesson ID is required' });
		}

		try {
			await db.delete(lessons).where(eq(lessons.id, lessonId));
			return { success: true };
		} catch (error) {
			console.error('Failed to delete lesson:', error);
			return fail(500, { error: 'Failed to delete lesson' });
		}
	}
};
