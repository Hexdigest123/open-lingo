import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users, lessons } from '$lib/server/db/schema';
import { count } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const [userCount] = await db.select({ count: count() }).from(users);
	const [lessonCount] = await db.select({ count: count() }).from(lessons);

	return {
		stats: {
			totalUsers: userCount?.count || 0,
			totalLessons: lessonCount?.count || 0
		}
	};
};
