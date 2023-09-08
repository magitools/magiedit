import {
	STRIPE_CANCEL_URL,
	STRIPE_KEY,
	STRIPE_PRICE_ID,
	STRIPE_SUCCESS_URL
} from '$env/static/private';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import Stripe from 'stripe';

const stripe = new Stripe(STRIPE_KEY, {
	apiVersion: '2023-08-16'
});

export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw error(401, { message: 'unauthorized' });
	}
	const { quantity } = await request.json();
	if (!quantity) {
		throw error(500, { message: 'invalid data' });
	}
	const paySession = await stripe.checkout.sessions.create({
		line_items: [{ price: STRIPE_PRICE_ID, quantity }],
		success_url: STRIPE_SUCCESS_URL,
		cancel_url: STRIPE_CANCEL_URL,
		client_reference_id: session.user.userId,
		mode: 'payment'
	});
	return json({ url: paySession.url });
};
