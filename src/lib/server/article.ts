import { createDecipheriv, createHash } from 'node:crypto';

export async function decrypt(content: string, iv: string, key: string): Promise<string> {
	const keyBytes = createHash('sha256').update(key).digest();
	const articleBuffer = Buffer.from(content, 'base64');
	try {
		const ivBuffer = Buffer.from(iv.split(',').map((e) => parseInt(e)));
		const decipher = createDecipheriv('aes-256-cbc', keyBytes, ivBuffer);
		return Buffer.concat([decipher.update(articleBuffer), decipher.final()]).toString();
	} catch (error) {
		throw new Error(`failed to decrypt article`);
	}
}
