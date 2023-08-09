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
{#if loading}
<ProgressBar />
{/if}

<a href="/write/new">New Article</a>


{#each data?.articles as article}
	<div>
		<h2>{article.title}</h2>
		<a href={`/write/${article.id}`}>Edit</a>
		<button class="btn" on:click={() => handleDownload(article.id)}>Download</button>
	</div>
{/each}