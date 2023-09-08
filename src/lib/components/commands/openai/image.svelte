<script lang="ts">
	import { ProgressRadial, getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	let query = '';
	let amount = 1;
	let loading = false;

	const modalStore = getModalStore();
	const toastStore = getToastStore();
	const handleSearch = async () => {
		loading = true;
		const data = await (await fetch(`/api/openai/image?query=${query}&amount=${amount}`)).json();
		console.log(data.images);
		results = data.images;
		loading = false;
	};
	const handleImageSelected = async (idx: number) => {
		loading = true;
		const formData = new FormData();
		formData.append('content', results[idx]);
		formData.append('description', query);
		const data = await (
			await fetch('/api/openai/image', {
				method: 'POST',
				body: formData
			})
		).json();
		console.log(data);
		loading = false;
		if (!data.url) {
			toastStore.trigger({ message: 'could not save image, please try again later' });
			return;
		}
		if ($modalStore[0].response) {
			$modalStore[0].response(`![${query}](${data.url})`);
			modalStore.close();
		}
	};

	let results: string[] = [];
</script>

<div class="w-modal-wide max-h-[50%]">
	<label for="query" class="label"
		><span>Description</span>
		<input
			type="text"
			name="query"
			id="query"
			class="input"
			bind:value={query}
			disabled={loading}
		/>
	</label>
	<label for="amount" class="label">
		<span>Amount (1 token per image)</span>
		<input
			type="number"
			name="amount"
			id="amount"
			class="input"
			bind:value={amount}
			disabled={loading}
		/>
	</label>
	<button disabled={loading} class="btn variant-filled" on:click={handleSearch}>Generate</button>
	{#if loading}
		<div class="w-full flex flex-col justify-center items-center">
			<ProgressRadial />
			<p>This may take a while, sorry...</p>
		</div>
	{/if}
	<div class="grid grid-cols-3 gap-4 overflow-y-auto h-full">
		{#each results as result, idx}
			<button on:click={() => handleImageSelected(idx)}>
				<img src={result} alt={query} />
			</button>
		{/each}
	</div>
</div>
