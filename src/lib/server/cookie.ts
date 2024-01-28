import { COOKIE_ENCRYPTION_KEY } from '$env/static/private';
import { createCipheriv, createDecipheriv, getRandomValues, randomBytes } from 'node:crypto';

export function decode(value: string): string {
	const textParts = value.split(':');
	const iv = Buffer.from(textParts.shift()!, 'hex');
	const encryptedText = Buffer.from(textParts.join(':'), 'hex');
	const decipher = createDecipheriv('aes-256-cbc', Buffer.from(COOKIE_ENCRYPTION_KEY, 'hex'), iv);
	return Buffer.concat([decipher.update(encryptedText), decipher.final()]).toString();
}

export function encode(value: string): string {
	const iv = randomBytes(16);
	const cipher = createCipheriv('aes-256-cbc', Buffer.from(COOKIE_ENCRYPTION_KEY, 'hex'), iv);
	const encrypted = Buffer.concat([cipher.update(value), cipher.final()]);
	return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}
