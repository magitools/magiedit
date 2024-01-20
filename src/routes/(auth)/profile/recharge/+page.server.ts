import { env } from '$env/dynamic/private';
import { redirect, type ServerLoad } from '@sveltejs/kit';
import Stripe from 'stripe';
export const load: ServerLoad = async ({ parent }) => {
	const data = await parent();
	if (!data.enabledOptions.stripe) {
		redirect(301, '/app');
	}
	const { STRIPE_KEY, STRIPE_PRODUCT_ID } = env;
	const stripe = new Stripe(STRIPE_KEY, {
		apiVersion: '2023-08-16'
	});
	const product = await stripe.products.retrieve(STRIPE_PRODUCT_ID);
	let price;
	if (product.default_price) {
		price = await stripe.prices.retrieve(product.default_price.toString());
	} else {
		price = undefined;
	}
	return { product, price };
};
