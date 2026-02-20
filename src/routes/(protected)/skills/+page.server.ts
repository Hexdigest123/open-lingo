import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { getSkillTree } from '$lib/server/learning/content-service';
import { getDueReviewCount } from '$lib/server/learning/review-service';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user!.id;

	const [userLanguage] = await db
		.select({ activeLanguage: users.activeLanguage })
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	const languageCode = userLanguage?.activeLanguage ?? 'es';

	const [skills, dueReviewCount] = await Promise.all([
		getSkillTree(languageCode, userId),
		getDueReviewCount(userId, languageCode)
	]);

	return {
		skills,
		dueReviewCount,
		languageCode
	};
};

export const actions: Actions = {};
