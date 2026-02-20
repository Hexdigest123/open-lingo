import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import {
	concepts,
	languages,
	questionConcepts,
	skillConcepts,
	skills
} from '$lib/server/db/schema';
import { asc, eq, sql } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const [conceptsByLanguage, skillsByLanguage, questionCountRows, skillList] = await Promise.all([
		db
			.select({
				languageCode: concepts.languageCode,
				languageName: languages.name,
				type: concepts.type,
				count: sql<number>`count(*)`
			})
			.from(concepts)
			.innerJoin(languages, eq(languages.code, concepts.languageCode))
			.groupBy(concepts.languageCode, languages.name, concepts.type)
			.orderBy(asc(concepts.languageCode), asc(concepts.type)),
		db
			.select({
				languageCode: skills.languageCode,
				languageName: languages.name,
				count: sql<number>`count(*)`
			})
			.from(skills)
			.innerJoin(languages, eq(languages.code, skills.languageCode))
			.groupBy(skills.languageCode, languages.name)
			.orderBy(asc(skills.languageCode)),
		db
			.select({
				count: sql<number>`count(distinct ${questionConcepts.questionId})`
			})
			.from(questionConcepts),
		db
			.select({
				id: skills.id,
				key: skills.key,
				type: skills.type,
				cefrLevel: skills.cefrLevel,
				languageCode: skills.languageCode,
				languageName: languages.name,
				isActive: skills.isActive,
				conceptCount: sql<number>`count(distinct ${skillConcepts.conceptId})`
			})
			.from(skills)
			.innerJoin(languages, eq(languages.code, skills.languageCode))
			.leftJoin(skillConcepts, eq(skillConcepts.skillId, skills.id))
			.groupBy(
				skills.id,
				skills.key,
				skills.type,
				skills.cefrLevel,
				skills.languageCode,
				languages.name,
				skills.isActive
			)
			.orderBy(asc(skills.languageCode), asc(skills.order), asc(skills.id))
	]);

	const questionCount = Number(questionCountRows[0]?.count ?? 0);

	return {
		stats: {
			conceptsByLanguage: conceptsByLanguage.map((row) => ({
				...row,
				count: Number(row.count)
			})),
			skillsByLanguage: skillsByLanguage.map((row) => ({
				...row,
				count: Number(row.count)
			})),
			questionCount
		},
		skills: skillList.map((row) => ({
			...row,
			conceptCount: Number(row.conceptCount)
		}))
	};
};

export const actions: Actions = {};
