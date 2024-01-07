<script lang="ts">
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	export let data;
	let articles: any[] = [];

	$: articles = [...data.articles];
	async function filterArticles(event: CustomEvent<any>) {
		articles = articles.filter((e) => e && e.id !== event.detail.id);
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
	<div class="flex flex-wrap items-center gap-4 mt-4">
		{#each articles as article}
			{#if article}
				{#key article.id}
					<div>
						<ArticleCard on:reload={(id) => filterArticles(id)} {article} userId={data.userId} />
					</div>
				{/key}
			{/if}
		{/each}
	</div>
{/if}
