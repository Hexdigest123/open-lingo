import { db } from '$lib/server/db';
import {
	friendships,
	userStats,
	users,
	type Friendship,
	type FriendshipStatus
} from '$lib/server/db/schema';
import { and, desc, eq, or } from 'drizzle-orm';

export interface FriendUser {
	id: number;
	displayName: string;
	avatarUrl: string | null;
	xpTotal: number;
}

export interface FriendListItem {
	friendshipId: number;
	createdAt: Date;
	updatedAt: Date;
	friend: FriendUser;
}

export interface PendingRequestItem {
	friendshipId: number;
	createdAt: Date;
	requester: FriendUser;
}

async function findExistingFriendship(userA: number, userB: number): Promise<Friendship | null> {
	const [existing] = await db
		.select()
		.from(friendships)
		.where(
			or(
				and(eq(friendships.requesterId, userA), eq(friendships.addresseeId, userB)),
				and(eq(friendships.requesterId, userB), eq(friendships.addresseeId, userA))
			)
		)
		.limit(1);

	return existing ?? null;
}

export async function sendFriendRequest(
	requesterId: number,
	addresseeId: number
): Promise<Friendship> {
	if (requesterId === addresseeId) {
		throw new Error('Cannot send friend request to yourself');
	}

	const existing = await findExistingFriendship(requesterId, addresseeId);
	if (existing) {
		return existing;
	}

	const [friendship] = await db
		.insert(friendships)
		.values({ requesterId, addresseeId, status: 'pending' })
		.returning();

	return friendship;
}

async function updateFriendshipStatus(
	friendshipId: number,
	addresseeId: number,
	status: FriendshipStatus
): Promise<Friendship | null> {
	const [updated] = await db
		.update(friendships)
		.set({ status, updatedAt: new Date() })
		.where(and(eq(friendships.id, friendshipId), eq(friendships.addresseeId, addresseeId)))
		.returning();

	return updated ?? null;
}

export async function acceptFriendRequest(
	friendshipId: number,
	addresseeId: number
): Promise<Friendship | null> {
	return updateFriendshipStatus(friendshipId, addresseeId, 'accepted');
}

export async function rejectFriendRequest(
	friendshipId: number,
	addresseeId: number
): Promise<Friendship | null> {
	return updateFriendshipStatus(friendshipId, addresseeId, 'rejected');
}

export async function removeFriend(userId: number, friendId: number): Promise<boolean> {
	const deleted = await db
		.delete(friendships)
		.where(
			or(
				and(eq(friendships.requesterId, userId), eq(friendships.addresseeId, friendId)),
				and(eq(friendships.requesterId, friendId), eq(friendships.addresseeId, userId))
			)
		)
		.returning({ id: friendships.id });

	return deleted.length > 0;
}

export async function getFriends(userId: number): Promise<FriendListItem[]> {
	const outgoing = await db
		.select({
			friendshipId: friendships.id,
			createdAt: friendships.createdAt,
			updatedAt: friendships.updatedAt,
			friendId: users.id,
			displayName: users.displayName,
			avatarUrl: users.avatarUrl,
			xpTotal: userStats.xpTotal
		})
		.from(friendships)
		.innerJoin(users, eq(users.id, friendships.addresseeId))
		.leftJoin(userStats, eq(userStats.userId, users.id))
		.where(and(eq(friendships.requesterId, userId), eq(friendships.status, 'accepted')));

	const incoming = await db
		.select({
			friendshipId: friendships.id,
			createdAt: friendships.createdAt,
			updatedAt: friendships.updatedAt,
			friendId: users.id,
			displayName: users.displayName,
			avatarUrl: users.avatarUrl,
			xpTotal: userStats.xpTotal
		})
		.from(friendships)
		.innerJoin(users, eq(users.id, friendships.requesterId))
		.leftJoin(userStats, eq(userStats.userId, users.id))
		.where(and(eq(friendships.addresseeId, userId), eq(friendships.status, 'accepted')));

	return [...outgoing, ...incoming]
		.map((row) => ({
			friendshipId: row.friendshipId,
			createdAt: row.createdAt,
			updatedAt: row.updatedAt,
			friend: {
				id: row.friendId,
				displayName: row.displayName,
				avatarUrl: row.avatarUrl,
				xpTotal: row.xpTotal ?? 0
			}
		}))
		.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export async function getPendingRequests(userId: number): Promise<PendingRequestItem[]> {
	const rows = await db
		.select({
			friendshipId: friendships.id,
			createdAt: friendships.createdAt,
			requesterId: users.id,
			displayName: users.displayName,
			avatarUrl: users.avatarUrl,
			xpTotal: userStats.xpTotal
		})
		.from(friendships)
		.innerJoin(users, eq(users.id, friendships.requesterId))
		.leftJoin(userStats, eq(userStats.userId, users.id))
		.where(and(eq(friendships.addresseeId, userId), eq(friendships.status, 'pending')))
		.orderBy(desc(friendships.createdAt));

	return rows.map((row) => ({
		friendshipId: row.friendshipId,
		createdAt: row.createdAt,
		requester: {
			id: row.requesterId,
			displayName: row.displayName,
			avatarUrl: row.avatarUrl,
			xpTotal: row.xpTotal ?? 0
		}
	}));
}

export async function getFriendIds(userId: number): Promise<number[]> {
	const rows = await db
		.select({ requesterId: friendships.requesterId, addresseeId: friendships.addresseeId })
		.from(friendships)
		.where(
			and(
				eq(friendships.status, 'accepted'),
				or(eq(friendships.requesterId, userId), eq(friendships.addresseeId, userId))
			)
		);

	return rows.map((row) => (row.requesterId === userId ? row.addresseeId : row.requesterId));
}
