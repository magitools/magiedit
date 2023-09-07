import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) {
		return {
			authed: false
		};
	}
	return {
		authed: session ? true : false,
		userId: session.user.userId,
		username: session.user.username,
		email: session.user.email
	};
};
