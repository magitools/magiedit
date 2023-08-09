<script lang="ts">
	import { db } from "$lib/storage/db";
	import { ProgressBar } from '@skeletonlabs/skeleton';

	export let data;
	let loading = false;

	const handleDownload = async(id: string) => {
		loading = true;
		const article = await db.articles.get(id);
		if (!article) {
			alert("no article found");
			return;
		}
		const data = new Blob([article.content], {type: "plain/text"})
		const link = window.URL.createObjectURL(data)
		console.log(data)
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