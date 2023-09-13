<script lang="ts">
	import { ProgressRadial, getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { slide } from 'svelte/transition';
	import { encode } from 'gpt-tokenizer';

	let summary = '';
	let amount = 1;
	let loading = false;
	let loadingText = 'Loading, this may take a while';
	const toastStore = getToastStore();
	const modalStore = getModalStore();
	const handleSearch = async () => {
		loading = true;
		loadingText = `generating image${amount > 1 ? 's' : ''}, please wait...`;
		const data = await (await fetch(`/api/openai/image?query=${summary}&amount=${amount}`)).json();
		console.log(data.images);
		results = data.images;
		loading = false;
	};
	const handleGenerateSummary = async () => {
		loading = true;
		loadingText = 'Genering summary from your article';
		const res = await (
			await fetch('/api/openai/summary', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ content: token })
			})
		).json();
		console.log(res);
		summary = res.answer;
		loading = false;
	};
	const handleImageSelected = async (idx: number) => {
		loading = true;
		loadingText = 'Saving image, please wait';
		const formData = new FormData();
		formData.append('content', results[idx]);
		formData.append('description', summary);
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
			$modalStore[0].response(`![${summary}](${data.url})`);
			modalStore.close();
		}
	};
	$: token = encode($modalStore[0].meta.content);
	$: tokenCount = token.length ?? 0;
	$: cost = (tokenCount / 1000) * 0.1;
	$: creditCost = Math.ceil(cost / 0.5);
	let results: string[] = [];
</script>

<div class="w-modal-wide max-h-[50%]">
	<aside class="alert variant-filled-error">
		<div class="alert-message">
			<h3 class="h3">Attention</h3>
			<p>
				Summary generation is currently not perfected. You can use it, but expect weird results!
			</p>
		</div>
	</aside>
	<label for="query" class="label"
		><span>Article Summary</span>
		<input
			type="text"
			name="query"
			id="query"
			class="input"
			bind:value={summary}
			disabled={loading}
		/>
	</label>
	<button class="btn variant-filled" disabled={loading} on:click={handleGenerateSummary}
		>Generate Summary (will approximately cost you {creditCost} credit)</button
	>
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
			<p transition:slide>{loadingText}</p>
		</div>
	{/if}
	<div class="grid grid-cols-3 gap-4 overflow-y-auto h-full">
		{#each results as result, idx}
			<button on:click={() => handleImageSelected(idx)}>
				<img src={result} alt={summary} />
			</button>
		{/each}
	</div>
</div>
