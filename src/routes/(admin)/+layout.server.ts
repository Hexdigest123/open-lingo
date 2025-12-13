import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, lessons, questions } from '$lib/server/db/schema';
import { count, sql, gte } from 'drizzle-orm';

export const load: LayoutServerLoad = async ({ locals }) => {
	// Auth guard - must be logged in
	if (!locals.user) {
		redirect(303, '/login');
	}

	// Admin guard - must be admin role
	if (locals.user.role !== 'admin') {
		redirect(303, '/dashboard');
	}

	// Get admin stats
	const [userCount] = await db.select({ count: count() }).from(users);
	const [lessonCount] = await db.select({ count: count() }).from(lessons);
	const [questionCount] = await db.select({ count: count() }).from(questions);

	// Active today (users with activity in last 24 hours)
	const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
	const [activeCount] = await db
		.select({ count: count() })
		.from(users)
		.where(gte(users.updatedAt, yesterday));

	return {
		user: locals.user,
		adminStats: {
			totalUsers: userCount?.count || 0,
			totalLessons: lessonCount?.count || 0,
			totalQuestions: questionCount?.count || 0,
			activeToday: activeCount?.count || 0
		}
	};
};
