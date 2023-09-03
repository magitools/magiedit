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

		const runner = node.withWorkdir('/app').withExec(['npm', 'install']);
		runner
			.withEnvVariable('BUILD_ON_NODE', 'y')
			.withEnvVariable('GIPHY_TOKEN', 'giphy_token')
			.withEnvVariable('UNSPLASH_TOKEN', 'unsplash_token')
			.withExec(['npm', 'run', 'build']);

		await runner
			.withExec(['npx', 'playwright', 'install-deps'])
			.withExec(['npx', 'playwright', 'install'])
			.withExec(['npx', 'playwright', 'test'])
			.stderr();
	},
	{ LogOutput: process.stdout }
);
