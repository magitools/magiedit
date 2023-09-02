<script lang="ts">
	import { enhance } from '$app/forms';
	import { db } from '$lib/storage/db';
	import type { IParagraph } from '$lib/articles/types';
	import {generateArticleBlob} from "$lib/articles/download"
	import { unified } from 'unified';
	import remarkParse from 'remark-parse';
	import remarkRehype from 'remark-rehype';
	import remarkFrontmatter from "remark-frontmatter"
	import remarkExtractFrontmatter from 'remark-extract-frontmatter'
    import remarkGfm from 'remark-gfm'
	import rehypeStringify from 'rehype-stringify';
    import addClasses from 'rehype-add-classes';
    import rehypeHighlight from 'rehype-highlight'
	import { toastStore } from '@skeletonlabs/skeleton';
	import "highlight.js/styles/nord.css"
	import {parse} from "yaml"

	let source = true;
	const parser = unified()
		.use(remarkParse)
		.use(remarkFrontmatter)
		.use(remarkExtractFrontmatter, {yaml: parse, name: "frontmatter"})
        .use(remarkGfm)
		.use(remarkRehype)
        .use(addClasses, {
            table: "table",
			"p,h1,h2,h3,h4,h5,h6,th, strong, a, blockquote, :not(pre) > code": "text-current"
			//'ul': 'list'
        })
        .use(rehypeHighlight)
		.use(rehypeStringify);
	export let data;
	let id = data?.article?.id ?? null
	let content = data?.article?.content ?? 'here goes your markdown content';
	let loading = false;
    let renderedContent = {frontmatter: {}, data: ""};

	$: parser.process(content).then((data) => {
        renderedContent = {frontmatter: {...data.data.frontmatter}, data: data.toString()}
    })


	async function handleSave() {
		loading = true;
		toastStore.trigger({message:"saving your article...", })
		if (data?.article?.id) {
			await db.articles.update(data.article.id, {
				title: renderedContent?.frontmatter?.title ?? Date.now().toString() ,
				content,
				tags: renderedContent?.frontmatter?.tags ?? [],
				published: renderedContent?.frontmatter?.published ?? false
			});
		} else {
			id = await db.articles.put({
				title: renderedContent?.frontmatter?.title ?? Date.now().toString(),
				content,
				tags: renderedContent?.frontmatter?.tags ?? [],
				published: renderedContent?.frontmatter?.published ?? false
			});
		}
		toastStore.trigger({message:"article saved!"})
		loading = false;
	}

	async function handleDownload() {
		await handleSave()
		const article = await db.articles.get(id);
		const data = await generateArticleBlob(id);
		const link = window.URL.createObjectURL(data)
		let a = document.createElement("a");
		a.setAttribute("download", `${article.title || renderedContent?.frontmatter?.title || "your_post"}.md`);
		a.setAttribute("href", link);
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		loading = false;
	}

	function handleKeyDown(event) {
		if (event.keyCode === 9) {
			event.preventDefault();
			content += "\t"
		}
	}
</script>

<div class="flex h-full w-full flex-col">
	<div class="w-full card p-4 my-2">
		<button class="btn variant-filled" on:click={handleSave}>
			{loading ? 'Saving...' : 'Save'}
		</button>
		<button class="btn variant-filled" on:click={handleDownload}>
			Download
		</button>
	</div>
	<div class="w-full flex justify-end">
		<div class="flex space-x-2">
			<button class={`uppercase btn variant-${source ? "filled" : "ghost"}`} on:click={() => source = true} >Source</button>
			<button class={`uppercase btn variant-${source ? "ghost" : "filled"}`} on:click={() => source = false} >Preview</button>
		</div>
	</div>
	<div class="h-full w-full py-2 flex justify-center">
	{#if source}
		<div
			class="prose max-w-[70%] w-full min-h-full text-black dark:text-white card p-4"
			contenteditable="true"
			on:keydown={handleKeyDown}
			bind:innerText={content}
		/>
	{:else}
		<div class="w-full max-w-[70%] prose text-black dark:text-white card p-4">
			{@html renderedContent.data}
		</div>
	{/if}
	</div>
</div>

<style lang="scss">
	[contenteditable] {
		@apply outline-0 transition-all duration-500;
		&:focus {
			@apply scale-105 shadow-lg
		}
	}
</style>