<script lang="ts">
	import { db } from "$lib/storage/db";
	import {generateArticleBlob} from "$lib/articles/download"
 	import { ProgressBar } from '@skeletonlabs/skeleton';

	export let data;
	let loading = false;

	const handleDownload = async(id: string) => {
		loading = true;
		const article = await db.articles.get(id);
		const data = await generateArticleBlob(id);
		const link = window.URL.createObjectURL(data)
		let a = document.createElement("a");
		a.setAttribute("download", `${article.title}.md`);
		a.setAttribute("href", link);
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		loading = false;
	}
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
	<div class="card min-w-[300px]">
		<h2 class="card-header">{article.title}</h2>
		<section class="p-4">
		</section>
		<div class="card-footer">
		<a class="btn variant-filled" href={`/write/${article.id}`}>Edit</a>
		<button class="btn variant-filled" on:click={() => handleDownload(article.id)}>Download</button>
		</div>
	</div>
{/each}
</div>
</div>


