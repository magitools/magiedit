import {
	OPENAI_TOKEN,
	OPENAI_ORG,
	CLOUDFLARE_ACCOUNT_ID,
	CLOUDFLARE_ACCESS_KEY_ID,
	CLOUDFLARE_SECRET_ACCESS_KEY,
	CLOUDFLARE_BUCKET_NAME,
	CLOUDFLARE_BUCKET_URL
} from '$env/static/private';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import OpenAI from 'openai';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { db } from '$lib/server/db';
import { user, userImages } from '$lib/server/drizzle';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals, url }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, { message: 'not authorized' });
	}
	if (session?.user?.aiCredits < 1) {
		throw error(401, { message: 'not enough credits' });
	}
	const openai = new OpenAI({
		organization: OPENAI_ORG,
		apiKey: OPENAI_TOKEN
	});
	const query = url.searchParams.get('query');
	const amount = +(url.searchParams.get('amount') || 1);
	if (!query || !amount) {
		throw error(500, { message: 'invalid data provided' });
	}
	const res = await openai.images.generate({
		prompt: query,
		n: amount,
		response_format: 'url',
		size: '1024x1024'
	});
	await db
		.update(user)
		.set({ aiCredits: session?.user?.aiCredits - 1 })
		.where(eq(user.id, session?.user?.userId));
	return json({ images: res.data.map((e) => e.url) });
};

export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, { message: 'not authorized' });
	}
	const formData = await request.formData();
	const { content, description } = Object.fromEntries(formData);
	if (!content) {
		throw error(500, { message: 'invalid input' });
	}
	const arrayBuffer = await (await fetch(content.toString())).arrayBuffer();
	const data = Buffer.from(new Uint8Array(arrayBuffer));
	console.log('+ base64 generated and buffer initialize');
	const S3 = new S3Client({
		region: 'auto',
		endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
		credentials: {
			accessKeyId: CLOUDFLARE_ACCESS_KEY_ID,
			secretAccessKey: CLOUDFLARE_SECRET_ACCESS_KEY
		}
	});
	const key = `${session?.user?.userId}_${uuidv4()}`;
	await S3.send(
		new PutObjectCommand({
			ACL: 'public-read',
			Key: key,
			Body: data,
			Bucket: CLOUDFLARE_BUCKET_NAME
		})
	);
	await db.insert(userImages).values({
		url: `${CLOUDFLARE_BUCKET_URL}/${key}`,
		userId: session?.user.userId,
		description: description?.toString()
	});
	return json({ message: 'ok', url: `${CLOUDFLARE_BUCKET_URL}/${key}` });
};
