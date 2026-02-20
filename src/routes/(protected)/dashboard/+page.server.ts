import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { languages, users } from '$lib/server/db/schema';
import { getDueReviewCount } from '$lib/server/learning/review-service';
import { eq, asc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ parent, locals }) => {
	const { user, stats, activeLanguage } = await parent();
	const userWithLanguage = user as unknown as { activeLanguage?: string } | null;
	const languageCode = userWithLanguage?.activeLanguage ?? activeLanguage?.code ?? 'es';
	const dueReviewCount = await getDueReviewCount(locals.user!.id, languageCode);

	const availableLanguages = await db
		.select({
			code: languages.code,
			name: languages.name,
			nativeName: languages.nativeName,
			flagEmoji: languages.flagEmoji
		})
		.from(languages)
		.where(eq(languages.isActive, true))
		.orderBy(asc(languages.order));

	return {
		user,
		stats,
		activeLanguage,
		availableLanguages,
		dueReviewCount
	};
};

export const actions: Actions = {
	changeLanguage: async ({ request, locals }) => {
		const userId = locals.user!.id;
		const data = await request.formData();
		const languageCode = data.get('languageCode')?.toString().trim();

		if (!languageCode) {
			return fail(400, { languageError: 'Language is required' });
		}

		const [language] = await db
			.select({ code: languages.code })
			.from(languages)
			.where(eq(languages.code, languageCode))
			.limit(1);

		if (!language) {
			return fail(400, { languageError: 'Invalid language' });
		}

		await db
			.update(users)
			.set({ activeLanguage: languageCode, updatedAt: new Date() })
			.where(eq(users.id, userId));

		return { languageSuccess: true };
	}
};
