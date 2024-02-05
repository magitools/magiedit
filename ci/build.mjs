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
			.withEnvVariable('DATABASE_URL', 'libsql://fake-url.com')
			.withEnvVariable('DATABASE_TOKEN', 'token')
			.withEnvVariable('GITHUB_CLIENT_ID', 'id')
			.withEnvVariable('GITHUB_CLIENT_SECRET', 'secret')
			.withEnvVariable('COOKIE_ENCRYPTION_KEY', 'change_this_in_prod')
			.withExec(['npm', 'run', 'build'])
			.stderr();
	},
	{ LogOutput: process.stdout }
);
