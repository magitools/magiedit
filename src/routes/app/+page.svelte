<script lang="ts">
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { toast } from 'svelte-sonner';

	export let data;
	let articles: any[] = [];
	let publishingResult = '';
	let publishDialog = false;

	$: articles = [...data.articles];
	async function filterArticles(event: CustomEvent<any>) {
		articles = articles.filter((e) => e && e.id !== event.detail.id);
	}
	async function handlePublish(event) {
		console.log(event.detail);
		const data = new FormData();
		const toastId = toast.loading('Publishing...');
		data.append('id', event.detail);
		const res = await (
			await fetch('/api/articles/publish', {
				method: 'POST',
				body: data
			})
		).json();
		publishingResult = res.status;
		publishDialog = true;
		toast.success('Finished publishing', { id: toastId });
	}
</script>

<div class="flex justify-center items-center space-x-4 bg-background">
	<Button href="/app/write/new">Create</Button>
	<span>or</span>
	<Button href="/app/write/load">Load</Button>
</div>

{#if articles.length === 0}
	<div class="flex flex-col items-center h-full justify-center">
		<p>looks like you don't have any articles</p>
	</div>
{:else}
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
		{#each articles as article}
			{#if article}
				{#key article.id}
					<div>
						<ArticleCard
							on:publish={handlePublish}
							on:reload={(id) => filterArticles(id)}
							{article}
							userId={data.userId}
						/>
					</div>
				{/key}
			{/if}
		{/each}
	</div>
{/if}

<Dialog.Root bind:open={publishDialog}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Article finished publishing</Dialog.Title>
			<Dialog.Description>
				{publishingResult}
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button on:click={() => (publishDialog = false)}>Ok</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
