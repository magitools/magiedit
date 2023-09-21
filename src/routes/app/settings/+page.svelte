<script lang="ts">
	export let data;
	let dev_token = '';
	let hashnode_token = '';
	let hashnode_publication_id = '';

	data.preferences.forEach((e) => {
		switch (e.key.split(':')[1]) {
			case 'dev':
				dev_token = e.value;
				break;
			case 'hash_token':
				hashnode_token = e.value;
				break;
			case 'hash_publication':
				hashnode_publication_id = e.value;
		}
	});
</script>

<form method="post">
	<label class="label" for="dev">
		<span>Dev.to</span>
		<input bind:value={dev_token} name="dev" class="input" placeholder="dev.to api key" />
	</label>
	<label class="label" for="hash_token">
		<span>Hashnode</span>
		<input
			name="hash_token"
			bind:value={hashnode_token}
			class="input"
			placeholder="hashnode personal token"
		/>
	</label>
	<label class="label" for="hash_publication">
		<span>Hashnode Publication Id</span>
		<input
			bind:value={hashnode_publication_id}
			class="input"
			name="hash_publication"
			placeholder="hashnode publication id"
		/>
	</label>
	<button type="submit" class="btn variant-filled-primary">Save</button>
</form>
