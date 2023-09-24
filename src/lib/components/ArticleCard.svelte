<script lang="ts">
	import { generateArticleBlob, handleDownload } from '$lib/articles/download';
	import type { IArticle } from '$lib/articles/types';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import fm from 'front-matter';
	let loading = false;
	export let article: IArticle;
	export let userId: string | undefined;

	let frontmatter: Record<string, any> = fm(article.content).attributes as Record<string, any>;
	console.log(frontmatter);
	const modalStore = getModalStore();
	const handleFileDownload = async () => {
		loading = true;
		await handleDownload(article.content);
		loading = false;
	};
	const handlePublish = async () => {
		const data = new FormData();
		data.append('content', article.content || '');
		data.append('title', frontmatter.title || '');
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
	<h2 class="card-header">{frontmatter.title || 'No title set'}</h2>
	{#if frontmatter?.cover}
		<img src={frontmatter.cover} class="w-full h-auto" alt="article cover" />
	{/if}
	<section class="p-4" />
	<div class="card-footer">
		<a class="btn variant-filled" href={`/app/write/${article.id}`}>Edit</a>
		<button class="btn variant-filled" disabled={loading} on:click={handleFileDownload}
			>Download</button
		>
		<!-- <a class="btn variant-filled-error" href={`/api/articles/${article.id}/delete`}>Delete</a> -->
		<button class="btn variant-filled" disabled={loading || !userId} on:click={handlePublish}
			>Publish</button
		>
	</div>
</div>
