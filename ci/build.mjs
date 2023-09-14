import { connect } from '@dagger.io/dagger';

connect(
	async (client) => {
		const nodeCache = client.cacheVolume('node');
		const node = await client
			.container()
			.from('node:18')
			.withDirectory('/app', client.host().directory('.'), {
				exclude: ['node_modules', 'ci']
			})
			.withMountedCache('/app/node_modules', nodeCache);

		const runner = node.withWorkdir('/app').withExec(['npm', 'install', '--ignore-scripts']);
		await runner
			.withEnvVariable('BUILD_ON_NODE', 'y')
			.withEnvVariable('GIPHY_TOKEN', 'giphy_token')
			.withEnvVariable('UNSPLASH_TOKEN', 'unsplash_token')
			.withEnvVariable('DATABASE_URL', 'libsql://fake-url.com')
			.withEnvVariable('DATABASE_TOKEN', 'token')
			.withEnvVariable('GITHUB_CLIENT_ID', 'id')
			.withEnvVariable('GITHUB_CLIENT_SECRET', 'secret')
			.withEnvVariable('OPENAI_TOKEN', 'secret')
			.withEnvVariable('OPENAI_ORG', 'secret')
			.withEnvVariable('CLOUDFLARE_SECRET_ACCESS_KEY', 'secret')
			.withEnvVariable('CLOUDFLARE_ACCESS_KEY_ID', 'secret')
			.withEnvVariable('CLOUDFLARE_ACCOUNT_ID', 'secret')
			.withEnvVariable('CLOUDFLARE_TOKEN', 'secret')
			.withEnvVariable('CLOUDFLARE_BUCKET_NAME', 'secret')
			.withEnvVariable('CLOUDFLARE_BUCKET_URL', 'secret')
			.withEnvVariable('STRIPE_KEY', 'secret')
			.withEnvVariable('STRIPE_PRODUCT_ID', 'secret')
			.withEnvVariable('STRIPE_PRICE_ID', 'secret')
			.withEnvVariable('STRIPE_SUCCESS_URL', 'secret')
			.withEnvVariable('STRIPE_CANCEL_URL', 'secret')
			.withEnvVariable('STRIPE_CHECKOUT_HOOK_SIGNATURE', 'secret')
			.withExec(['npm', 'run', 'build'])
			.stderr();
	},
	{ LogOutput: process.stdout }
);
