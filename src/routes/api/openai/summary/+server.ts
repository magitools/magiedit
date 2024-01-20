import { user } from '$lib/server/drizzle';
import { db } from '$lib/server/db';
import { fail, type RequestHandler, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { decode } from 'gpt-tokenizer';
import { OpenAI } from 'openai';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw fail(401, { message: 'unauthorized access' });
	}
	const { content } = await request.json();
	if (!content) {
		throw fail(500, { message: 'invalid request' });
	}
	const { OPENAI_ORG, OPENAI_TOKEN } = env;
	if (!OPENAI_ORG || !OPENAI_TOKEN) {
		throw fail(500, { message: 'OpenAI configuration not found' });
	}
	const text = decode(content);
	const openai = new OpenAI({
		organization: OPENAI_ORG,
		apiKey: OPENAI_TOKEN
	});
	const tokenCost = Math.ceil(((content.length / 1000) * 0.6) / 0.5);
	if (tokenCost > session?.user?.aiCredits) {
		throw fail(500, { message: 'not enough credits' });
	}
	const response = await openai.chat.completions.create({
		model: 'gpt-4',
		messages: [
			{
				role: 'system',
				content:
					"you resume articles by generating a prompt for dall-e' image generation. You will answer only with the generated prompt and your answer will only be 1 sentence. The generated prompt must include as much detail as possible and be eye-catching"
			},
			{ role: 'user', content: `generate a prompt for dall-e using the following article: ${text}` }
		]
	});
	const answer = response.choices[0].message.content;
	if (!answer) {
		throw fail(500, { message: 'invalid response' });
	}
	await db
		.update(user)
		.set({ aiCredits: session?.user?.aiCredits - tokenCost })
		.where(eq(user.id, session?.user?.userId));
	return json({ answer: answer });
};
