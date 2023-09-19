<script lang="ts">
	import ArticleCard from '$lib/components/ArticleCard.svelte';

	export let data;
</script>

{#if data.articles.length === 0}
	<div class="flex flex-col items-center h-full justify-center">
		<p>looks like you don't have any articles</p>
		<div>
			<a class="btn variant-filled" href="/app/write/new">Create</a>
			or
			<a class="btn variant-filled" href="/app/write/load">Load</a>
		</div>
	</div>
{:else}
	<div class="flex flex-wrap">
		{#each data.articles as article}
			<ArticleCard {article} userId={data.userId} />
		{/each}
	</div>
{/if}
