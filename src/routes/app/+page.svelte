<script lang="ts">
	import ArticleCard from '$lib/components/ArticleCard.svelte';

	export let data;
</script>

<div class="flex justify-center items-center space-x-4">
	<a class="btn variant-filled" href="/app/write/new">Create</a>
	<span>or</span>
	<a class="btn variant-filled" href="/app/write/load">Load</a>
</div>

{#if data.articles.length === 0}
	<div class="flex flex-col items-center h-full justify-center">
		<p>looks like you don't have any articles</p>
	</div>
{:else}
	<div class="flex flex-wrap">
		{#each data.articles as article}
			{#if article}
				<ArticleCard {article} userId={data.userId} />
			{/if}
		{/each}
	</div>
{/if}
