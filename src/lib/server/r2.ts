import {
	CLOUDFLARE_ACCOUNT_ID,
	CLOUDFLARE_ACCESS_KEY_ID,
	CLOUDFLARE_SECRET_ACCESS_KEY,
	CLOUDFLARE_BUCKET_NAME,
	CLOUDFLARE_BUCKET_URL
} from '$env/static/private';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function saveToBucket(data: Buffer, key: string) {
	console.log('+ base64 generated and buffer initialize');
	const S3 = new S3Client({
		region: 'auto',
		endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
		credentials: {
			accessKeyId: CLOUDFLARE_ACCESS_KEY_ID,
			secretAccessKey: CLOUDFLARE_SECRET_ACCESS_KEY
		}
	});
	await S3.send(
		new PutObjectCommand({
			ACL: 'public-read',
			Key: key,
			Body: data,
			Bucket: CLOUDFLARE_BUCKET_NAME
		})
	);
	return `${CLOUDFLARE_BUCKET_URL}/${key}`;
}
