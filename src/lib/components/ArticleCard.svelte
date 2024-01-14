<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { handleDownload } from '$lib/articles/download';
	import type { IArticle } from '$lib/articles/types';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';

	import fm from 'front-matter';
	import Button from './ui/button/button.svelte';
	import { createEventDispatcher } from 'svelte';
	export let article: IArticle;
	export let userId: string | undefined;
	let dialogOpen = false;
	let publishDialog = false;
	let loading = false;
	let publishingResult = '';
	let frontmatter: Record<string, any> = fm(article.content).attributes as Record<string, any>;
	const dispatch = createEventDispatcher();
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
		publishingResult = res.status;
		publishDialog = true;
		toast.success('Finished publishing', { id: toastId });
	};
	const handleDelete = async () => {
		dialogOpen = false;
		const toastId = toast.loading('deleting article...');
		const res = await fetch(`/api/articles/${article.id}`, {
			method: 'DELETE'
		});
		if (!res.ok) {
			toast.error('could not delete article', { id: toastId });
		} else {
			toast.success('article deleted', { id: toastId });
			dispatch('reload', { id: article.id });
		}
	};
</script>

<Dialog.Root bind:open={publishDialog}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Article finished publishing</Dialog.Title>
			<Dialog.Description>
				{publishingResult}
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button on:click={() => (publishDialog = false)}>Ok</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<Card.Root class="w-full ">
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
		<Dialog.Root bind:open={dialogOpen}>
			<Dialog.Trigger>
				<Button on:click={() => (dialogOpen = true)} variant="destructive">Delete</Button>
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
					<Button on:click={() => (dialogOpen = false)}>Cancel</Button>
					<Button variant="destructive" on:click={handleDelete}>Delete</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	</Card.Footer>
</Card.Root>
