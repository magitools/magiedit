import { env } from '$env/dynamic/private';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		return {
			authed: false
		};
	}
	const enabledOptions = {
		ai: env.OPENAI_ORG && env.OPENAI_TOKEN,
		stripe:
			env.STRIPE_KEY &&
			env.STRIPE_CANCEL_URL &&
			env.STRIPE_CHECKOUT_HOOK_SIGNATURE &&
			env.STRIPE_PRICE_ID &&
			env.STRIPE_PRODUCT_ID &&
			env.STRIPE_SUCCESS_URL,
		storage:
			env.CLOUDFLARE_ACCOUNT_ID &&
			env.CLOUDFLARE_ACCESS_KEY_ID &&
			env.CLOUDFLARE_BUCKET_URL &&
			env.CLOUDFLARE_BUCKET_NAME &&
			env.CLOUDFLARE_BUCKET_URL
	};
	return {
		authed: session ? true : false,
		userId: session.user.userId,
		username: session.user.username,
		email: session.user.email,
		enabledOptions
	};
};
