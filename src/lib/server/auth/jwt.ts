import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { env } from '$env/dynamic/private';

export interface TokenPayload extends JWTPayload {
	userId: number;
	email: string;
	role: 'user' | 'admin';
}

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

function getAccessSecret(): Uint8Array {
	if (!env.JWT_ACCESS_SECRET) {
		throw new Error('JWT_ACCESS_SECRET is not set');
	}
	return new TextEncoder().encode(env.JWT_ACCESS_SECRET);
}

function getRefreshSecret(): Uint8Array {
	if (!env.JWT_REFRESH_SECRET) {
		throw new Error('JWT_REFRESH_SECRET is not set');
	}
	return new TextEncoder().encode(env.JWT_REFRESH_SECRET);
}

export async function createAccessToken(
	userId: number,
	email: string,
	role: 'user' | 'admin'
): Promise<string> {
	return new SignJWT({ userId, email, role })
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime(ACCESS_TOKEN_EXPIRY)
		.sign(getAccessSecret());
}

export async function createRefreshToken(
	userId: number,
	email: string,
	role: 'user' | 'admin'
): Promise<string> {
	return new SignJWT({ userId, email, role })
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime(REFRESH_TOKEN_EXPIRY)
		.sign(getRefreshSecret());
}

export async function verifyAccessToken(token: string): Promise<TokenPayload | null> {
	try {
		const { payload } = await jwtVerify(token, getAccessSecret());
		return payload as TokenPayload;
	} catch {
		return null;
	}
}

export async function verifyRefreshToken(token: string): Promise<TokenPayload | null> {
	try {
		const { payload } = await jwtVerify(token, getRefreshSecret());
		return payload as TokenPayload;
	} catch {
		return null;
	}
}

export function getRefreshTokenExpiry(): Date {
	return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
}
