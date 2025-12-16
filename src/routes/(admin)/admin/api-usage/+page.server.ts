import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { apiUsageLogs, users, chatSessions, chatMessages } from '$lib/server/db/schema';
import { eq, desc, sql, and, gte, count, sum } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url }) => {
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = 50;
	const offset = (page - 1) * limit;

	// Get usage logs with user info
	const logs = await db
		.select({
			id: apiUsageLogs.id,
			userId: apiUsageLogs.userId,
			userEmail: users.email,
			userDisplayName: users.displayName,
			usageType: apiUsageLogs.usageType,
			sessionId: apiUsageLogs.sessionId,
			promptTokens: apiUsageLogs.promptTokens,
			completionTokens: apiUsageLogs.completionTokens,
			totalTokens: apiUsageLogs.totalTokens,
			model: apiUsageLogs.model,
			createdAt: apiUsageLogs.createdAt
		})
		.from(apiUsageLogs)
		.innerJoin(users, eq(apiUsageLogs.userId, users.id))
		.orderBy(desc(apiUsageLogs.createdAt))
		.limit(limit)
		.offset(offset);

	// Get total count
	const [{ total }] = await db
		.select({ total: count() })
		.from(apiUsageLogs);

	// Get summary stats for the last 30 days
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

	const [stats] = await db
		.select({
			totalRequests: count(),
			totalTokens: sum(apiUsageLogs.totalTokens),
			chatRequests: sql<number>`count(case when ${apiUsageLogs.usageType} = 'chat' then 1 end)`,
			voiceRequests: sql<number>`count(case when ${apiUsageLogs.usageType} = 'voice' then 1 end)`,
			explainRequests: sql<number>`count(case when ${apiUsageLogs.usageType} = 'explain' then 1 end)`
		})
		.from(apiUsageLogs)
		.where(gte(apiUsageLogs.createdAt, thirtyDaysAgo));

	// Get per-user stats for the last 30 days
	const userStats = await db
		.select({
			userId: apiUsageLogs.userId,
			userEmail: users.email,
			userDisplayName: users.displayName,
			totalRequests: count(),
			totalTokens: sum(apiUsageLogs.totalTokens),
			chatRequests: sql<number>`count(case when ${apiUsageLogs.usageType} = 'chat' then 1 end)`,
			voiceRequests: sql<number>`count(case when ${apiUsageLogs.usageType} = 'voice' then 1 end)`,
			explainRequests: sql<number>`count(case when ${apiUsageLogs.usageType} = 'explain' then 1 end)`
		})
		.from(apiUsageLogs)
		.innerJoin(users, eq(apiUsageLogs.userId, users.id))
		.where(gte(apiUsageLogs.createdAt, thirtyDaysAgo))
		.groupBy(apiUsageLogs.userId, users.email, users.displayName)
		.orderBy(desc(sql`count(*)`))
		.limit(20);

	return {
		logs,
		total,
		page,
		limit,
		totalPages: Math.ceil(total / limit),
		stats: {
			totalRequests: stats.totalRequests ?? 0,
			totalTokens: Number(stats.totalTokens) || 0,
			chatRequests: Number(stats.chatRequests) || 0,
			voiceRequests: Number(stats.voiceRequests) || 0,
			explainRequests: Number(stats.explainRequests) || 0
		},
		userStats
	};
};
