<script lang="ts">
	import { db } from "$lib/storage/db";
	import {generateArticleBlob} from "$lib/articles/download"
 	import { ProgressBar } from '@skeletonlabs/skeleton';
	import ArticleCard from "$lib/components/ArticleCard.svelte";

	export let data;
	let loading = false;

</script>

<div class="w-full h-full flex flex-col">
{#if loading}
<ProgressBar />
{/if}
<div>
<a class="btn variant-filled" href="/write/new">New</a>
</div>
<div class="w-full flex flex-wrap mt-4 px-4">
{#each data?.articles as article}
	<ArticleCard article={article} />
{/each}
</div>
</div>


