<script lang="ts">
	import { handleDownload } from '$lib/articles/download';
	import type { IArticle } from '$lib/articles/types';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import fm from 'front-matter';
	let loading = false;
	export let article: IArticle;
	export let userId: string | undefined;

	let frontmatter: Record<string, any> = fm(article.content).attributes as Record<string, any>;
	const modalStore = getModalStore();
	const toastStore = getToastStore();
	const handleFileDownload = async () => {
		loading = true;
		await handleDownload(article.content);
		loading = false;
	};
	const handlePublish = async () => {
		const data = new FormData();
		data.append('content', article.content || '');
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
	const handleDelete = async () => {
		modalStore.trigger({
			type: 'confirm',
			title: 'are you sure?',
			body: 'are you certain you want to delete this article',
			response: async (r: boolean) => {
				if (r) {
					const res = await fetch(`/api/articles/${article.id}`, {
						method: 'DELETE'
					});
					if (!res.ok) {
						toastStore.trigger({ message: 'could not delete article' });
					} else {
						toastStore.trigger({ message: 'article deleted' });
					}
				}
			}
		});
	};
</script>

<div class="card max-w-[500px] max-h-[500px] h-full">
	<h2 class="card-header text-xl pb-4">{frontmatter.title || 'No title set'}</h2>
	{#if frontmatter?.cover_image}
		<img src={frontmatter.cover_image} class="w-full h-auto" alt="article cover" />
	{/if}
	<section class="p-4" />
	<div class="card-footer flex justify-between">
		<div>
			<a class="btn variant-filled" href={`/app/write/${article.id}`}>Edit</a>
			<button class="btn variant-filled" disabled={loading} on:click={handleFileDownload}
				>Download</button
			>
			<button class="btn variant-filled" disabled={loading || !userId} on:click={handlePublish}
				>Publish</button
			>
		</div>
		<button on:click={handleDelete} class="btn variant-filled-error">Delete</button>
	</div>
</div>
