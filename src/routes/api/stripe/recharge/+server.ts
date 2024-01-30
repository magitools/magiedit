import { env } from '$env/dynamic/private';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import Stripe from 'stripe';

export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.auth.validate();
	if (!session) {
		error(401, { message: 'unauthorized' });
	}
	const { quantity } = await request.json();
	if (!quantity) {
		error(500, { message: 'invalid data' });
	}
	if (
		!env.STRIPE_CANCEL_URL ||
		!env.STRIPE_KEY ||
		!env.STRIPE_PRICE_ID ||
		!env.STRIPE_SUCCESS_URL
	) {
		error(500, { message: 'stripe integration data not found' });
	}
	const stripe = new Stripe(env.STRIPE_KEY, {
		apiVersion: '2023-08-16'
	});
	const paySession = await stripe.checkout.sessions.create({
		line_items: [{ price: env.STRIPE_PRICE_ID, quantity }],
		success_url: env.STRIPE_SUCCESS_URL,
		cancel_url: env.STRIPE_CANCEL_URL,
		client_reference_id: session.user.userId,
		mode: 'payment'
	});
	return json({ url: paySession.url });
};
