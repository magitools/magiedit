<script lang="ts">
	import { generateArticleBlob } from '$lib/articles/download';
	import type { IArticle } from '$lib/articles/types';
	import { getModalStore } from '@skeletonlabs/skeleton';
	let loading = false;
	export let article: IArticle;
	export let userId: string | undefined;

	let frontmatter = article.frontmatter ? article.frontmatter : {};
	const modalStore = getModalStore();
	const handleDownload = async (id: number) => {
		loading = true;
		//const article = await db.articles.get(id);
		const data = await generateArticleBlob(id);
		const link = window.URL.createObjectURL(data);
		let a = document.createElement('a');
		a.setAttribute('download', `${article.title}.md`);
		a.setAttribute('href', link);
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		loading = false;
	};
	const handlePublish = async () => {
		const data = new FormData();
		data.append('content', article.content || '');
		data.append('title', article.title || '');
		const res = await (
			await fetch('/api/articles/publish', {
				method: 'POST',
				body: data
			})
		).json();
		modalStore.trigger({
			type: 'alert',
			title: 'Finished Publishing',
			body: res.status.join('\n')
		});
	};
	console.log(article);
</script>

<div class="card max-w-[300px]">
	<h2 class="card-header">{article.title}</h2>
	{#if frontmatter?.cover}
		<img src={frontmatter.cover} class="w-full h-auto" alt="article cover" />
	{/if}
	<section class="p-4" />
	<div class="card-footer">
		<a class="btn variant-filled" href={`/app/write/${article.id}`}>Edit</a>
		<button
			class="btn variant-filled"
			disabled={loading}
			on:click={() => handleDownload(article.id)}>Download</button
		>
		<!-- <a class="btn variant-filled-error" href={`/api/articles/${article.id}/delete`}>Delete</a> -->
		<button class="btn variant-filled" disabled={loading || !userId} on:click={handlePublish}
			>Publish</button
		>
	</div>
</div>
