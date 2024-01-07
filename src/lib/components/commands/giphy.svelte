<script lang="ts">
	import type { GifsResult } from '@giphy/js-fetch-api';
	import { createEventDispatcher } from 'svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	let query = '';
	const dispatcher = createEventDispatcher<{ addToDoc: string }>();
	const handleSearch = async () => {
		const data = await (await fetch(`/api/giphy?query=${query}`)).json();
		console.log(data);
		results = data.data;
	};
	const handleImageSelected = (idx: number) => {
		dispatcher(
			'addToDoc',
			`![${results[idx].alt_text || results[idx].title}](${results[idx].images.original.url})`
		);
		open = false;
	};

	let results: GifsResult['data'] = [];
	export let open = false;
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Giphy Search</Dialog.Title>
		</Dialog.Header>
		<Label for="query">Search</Label>
		<Input type="search" bind:value={query} />
		<Button on:click={handleSearch}>Search</Button>
		<div class="grid grid-cols-3 gap-4 overflow-y-auto h-full max-h-72">
			{#each results as result, idx}
				<button on:click={() => handleImageSelected(idx)}>
					<img src={result.images.downsized_medium.url} alt={result.alt_text} />
				</button>
			{/each}
		</div>
	</Dialog.Content>
</Dialog.Root>
