import { env } from '$env/dynamic/private';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
	if (!env.ENCRYPTION_KEY) {
		throw new Error('ENCRYPTION_KEY is not set');
	}
	// ENCRYPTION_KEY should be a 64-character hex string (32 bytes)
	return Buffer.from(env.ENCRYPTION_KEY, 'hex');
}

export function encryptApiKey(apiKey: string): string {
	const key = getEncryptionKey();
	const iv = randomBytes(IV_LENGTH);

	const cipher = createCipheriv(ALGORITHM, key, iv);
	let encrypted = cipher.update(apiKey, 'utf8', 'hex');
	encrypted += cipher.final('hex');

	const authTag = cipher.getAuthTag();

	// Format: iv:authTag:encrypted (all hex encoded)
	return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decryptApiKey(encryptedData: string): string {
	const key = getEncryptionKey();
	const parts = encryptedData.split(':');

	if (parts.length !== 3) {
		throw new Error('Invalid encrypted data format');
	}

	const iv = Buffer.from(parts[0], 'hex');
	const authTag = Buffer.from(parts[1], 'hex');
	const encrypted = parts[2];

	const decipher = createDecipheriv(ALGORITHM, key, iv);
	decipher.setAuthTag(authTag);

	let decrypted = decipher.update(encrypted, 'hex', 'utf8');
	decrypted += decipher.final('utf8');

	return decrypted;
}
