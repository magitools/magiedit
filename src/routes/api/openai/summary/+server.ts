import { OPENAI_ORG, OPENAI_TOKEN } from '$env/static/private';
import { fail, type RequestHandler, json } from '@sveltejs/kit';
import { decode } from 'gpt-tokenizer';
import { OpenAI } from 'openai';

export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw fail(401, { message: 'unauthorized access' });
	}
	const { content } = await request.json();
	if (!content) {
		throw fail(500, { message: 'invalid request' });
	}
	const text = decode(content);
	const openai = new OpenAI({
		organization: OPENAI_ORG,
		apiKey: OPENAI_TOKEN
	});
	const response = await openai.chat.completions.create({
		model: 'gpt-4',
		messages: [
			{
				role: 'system',
				content:
					'you are an engineer tasked with writing prompts for dall-e 2 from an article. You may not describe texts or logos in the output prompt'
			},
			{ role: 'user', content: `generate a prompt for dall-e using the following article: ${text}` }
		]
	});
	console.log(response.choices[0]);
	const answer = response.choices[0].message.content;
	if (!answer) {
		throw fail(500, { message: 'invalid response' });
	}
	return json({ answer: answer });
};
