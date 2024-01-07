<script lang="ts">
	import type { Basic } from 'unsplash-js/dist/methods/photos/types';
	import { createEventDispatcher } from 'svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Loader2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	let query = '';
	let loading = false;
	const dispatcher = createEventDispatcher<{ addToDoc: string }>();
	const handleSearch = async () => {
		loading = true;
		const data = await (await fetch(`/api/unsplash?query=${query}`)).json();
		results = data.photos;
		loading = false;
	};
	const handleImageSelected = (idx: number) => {
		dispatcher(
			'addToDoc',
			`![${results[idx].alt_description || results[idx].description}](${results[idx].urls.regular})`
		);
		open = false;
	};

	let results: Basic[] = [];
	export let open = false;
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Giphy Search</Dialog.Title>
		</Dialog.Header>
		<Label for="query">Search</Label>
		<Input disabled={loading} type="search" bind:value={query} />
		<Button disabled={loading} on:click={handleSearch}>
			{#if loading}
				<Loader2 />
			{/if}
			Search
		</Button>
		<div class="grid grid-cols-3 gap-4 overflow-y-auto h-full max-h-72">
			{#each results as result, idx}
				<button on:click={() => handleImageSelected(idx)}>
					<img src={result.urls.regular} alt={result.alt_description || result.description} />
				</button>
			{/each}
		</div>
	</Dialog.Content>
</Dialog.Root>
