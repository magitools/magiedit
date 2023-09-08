<script lang="ts">
	import { ProgressRadial, getModalStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	let loading = false;

	const modalStore = getModalStore();
	const handleImageSelected = async (idx: number) => {
		if ($modalStore[0].response) {
			$modalStore[0].response(`![${results[idx].description}](${results[idx].url!})`);
			modalStore.close();
		}
	};

	onMount(async () => {
		results = (await (await fetch('/api/images')).json()).images;
	});

	let results: { description: string; url: string }[] = [];
</script>

<div class="w-modal-wide max-h-[50%]">
	{#if loading}
		<div class="w-full flex flex-col justify-center items-center">
			<ProgressRadial />
			<p>This may take a while, sorry...</p>
		</div>
	{/if}
	<div class="grid grid-cols-3 gap-4 overflow-y-auto h-full">
		{#each results as result, idx}
			<button on:click={() => handleImageSelected(idx)}>
				<img src={result.url} alt={result.description} />
			</button>
		{/each}
	</div>
</div>
