import { connect } from '@dagger.io/dagger';

connect(
	async (client) => {
		const nodeCache = client.cacheVolume('node');
		const node = await client
			.container()
			.from('node:18-alpine')
			.withDirectory('/app', client.host().directory('.'), {
				exclude: ['node_modules', 'ci']
			})
			.withMountedCache('/app/node_modules', nodeCache);

		const runner = node.withWorkdir('/app').withExec(['npm', 'install']);
		await runner
			.withEnvVariable('BUILD_ON_NODE', 'y')
			.withEnvVariable('GIPHY_TOKEN', 'giphy_token')
			.withEnvVariable('UNSPLASH_TOKEN', 'unsplash_token')
			.withEnvVariable('DATABASE_URL', 'url')
			.withEnvVariable('DATABASE_TOKEN', 'token')
			.withEnvVariable('GITHUB_CLIENT_ID', 'id')
			.withEnvVariable('GITHUB_CLIENT_SECRET', 'secret')
			.withExec(['npm', 'run', 'build'])
			.stderr();
	},
	{ LogOutput: process.stdout }
);
