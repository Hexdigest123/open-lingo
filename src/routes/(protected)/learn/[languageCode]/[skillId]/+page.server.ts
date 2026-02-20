import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import {
	lessonSkills,
	questionConcepts,
	questions,
	userSkillProgress,
	users
} from '$lib/server/db/schema';
import {
	getLessonBlocksForLesson,
	getQuestionsForConcepts,
	getSkillWithConcepts
} from '$lib/server/learning/content-service';
import {
	checkAndUnlockSkills,
	updateConceptProgress,
	updateSkillProgress
} from '$lib/server/learning/progression-service';
import { isAnswerCorrect } from '$lib/server/validation/answers';
import { hasGlobalApiKey } from '$lib/server/openai/getApiKey';
import { and, eq, inArray } from 'drizzle-orm';
import {
	pick,
	resolveQuestionContent,
	resolveTeachBlockConfig,
	resolveEntityFields,
	CONCEPT_FIELDS,
	SKILL_FIELDS,
	LESSON_BLOCK_FIELDS
} from '$lib/server/i18n/resolve';

export const load: PageServerLoad = async ({ params, locals }) => {
	const skillId = Number.parseInt(params.skillId, 10);
	const languageCode = params.languageCode.trim().toLowerCase();
	const userId = locals.user!.id;

	if (!Number.isFinite(skillId) || skillId <= 0 || !languageCode) {
		error(404, 'Invalid skill route');
	}

	const skillWithConcepts = await getSkillWithConcepts(skillId);
	if (!skillWithConcepts) {
		error(404, 'Skill not found');
	}

	if (skillWithConcepts.skill.languageCode !== languageCode) {
		redirect(303, '/skills');
	}

	await checkAndUnlockSkills(userId, languageCode);

	const [progress] = await db
		.select({ status: userSkillProgress.status })
		.from(userSkillProgress)
		.where(
			and(
				eq(userSkillProgress.userId, userId),
				eq(userSkillProgress.skillId, skillWithConcepts.skill.id)
			)
		)
		.limit(1);

	if (!progress || progress.status === 'locked') {
		redirect(303, '/skills');
	}

	const conceptIds = skillWithConcepts.concepts.map((concept) => concept.id);

	const [lessonLink] = await db
		.select({ lessonId: lessonSkills.lessonId })
		.from(lessonSkills)
		.where(eq(lessonSkills.skillId, skillId))
		.limit(1);

	const blocks = lessonLink ? await getLessonBlocksForLesson(lessonLink.lessonId) : [];
	const skillQuestions = await getQuestionsForConcepts(conceptIds);

	const questionIds = skillQuestions.map((question) => question.id);
	const questionLinks =
		questionIds.length > 0 && conceptIds.length > 0
			? await db
					.select({
						questionId: questionConcepts.questionId,
						conceptId: questionConcepts.conceptId
					})
					.from(questionConcepts)
					.where(
						and(
							inArray(questionConcepts.questionId, questionIds),
							inArray(questionConcepts.conceptId, conceptIds)
						)
					)
			: [];

	const questionConceptMap: Record<string, number> = {};
	for (const link of questionLinks) {
		if (!(link.questionId in questionConceptMap)) {
			questionConceptMap[link.questionId] = link.conceptId;
		}
	}

	const [user] = await db
		.select({ openaiApiKeyEncrypted: users.openaiApiKeyEncrypted })
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	const hasApiKey = !!user?.openaiApiKeyEncrypted || (await hasGlobalApiKey());

	const locale = locals.locale;

	const resolvedSkill = resolveEntityFields(skillWithConcepts.skill, locale, SKILL_FIELDS);
	const resolvedConcepts = skillWithConcepts.concepts.map((c) =>
		resolveEntityFields(c, locale, CONCEPT_FIELDS)
	);
	const resolvedBlocks = blocks.map((b) => {
		const resolved = resolveEntityFields(b, locale, LESSON_BLOCK_FIELDS);
		if (b.blockType === 'teach' && b.config && typeof b.config === 'object') {
			resolved.config = resolveTeachBlockConfig(b.config as Record<string, unknown>, locale);
		}
		return resolved;
	});
	const resolvedQuestions = skillQuestions.map((q) => ({
		...q,
		content: q.content
			? resolveQuestionContent(q.content as Record<string, unknown>, locale)
			: q.content
	}));

	return {
		skill: resolvedSkill,
		concepts: resolvedConcepts,
		blocks: resolvedBlocks,
		questions: resolvedQuestions,
		questionConceptMap,
		hasApiKey
	};
};

export const actions: Actions = {
	answer: async ({ request, params, locals }) => {
		const userId = locals.user!.id;
		const skillId = Number.parseInt(params.skillId, 10);
		const languageCode = params.languageCode.trim().toLowerCase();
		const data = await request.formData();

		const conceptId = Number.parseInt(data.get('conceptId')?.toString() ?? '', 10);
		const questionId = Number.parseInt(data.get('questionId')?.toString() ?? '', 10);
		const answer = data.get('answer')?.toString().trim() ?? '';

		if (!Number.isFinite(skillId) || !languageCode) {
			return fail(400, { error: 'Invalid route params' });
		}

		if (!Number.isFinite(conceptId) || !Number.isFinite(questionId) || !answer) {
			return fail(400, { error: 'Missing answer payload' });
		}

		const [question] = await db
			.select({
				id: questions.id,
				correctAnswer: questions.correctAnswer
			})
			.from(questions)
			.where(eq(questions.id, questionId))
			.limit(1);

		if (!question) {
			return fail(404, { error: 'Question not found' });
		}

		const isCorrect = isAnswerCorrect(answer, question.correctAnswer);
		const conceptProgress = await updateConceptProgress(userId, conceptId, isCorrect);
		const skillProgress = await updateSkillProgress(userId, skillId);
		await checkAndUnlockSkills(userId, languageCode);

		return {
			isCorrect,
			correctAnswer: question.correctAnswer,
			mastery: conceptProgress.mastery,
			skillMastery: skillProgress.mastery
		};
	}
};
