import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import {
	acceptFriendRequest,
	getFriends,
	getPendingRequests,
	rejectFriendRequest,
	removeFriend,
	sendFriendRequest
} from '$lib/server/learning/friend-service';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user!.id;

	const [friendsRaw, pendingRaw] = await Promise.all([
		getFriends(userId),
		getPendingRequests(userId)
	]);

	const friends = friendsRaw.map((entry) => ({
		friendshipId: entry.friendshipId,
		friendId: entry.friend.id,
		displayName: entry.friend.displayName,
		avatarUrl: entry.friend.avatarUrl,
		xpTotal: entry.friend.xpTotal
	}));

	const pendingRequests = pendingRaw.map((entry) => ({
		friendshipId: entry.friendshipId,
		requesterId: entry.requester.id,
		displayName: entry.requester.displayName,
		avatarUrl: entry.requester.avatarUrl
	}));

	return {
		friends,
		pendingRequests
	};
};

export const actions: Actions = {
	sendRequest: async ({ request, locals }) => {
		const requesterId = locals.user!.id;
		const data = await request.formData();
		const email = data.get('email')?.toString().trim().toLowerCase();

		if (!email || !email.includes('@')) {
			return fail(400, { sendRequestError: 'errors.invalidEmail' });
		}

		const [addressee] = await db
			.select({ id: users.id })
			.from(users)
			.where(eq(users.email, email))
			.limit(1);

		if (!addressee) {
			return fail(404, { sendRequestError: 'errors.userNotFound' });
		}

		try {
			await sendFriendRequest(requesterId, addressee.id);
			return { sendRequestSuccess: true };
		} catch (error) {
			console.error('Failed to send friend request:', error);
			return fail(400, {
				sendRequestError: error instanceof Error ? error.message : 'Failed to send request'
			});
		}
	},

	acceptRequest: async ({ request, locals }) => {
		const userId = locals.user!.id;
		const data = await request.formData();
		const friendshipId = Number.parseInt(data.get('friendshipId')?.toString() ?? '', 10);

		if (Number.isNaN(friendshipId) || friendshipId <= 0) {
			return fail(400, { acceptRequestError: 'Invalid request' });
		}

		const result = await acceptFriendRequest(friendshipId, userId);
		if (!result) {
			return fail(400, { acceptRequestError: 'Failed to accept request' });
		}

		return { acceptRequestSuccess: true };
	},

	rejectRequest: async ({ request, locals }) => {
		const userId = locals.user!.id;
		const data = await request.formData();
		const friendshipId = Number.parseInt(data.get('friendshipId')?.toString() ?? '', 10);

		if (Number.isNaN(friendshipId) || friendshipId <= 0) {
			return fail(400, { rejectRequestError: 'Invalid request' });
		}

		const result = await rejectFriendRequest(friendshipId, userId);
		if (!result) {
			return fail(400, { rejectRequestError: 'Failed to reject request' });
		}

		return { rejectRequestSuccess: true };
	},

	removeFriend: async ({ request, locals }) => {
		const userId = locals.user!.id;
		const data = await request.formData();
		const friendId = Number.parseInt(data.get('friendId')?.toString() ?? '', 10);

		if (Number.isNaN(friendId) || friendId <= 0) {
			return fail(400, { removeFriendError: 'Invalid friend' });
		}

		const removed = await removeFriend(userId, friendId);
		if (!removed) {
			return fail(400, { removeFriendError: 'Failed to remove friend' });
		}

		return { removeFriendSuccess: true };
	}
};
