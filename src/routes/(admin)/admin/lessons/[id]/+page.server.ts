import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { lessons, units, levels, questions, type QuestionType } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import {
	validateQuestionContent,
	validateCorrectAnswer
} from '$lib/server/validation/question-validation';

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

		const titleEn = data.get('title')?.toString().trim();
		const titleDe = data.get('titleDe')?.toString().trim();
		const descEn = data.get('description')?.toString().trim();
		const descDe = data.get('descriptionDe')?.toString().trim();
		const unitId = parseInt(data.get('unitId')?.toString() || '0');
		const xpReward = parseInt(data.get('xpReward')?.toString() || '10');
		const isPublished = data.get('isPublished') === 'on';
		const isExam = data.get('isExam') === 'on';
		const examPassThreshold = parseInt(data.get('examPassThreshold')?.toString() || '80');

		if (!titleEn || !unitId) {
			return fail(400, { error: 'Title (English) and unit are required' });
		}

		// Build JSON objects for translations
		const title = JSON.stringify({ en: titleEn, de: titleDe || titleEn });
		const description = descEn ? JSON.stringify({ en: descEn, de: descDe || descEn }) : null;

		try {
			await db
				.update(lessons)
				.set({
					title,
					description,
					unitId,
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
	},

	addQuestion: async ({ request, params }) => {
		const lessonId = parseInt(params.id);
		const data = await request.formData();

		const type = data.get('type')?.toString() as QuestionType;
		const contentStr = data.get('content')?.toString();
		const correctAnswer = data.get('correctAnswer')?.toString().trim() || '';

		if (!type || !contentStr) {
			return fail(400, { error: 'Type and content are required' });
		}

		let content: unknown;
		try {
			content = JSON.parse(contentStr);
		} catch {
			return fail(400, { error: 'Invalid content JSON' });
		}

		// Validate content structure
		const contentError = validateQuestionContent(type, content);
		if (contentError) {
			return fail(400, { error: contentError });
		}

		// Validate correct answer
		const answerError = validateCorrectAnswer(type, content, correctAnswer);
		if (answerError) {
			return fail(400, { error: answerError });
		}

		// Get the highest order for this lesson
		const [maxOrder] = await db
			.select({ maxOrder: questions.order })
			.from(questions)
			.where(eq(questions.lessonId, lessonId))
			.orderBy(desc(questions.order))
			.limit(1);

		const order = (maxOrder?.maxOrder || 0) + 1;

		try {
			await db.insert(questions).values({
				lessonId,
				type,
				content,
				correctAnswer,
				order
			});

			return { success: true, message: 'Question added successfully' };
		} catch (error) {
			console.error('Failed to add question:', error);
			return fail(500, { error: 'Failed to add question' });
		}
	},

	updateQuestion: async ({ request }) => {
		const data = await request.formData();

		const questionId = parseInt(data.get('questionId')?.toString() || '0');
		const type = data.get('type')?.toString() as QuestionType;
		const contentStr = data.get('content')?.toString();
		const correctAnswer = data.get('correctAnswer')?.toString().trim() || '';

		if (!questionId || !type || !contentStr) {
			return fail(400, { error: 'Question ID, type, and content are required' });
		}

		let content: unknown;
		try {
			content = JSON.parse(contentStr);
		} catch {
			return fail(400, { error: 'Invalid content JSON' });
		}

		// Validate content structure
		const contentError = validateQuestionContent(type, content);
		if (contentError) {
			return fail(400, { error: contentError });
		}

		// Validate correct answer
		const answerError = validateCorrectAnswer(type, content, correctAnswer);
		if (answerError) {
			return fail(400, { error: answerError });
		}

		try {
			await db
				.update(questions)
				.set({
					type,
					content,
					correctAnswer
				})
				.where(eq(questions.id, questionId));

			return { success: true, message: 'Question updated successfully' };
		} catch (error) {
			console.error('Failed to update question:', error);
			return fail(500, { error: 'Failed to update question' });
		}
	}
};
