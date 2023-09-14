<script lang="ts">
	import { db } from '$lib/storage/db';

	export let data;
	let dev_token = '';
	let hashnode_token = '';
	let hashnode_publication_id = '';

	data.settings.forEach((setting) => {
		switch (setting.name) {
			case 'dev_token':
				dev_token = setting.value;
				break;
			case 'hashnode_token':
				hashnode_token = setting.value;
				break;
			case 'hashnode_publication_id':
				hashnode_publication_id = setting.value;
				break;
		}
	});

	const handleSave = async () => {
		await db.updateOrCreateSettings({ name: 'dev_token', value: dev_token });
		await db.updateOrCreateSettings({ name: 'hashnode_token', value: hashnode_token });
		await db.updateOrCreateSettings({
			name: 'hashnode_publication_id',
			value: hashnode_publication_id
		});
	};
</script>

<div>
	<label class="label">
		<span>Dev.to</span>
		<input bind:value={dev_token} class="input" placeholder="dev.to api key" />
	</label>
	<label class="label">
		<span>Hashnode</span>
		<input bind:value={hashnode_token} class="input" placeholder="hashnode personal token" />
	</label>
	<label class="label">
		<span>Hashnode Publication Id</span>
		<input
			bind:value={hashnode_publication_id}
			class="input"
			placeholder="hashnode publication id"
		/>
	</label>
</div>

<button class="btn variant-filled-primary" on:click={handleSave}>Save</button>
