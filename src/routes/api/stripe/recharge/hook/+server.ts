import { STRIPE_CHECKOUT_HOOK_SIGNATURE, STRIPE_KEY, STRIPE_PRICE_ID } from '$env/static/private';
import { fail, json, type RequestHandler } from '@sveltejs/kit';
import Stripe from 'stripe';
import { db } from '$lib/server/db';
import { user } from '$lib/server/drizzle';
import { eq } from 'drizzle-orm';

const stripe = new Stripe(STRIPE_KEY, {
	apiVersion: '2023-08-16'
});
export const POST: RequestHandler = async (event) => {
	const data = await event.request.arrayBuffer();
	if (!event.request.headers.has('stripe-signature')) {
		throw fail(500, { message: 'invalid header signature' });
	}
	const hook = stripe.webhooks.constructEvent(
		Buffer.from(data),
		event.request.headers.get('stripe-signature')!,
		STRIPE_CHECKOUT_HOOK_SIGNATURE
	);
	console.log(hook);
	if (!hook || hook.type !== 'checkout.session.completed') {
		return json({ message: 'unhandled hook' });
	}
	const hookData = hook.data.object as Stripe.Checkout.Session;
	const price = await stripe.prices.retrieve(STRIPE_PRICE_ID);
	const currentUserValue = await db
		.select()
		.from(user)
		.where(eq(user.id, hookData.client_reference_id!));
	if (currentUserValue.length !== 1) {
		throw fail(500, { message: 'invalid customer id' });
	}
	await db.update(user).set({
		aiCredits: currentUserValue[0].aiCredits! + hookData.amount_subtotal! / price.unit_amount!
	});
	return json({ message: 'ok' });
};
