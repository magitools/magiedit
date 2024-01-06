<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { handleDownload } from '$lib/articles/download';
	import type { IArticle } from '$lib/articles/types';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';

	import fm from 'front-matter';
	import Button from './ui/button/button.svelte';
	let loading = false;
	export let article: IArticle;
	export let userId: string | undefined;

	let frontmatter: Record<string, any> = fm(article.content).attributes as Record<string, any>;
	const handleFileDownload = async () => {
		loading = true;
		await handleDownload(article.content);
		loading = false;
	};
	const handlePublish = async () => {
		const data = new FormData();
		const toastId = toast.loading('Publishing...');
		data.append('content', article.content || '');
		const res = await (
			await fetch('/api/articles/publish', {
				method: 'POST',
				body: data
			})
		).json();
		toast.success('Finished publishing', { id: toastId });
	};
	const handleDelete = async () => {
		toast('article deleted');

		/* modalStore.trigger({
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
		} 
		);*/
	};
</script>

<Card.Root class="w-[500px]">
	<Card.Header>
		<Card.Title>{frontmatter.title || 'No title set'}</Card.Title>
	</Card.Header>
	<Card.Content>
		{#if frontmatter?.cover_image}
			<img src={frontmatter.cover_image} class="w-full h-auto" alt="article cover" />
		{/if}
	</Card.Content>
	<Card.Footer class="flex justify-between">
		<div>
			<Button href={`/app/write/${article.id}`}>Edit</Button>
			<Button disabled={loading} on:click={handleFileDownload}>Download</Button>
			<Button disabled={loading || !userId} on:click={handlePublish}>Publish</Button>
		</div>
		<Dialog.Root>
			<Dialog.Trigger>
				<Button variant="destructive">Delete</Button>
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title
						>Are you sure you want to delete {#if frontmatter.title}{frontmatter.title}{:else}this
							article{/if}</Dialog.Title
					>
					<Dialog.Description>This action cannot be undone</Dialog.Description>
				</Dialog.Header>
				<Dialog.Footer>
					<Button type="submit" variant="destructive" on:click={handleDelete}>Delete</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	</Card.Footer>
</Card.Root>
