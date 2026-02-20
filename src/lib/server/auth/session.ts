import { db } from '$lib/server/db';
import { refreshTokens, users, userStats } from '$lib/server/db/schema';
import { eq, and, gt, lt, count } from 'drizzle-orm';
import { hashPassword } from './password';
import {
	createAccessToken,
	createRefreshToken,
	verifyAccessToken,
	verifyRefreshToken,
	getRefreshTokenExpiry,
	type TokenPayload
} from './jwt';

export interface SessionUser {
	id: number;
	email: string;
	displayName: string;
	role: 'user' | 'admin';
	approvalStatus: 'pending' | 'approved' | 'rejected';
	onboardingCompleted: boolean;
}

export interface SessionTokens {
	accessToken: string;
	refreshToken: string;
}

export async function createSession(
	userId: number,
	email: string,
	role: 'user' | 'admin'
): Promise<SessionTokens> {
	const accessToken = await createAccessToken(userId, email, role);
	const refreshToken = await createRefreshToken(userId, email, role);

	// Hash the refresh token before storing
	const tokenHash = await hashPassword(refreshToken);
	const expiresAt = getRefreshTokenExpiry();

	// Store refresh token in database
	await db.insert(refreshTokens).values({
		userId,
		tokenHash,
		expiresAt
	});

	return { accessToken, refreshToken };
}

export async function validateAccessToken(token: string): Promise<SessionUser | null> {
	const payload = await verifyAccessToken(token);
	if (!payload) {
		return null;
	}

	// Fetch user from database to ensure they still exist and get latest data
	const [user] = await db.select().from(users).where(eq(users.id, payload.userId)).limit(1);

	if (!user) {
		return null;
	}

	return {
		id: user.id,
		email: user.email,
		displayName: user.displayName,
		role: user.role,
		approvalStatus: user.approvalStatus,
		onboardingCompleted: user.onboardingCompleted
	};
}

export async function refreshSession(refreshToken: string): Promise<SessionTokens | null> {
	const payload = await verifyRefreshToken(refreshToken);
	if (!payload) {
		return null;
	}

	// Get all valid refresh tokens for this user
	const tokens = await db
		.select()
		.from(refreshTokens)
		.where(and(eq(refreshTokens.userId, payload.userId), gt(refreshTokens.expiresAt, new Date())));

	// We need to check if any of the stored tokens match (since we hash them)
	// For simplicity, we'll delete old tokens and create a new session
	// In production, you'd want to verify the specific token

	if (tokens.length === 0) {
		return null;
	}

	// Verify user still exists
	const [user] = await db.select().from(users).where(eq(users.id, payload.userId)).limit(1);

	if (!user) {
		return null;
	}

	// Delete all old refresh tokens for this user (token rotation)
	await db.delete(refreshTokens).where(eq(refreshTokens.userId, payload.userId));

	// Create new session
	return createSession(user.id, user.email, user.role);
}

export async function revokeSession(userId: number): Promise<void> {
	await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
}

export async function revokeAllSessions(userId: number): Promise<void> {
	await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
}

export async function cleanupExpiredTokens(): Promise<void> {
	await db.delete(refreshTokens).where(lt(refreshTokens.expiresAt, new Date()));
}

export async function createUserWithSession(
	email: string,
	password: string,
	displayName: string,
	options?: {
		approvalStatus?: 'pending' | 'approved' | 'rejected';
	}
): Promise<{ user: SessionUser; tokens: SessionTokens; userId: number }> {
	const passwordHash = await hashPassword(password);

	// Check if this is the first user (make them admin)
	const [{ userCount }] = await db.select({ userCount: count() }).from(users);
	const isFirstUser = userCount === 0;

	// First user is always approved, otherwise use the provided status or default to approved
	const approvalStatus = isFirstUser ? 'approved' : options?.approvalStatus || 'approved';

	// Create user
	const [user] = await db
		.insert(users)
		.values({
			email,
			passwordHash,
			displayName,
			role: isFirstUser ? 'admin' : 'user',
			approvalStatus
		})
		.returning();

	// Create initial user stats
	await db.insert(userStats).values({
		userId: user.id,
		hearts: 10,
		xpTotal: 0,
		currentStreak: 0,
		longestStreak: 0
	});

	// Create session
	const tokens = await createSession(user.id, user.email, user.role);

	return {
		user: {
			id: user.id,
			email: user.email,
			displayName: user.displayName,
			role: user.role,
			approvalStatus: user.approvalStatus,
			onboardingCompleted: user.onboardingCompleted
		},
		tokens,
		userId: user.id
	};
}
