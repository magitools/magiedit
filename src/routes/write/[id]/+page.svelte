<script>
	import { enhance } from '$app/forms';
	import { db } from '$lib/storage/db';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import { marked } from 'marked';
    import hljs from 'highlight.js';
	import 'highlight.js/styles/nord.css';

	export let data;
	export let form;
	let source = true;
	let title = data?.article?.title ?? '';
	let content = data?.article?.content ?? '';
	let loading = false;
	$: renderedContent = marked.parse(content);
    $: if (!source) {
        hljs.highlightAll();
    }

	async function handleSave() {
		loading = true;
		if (data?.article?.id) {
			await db.articles.update(data.article.id, {
				title,
				content
			});
		} else {
			const id = await db.articles.put({
				title,
				content,
				tags: []
			});
			data.article.id = id;
		}
	}
</script>

<div class="flex flex-col h-full w-full">
	<SlideToggle on:change={() => (source = !source)} name="view-source" checked={source}
		>View {source ? 'rendered' : 'source'}</SlideToggle
	>

	<button class="btn variant-filled-primary" on:click={handleSave}> Save </button>

	{#if source}
		{#if form?.photos}
        <div class="w-full flex flex-wrap">
			{#each form.photos as photo}
				<img alt={photo.description} src={photo.urls.small} on:click={() => {
                    content += `\n![${photo.alt_description}](${photo.urls.regular})\n`
                }} />
			{/each}

        </div>
		{/if}
		<div class="w-full h-full flex flex-col">
			<form method="post" use:enhance>
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<input type="search" placeholder="Search..." class="col-span-2" name="search" />
					<button class="variant-filled-secondary" type="submit">Submit</button>
				</div>
			</form>
			<label for="title" class="label">
				<span>title</span>
				<input
					bind:value={title}
					type="text"
					class="input"
					name="title"
					placeholder="the title of the article goes here"
				/>
			</label>
			<textarea
				bind:value={content}
				class="textarea flex-1"
				placeholder="Enter your article here."
			/>
		</div>
	{:else}
		<h1>{title}</h1>
		{@html renderedContent}
	{/if}
</div>
