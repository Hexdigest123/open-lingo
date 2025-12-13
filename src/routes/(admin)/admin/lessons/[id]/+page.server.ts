import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { lessons, units, levels, questions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const lessonId = parseInt(params.id);

	if (isNaN(lessonId)) {
		throw redirect(302, '/admin/lessons');
	}

	// Get lesson
	const [lesson] = await db.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1);

	if (!lesson) {
		throw redirect(302, '/admin/lessons');
	}

	// Get questions for this lesson
	const lessonQuestions = await db
		.select()
		.from(questions)
		.where(eq(questions.lessonId, lessonId))
		.orderBy(questions.order);

	// Get all units for the select
	const allUnits = await db
		.select({
			id: units.id,
			title: units.title,
			levelCode: levels.code
		})
		.from(units)
		.innerJoin(levels, eq(units.levelId, levels.id))
		.orderBy(levels.order, units.order);

	return {
		lesson,
		questions: lessonQuestions,
		units: allUnits
	};
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const lessonId = parseInt(params.id);
		const data = await request.formData();

		const title = data.get('title')?.toString().trim();
		const description = data.get('description')?.toString().trim() || null;
		const unitId = parseInt(data.get('unitId')?.toString() || '0');
		const type = data.get('type')?.toString() as
			| 'fill_in_blank'
			| 'multiple_choice'
			| 'vocabulary'
			| 'voice_answer';
		const xpReward = parseInt(data.get('xpReward')?.toString() || '10');
		const isPublished = data.get('isPublished') === 'on';
		const isExam = data.get('isExam') === 'on';
		const examPassThreshold = parseInt(data.get('examPassThreshold')?.toString() || '80');

		if (!title || !unitId) {
			return fail(400, { error: 'Title and unit are required' });
		}

		try {
			await db
				.update(lessons)
				.set({
					title,
					description,
					unitId,
					type,
					xpReward,
					isPublished,
					isExam,
					examPassThreshold
				})
				.where(eq(lessons.id, lessonId));

			return { success: true };
		} catch (error) {
			console.error('Failed to update lesson:', error);
			return fail(500, { error: 'Failed to update lesson' });
		}
	},

	delete: async ({ params }) => {
		const lessonId = parseInt(params.id);

		try {
			// Delete questions first
			await db.delete(questions).where(eq(questions.lessonId, lessonId));
			// Delete lesson
			await db.delete(lessons).where(eq(lessons.id, lessonId));

			throw redirect(302, '/admin/lessons');
		} catch (error) {
			if (error instanceof Response) throw error;
			console.error('Failed to delete lesson:', error);
			return fail(500, { error: 'Failed to delete lesson' });
		}
	},

	deleteQuestion: async ({ request }) => {
		const data = await request.formData();
		const questionId = parseInt(data.get('questionId')?.toString() || '0');

		if (!questionId) {
			return fail(400, { error: 'Question ID is required' });
		}

		try {
			await db.delete(questions).where(eq(questions.id, questionId));
			return { success: true };
		} catch (error) {
			console.error('Failed to delete question:', error);
			return fail(500, { error: 'Failed to delete question' });
		}
	}
};
