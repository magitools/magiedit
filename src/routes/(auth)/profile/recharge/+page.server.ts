import { STRIPE_KEY, STRIPE_PRODUCT_ID } from '$env/static/private';
import type { ServerLoad } from '@sveltejs/kit';
import Stripe from 'stripe';
const stripe = new Stripe(STRIPE_KEY, {
	apiVersion: '2023-08-16'
});
export const load: ServerLoad = async () => {
	const product = await stripe.products.retrieve(STRIPE_PRODUCT_ID);
	let price;
	if (product.default_price) {
		price = await stripe.prices.retrieve(product.default_price.toString());
	} else {
		price = undefined;
	}
	return { product, price };
};
