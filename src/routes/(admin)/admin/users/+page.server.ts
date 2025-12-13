import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, userStats } from '$lib/server/db/schema';
import { eq, ilike, or, desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url }) => {
	const search = url.searchParams.get('search') || '';

	const baseQuery = db
		.select({
			id: users.id,
			email: users.email,
			displayName: users.displayName,
			role: users.role,
			createdAt: users.createdAt,
			updatedAt: users.updatedAt,
			xpTotal: userStats.xpTotal,
			currentStreak: userStats.currentStreak
		})
		.from(users)
		.leftJoin(userStats, eq(users.id, userStats.userId));

	const userList = search
		? await baseQuery
				.where(or(ilike(users.email, `%${search}%`), ilike(users.displayName, `%${search}%`)))
				.orderBy(desc(users.createdAt))
				.limit(100)
		: await baseQuery.orderBy(desc(users.createdAt)).limit(100);

	return {
		users: userList,
		search
	};
};

export const actions: Actions = {
	changeRole: async ({ request, locals }) => {
		const data = await request.formData();
		const userId = parseInt(data.get('userId')?.toString() || '0');
		const newRole = data.get('newRole')?.toString() as 'user' | 'admin';

		if (!userId || !newRole) {
			return fail(400, { error: 'User ID and role are required' });
		}

		// Prevent changing own role
		if (userId === locals.user?.id) {
			return fail(400, { error: 'Cannot change your own role' });
		}

		try {
			await db.update(users).set({ role: newRole }).where(eq(users.id, userId));
			return { success: true };
		} catch (error) {
			console.error('Failed to change role:', error);
			return fail(500, { error: 'Failed to change user role' });
		}
	},

	deleteUser: async ({ request, locals }) => {
		const data = await request.formData();
		const userId = parseInt(data.get('userId')?.toString() || '0');

		if (!userId) {
			return fail(400, { error: 'User ID is required' });
		}

		// Prevent deleting self
		if (userId === locals.user?.id) {
			return fail(400, { error: 'Cannot delete your own account' });
		}

		try {
			await db.delete(users).where(eq(users.id, userId));
			return { success: true };
		} catch (error) {
			console.error('Failed to delete user:', error);
			return fail(500, { error: 'Failed to delete user' });
		}
	}
};
