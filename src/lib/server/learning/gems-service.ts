import { db } from '$lib/server/db';
import {
	shopItems,
	userPurchases,
	userStats,
	type ShopItem,
	type UserPurchase
} from '$lib/server/db/schema';
import { and, desc, eq, sql } from 'drizzle-orm';

export interface PurchaseResult {
	success: boolean;
	error?: string;
	item?: ShopItem;
}

export interface UserPurchaseHistoryItem {
	purchase: UserPurchase;
	item: ShopItem;
}

export async function awardGems(userId: number, amount: number): Promise<number> {
	if (amount <= 0) {
		return getUserGems(userId);
	}

	await db
		.update(userStats)
		.set({ gems: sql`${userStats.gems} + ${amount}` })
		.where(eq(userStats.userId, userId));

	return getUserGems(userId);
}

export async function purchaseItem(userId: number, itemId: number): Promise<PurchaseResult> {
	const [item] = await db
		.select()
		.from(shopItems)
		.where(and(eq(shopItems.id, itemId), eq(shopItems.isActive, true)))
		.limit(1);

	if (!item) {
		return { success: false, error: 'Item is unavailable' };
	}

	const [stats] = await db
		.select({ gems: userStats.gems })
		.from(userStats)
		.where(eq(userStats.userId, userId))
		.limit(1);

	if (!stats) {
		return { success: false, error: 'User stats not found' };
	}

	if (stats.gems < item.costGems) {
		return { success: false, error: 'Insufficient gems' };
	}

	await db
		.update(userStats)
		.set({ gems: sql`${userStats.gems} - ${item.costGems}` })
		.where(eq(userStats.userId, userId));

	await db.insert(userPurchases).values({ userId, itemId: item.id });
	await applyItemEffect(userId, item);

	return { success: true, item };
}

export async function getShopItems(): Promise<ShopItem[]> {
	return db
		.select()
		.from(shopItems)
		.where(eq(shopItems.isActive, true))
		.orderBy(shopItems.costGems, shopItems.id);
}

export async function getUserPurchases(userId: number): Promise<UserPurchaseHistoryItem[]> {
	const rows = await db
		.select({ purchase: userPurchases, item: shopItems })
		.from(userPurchases)
		.innerJoin(shopItems, eq(shopItems.id, userPurchases.itemId))
		.where(eq(userPurchases.userId, userId))
		.orderBy(desc(userPurchases.purchasedAt));

	return rows;
}

export async function applyItemEffect(userId: number, item: ShopItem): Promise<void> {
	if (item.effectType === 'streak_freeze') {
		await db
			.update(userStats)
			.set({ streakFreezes: sql`${userStats.streakFreezes} + ${item.effectValue}` })
			.where(eq(userStats.userId, userId));
		return;
	}

	if (item.effectType === 'heart_refill') {
		await db.update(userStats).set({ hearts: 10 }).where(eq(userStats.userId, userId));
		return;
	}

	if (item.effectType === 'xp_boost') {
		return;
	}
}

export async function getUserGems(userId: number): Promise<number> {
	const [stats] = await db
		.select({ gems: userStats.gems })
		.from(userStats)
		.where(eq(userStats.userId, userId))
		.limit(1);

	return stats?.gems ?? 0;
}
