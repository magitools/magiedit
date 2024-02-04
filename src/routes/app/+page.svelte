<script lang="ts">
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import { toast } from 'svelte-sonner';

	export let data;
	let articles: any[] = [];
	let publishingResult = '';
	let publishDialog = false;
	let choiceDialog = false;
	let articleId: number | null = null;
	let selectedPublishers = [];

	$: articles = [...data.articles];

	function filterArticles(event: CustomEvent<any>) {
		articles = articles.filter((e) => e && e.id !== event.detail.id);
	}

	function handleArticleChoice(event) {
		articleId = event.detail;
		choiceDialog = true;
	}
	async function handlePublish() {
		choiceDialog = false;
		const data = new FormData();
		const toastId = toast.loading('Publishing...');
		if (articleId === null || selectedPublishers.length === 0) return;
		data.append('id', articleId.toString());
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
							on:publish={handleArticleChoice}
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

<Dialog.Root bind:open={choiceDialog}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Where would you like to publish?</Dialog.Title>
			<Dialog.Description>
				<Select.Root multiple onSelectedChange={(e) => (selectedPublishers = e)}>
					<Select.Trigger>
						<Select.Value placeholder="publishing platforms" />
					</Select.Trigger>
					<Select.Content>
						{#each data.publications as platform}
							<Select.Item value={platform.id}>{platform.name}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button on:click={() => handlePublish()}>Publish</Button>
			<Button variant="destructive" on:click={() => (choiceDialog = false)}>Cancel</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

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
