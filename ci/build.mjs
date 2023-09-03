import { connect } from '@dagger.io/dagger';

connect(
	async (client) => {
		const node = await client
			.container()
			.from('node:18-alpine')
			.withDirectory('/app', client.host().directory('.'), {
				exclude: ['node_modules']
			});

		const runner = node.withWorkdir('/app').withExec(['npm', 'install']);
		const out = await runner
			.withEnvVariable('BUILD_ON_NODE', 'y')
			.withEnvVariable('GIPHY_TOKEN', 'giphy_token')
			.withEnvVariable('UNSPLASH_TOKEN', 'unsplash_token')
			.withExec(['npm', 'run', 'build'])
			.stderr();
	},
	{ LogOutput: process.stdout }
);
