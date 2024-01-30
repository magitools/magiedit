import { error, json, type RequestHandler } from '@sveltejs/kit';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { db } from '$lib/server/db';
import { user, userImages } from '$lib/server/drizzle';
import { eq } from 'drizzle-orm';
import { saveToBucket } from '$lib/server/r2';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async ({ locals, url }) => {
	const session = await locals.auth.validate();
	if (!session) {
		error(401, { message: 'not authorized' });
	}
	if (session?.user?.aiCredits < 1) {
		error(401, { message: 'not enough credits' });
	}
	if (!env.OPENAI_TOKEN || !env.OPENAI_ORG) {
		error(500, { message: 'OpenAI configuration not found' });
	}
	const openai = new OpenAI({
		organization: env.OPENAI_ORG,
		apiKey: env.OPENAI_TOKEN
	});
	const query = url.searchParams.get('query');
	const amount = +(url.searchParams.get('amount') || 1);
	if (!query || !amount) {
		error(500, { message: 'invalid data provided' });
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
		error(401, { message: 'not authorized' });
	}
	const formData = await request.formData();
	const { content, description } = Object.fromEntries(formData);
	if (!content) {
		error(500, { message: 'invalid input' });
	}
	const arrayBuffer = await (await fetch(content.toString())).arrayBuffer();
	const data = Buffer.from(new Uint8Array(arrayBuffer));
	const key = `${session?.user?.userId}_${uuidv4()}`;
	const url = await saveToBucket(data, key);
	// get data from function
	await db.insert(userImages).values({
		url,
		userId: session?.user.userId,
		description: description?.toString()
	});
	return json({ message: 'ok', url });
};
