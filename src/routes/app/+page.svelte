<script lang="ts">
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	export let data;
</script>

<div class="flex justify-center items-center space-x-4 bg-background">
	<Button href="/app/write/new">Create</Button>
	<span>or</span>
	<Button href="/app/write/load">Load</Button>
</div>

{#if data.articles.length === 0}
	<div class="flex flex-col items-center h-full justify-center">
		<p>looks like you don't have any articles</p>
	</div>
{:else}
	<div class="flex flex-wrap items-center gap-4 mt-4">
		{#each data.articles as article}
			{#if article}
				<div>
					<ArticleCard {article} userId={data.userId} />
				</div>
			{/if}
		{/each}
	</div>
{/if}
