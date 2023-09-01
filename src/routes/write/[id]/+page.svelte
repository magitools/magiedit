<script lang="ts">
	import { enhance } from '$app/forms';
	import { db } from '$lib/storage/db';
	import {onMount} from "svelte"
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
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import "highlight.js/styles/nord.css"
	import {parse} from "yaml"
	import CommandPalette, { defineActions } from "svelte-command-palette"

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
	const modalStore = getModalStore()
	const toastStore = getToastStore()
	export let data;
	let id = data?.article?.id ?? null;
	let content = data?.article?.content ?? 'here goes your markdown content';
	let loading = false;
    let renderedContent = {frontmatter: {}, data: ""};

	$: parser.process(content).then((data) => {
        renderedContent = {frontmatter: {...data.data.frontmatter}, data: data.toString()};
    })


	async function handleSave() {
		loading = true;
		toastStore.trigger({message:"saving your article...", })
		if (data?.article?.id) {
			await db.articles.update(data.article.id, {
				title: renderedContent?.frontmatter?.title ?? Date.now().toString() ,
				content,
				tags: renderedContent?.frontmatter?.tags ?? [],
				frontmatter: renderedContent?.frontmatter ? JSON.stringify(renderedContent?.frontmatter) : undefined
			});
		} else {
			id = await db.articles.put({
				title: renderedContent?.frontmatter?.title ?? Date.now().toString(),
				content,
				tags: renderedContent?.frontmatter?.tags ?? [],
				frontmatter: renderedContent?.frontmatter ? JSON.stringify(renderedContent?.frontmatter)  : undefined
			});
		}
		toastStore.trigger({message:"article saved!"});
		loading = false;
	}

	async function handleDownload() {
		await handleSave();
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
	let ctrlDown = false;
	let shiftDown = false;
	function handleKeyUp(event) {
		if (event.key === "Control") {
				ctrlDown = false
			}
	}
	function handleKeyDown(event) {
		if (event.repeat || $modalStore[0]) return;
		switch (event.key) {
			case "Control":
				event.preventDefault();
				ctrlDown = true;
				break;
			case "s":
				if (ctrlDown) {
					event.preventDefault()
					handleSave();
				}
				break;
			case "l":
				if (ctrlDown) {
					event.preventDefault();
					source = !source;
				}
				break;
			case "[":
				if (window.getSelection().type === "Range") {
					event.preventDefault();
					const selection = window.getSelection();
					console.log(window.getSelection());
					const node = selection.focusNode.parentNode;
					//TODO fix with backwards selection and reselcting text
					const textToReplace = selection.baseNode.wholeText.replace(selection.baseNode.wholeText.substr(selection.baseOffset, selection.extentOffset), `[${selection.baseNode.wholeText.substr(selection.baseOffset, selection.extentOffset)}]`);
					content = content.replace(selection.baseNode.wholeText, textToReplace);
				}
				break;
			case "\"":
				// TODO same thing than for [
				break;
		}
	}
	onMount(() => {
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp)
		return (() => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keydown", handleKeyUp)
		})
	})

	const commands = defineActions([
		{
    id: "1",
    title: "Add GIF",
    subTitle: "Search Giphy for gifs",
    onRun: () => {
        modalStore.trigger({component: "giphyModal", type: "component", response: (r: string) => {
			content += `\n${r}\n`
		}})
    },
}
	])
</script>
<CommandPalette commands={commands} />

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
