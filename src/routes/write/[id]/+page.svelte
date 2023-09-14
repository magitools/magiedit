<script lang="ts">
	import { db } from '$lib/storage/db';
	import { onMount } from 'svelte';
	import { generateArticleBlob } from '$lib/articles/download';
	import { unified } from 'unified';
	import remarkParse from 'remark-parse';
	import remarkRehype from 'remark-rehype';
	import remarkFrontmatter from 'remark-frontmatter';
	import remarkExtractFrontmatter from 'remark-extract-frontmatter';
	import remarkGfm from 'remark-gfm';
	import rehypeStringify from 'rehype-stringify';
	import addClasses from 'rehype-add-classes';
	import rehypeHighlight from 'rehype-highlight';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import 'highlight.js/styles/nord.css';
	import { parse } from 'yaml';
	import { showSaveFilePicker, type FileSystemFileHandle } from 'file-system-access';
	import CommandPalette, { defineActions } from 'svelte-command-palette';

	let source = true;
	let sourceElement: HTMLTextAreaElement;
	const parser = unified()
		.use(remarkParse)
		.use(remarkFrontmatter)
		.use(remarkExtractFrontmatter, { yaml: parse, name: 'frontmatter' })
		.use(remarkGfm)
		.use(remarkRehype)
		.use(addClasses, {
			table: 'table',
			'p,h1,h2,h3,h4,h5,h6,th, strong, a, blockquote, :not(pre) > code': 'text-current'
			//'ul': 'list'
		})
		.use(rehypeHighlight)
		.use(rehypeStringify);
	const modalStore = getModalStore();
	const toastStore = getToastStore();
	export let data;
	let content = data?.article?.content ?? 'here goes your markdown content';
	let loading = false;
	let renderedContent = { frontmatter: {}, data: '' };
	let fileHandle: FileSystemFileHandle;

	$: parser.process(content).then((data) => {
		renderedContent = { frontmatter: { ...data.data.frontmatter }, data: data.toString() };
	});

	async function handleSave() {
		loading = true;
		toastStore.trigger({ message: 'saving your article...' });
		if (!data?.article?.id) return;
		await db.articles.update(data.article.id, {
			title: renderedContent?.frontmatter?.title ?? Date.now().toString(),
			content,
			tags: renderedContent?.frontmatter?.tags ?? [],
			frontmatter: renderedContent?.frontmatter
				? JSON.stringify(renderedContent?.frontmatter)
				: undefined
		});
		toastStore.trigger({ message: 'article saved!' });
		loading = false;
	}

	async function handleDownload() {
		await handleSave();
		if (!data?.article?.id) return;
		const article = await db.articles.get(data.article.id);
		const blob = await generateArticleBlob(data.article.id);
		const link = window.URL.createObjectURL(blob);
		let a = document.createElement('a');
		a.setAttribute('download', `${article.title}.md`);
		a.setAttribute('href', link);
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		loading = false;
	}
	let ctrlDown = false;
	function handleKeyUp(event: KeyboardEvent) {
		if (event.key === 'Control') {
			ctrlDown = false;
		}
	}
	function handleKeyDown(event: KeyboardEvent) {
		if (event.repeat) return;
		switch (event.key) {
			case 'Control':
				event.preventDefault();
				ctrlDown = true;
				break;
			case 's':
				if (ctrlDown) {
					event.preventDefault();
					handleSave();
				}
				break;
			case 'l':
				if (ctrlDown) {
					event.preventDefault();
					source = !source;
				}
				break;
			case '[':
				if (window.getSelection()?.type === 'Range') {
					event.preventDefault();
					content =
						content.substring(0, sourceElement.selectionStart) +
						'[' +
						content.substring(sourceElement.selectionStart, sourceElement.selectionEnd) +
						']' +
						content.substring(sourceElement.selectionEnd);
				}
				break;
			case '(':
				if (window.getSelection()?.type === 'Range') {
					event.preventDefault();
					content =
						content.substring(0, sourceElement.selectionStart) +
						'(' +
						content.substring(sourceElement.selectionStart, sourceElement.selectionEnd) +
						')' +
						content.substring(sourceElement.selectionEnd);
				}
				break;
			case '"':
				if (window.getSelection()?.type === 'Range') {
					event.preventDefault();
					content =
						content.substring(0, sourceElement.selectionStart) +
						'"' +
						content.substring(sourceElement.selectionStart, sourceElement.selectionEnd) +
						'"' +
						content.substring(sourceElement.selectionEnd);
				}
				break;
			case 'Enter':
				event.preventDefault();
				content =
					content.substring(0, sourceElement.selectionStart) +
					'\n' +
					content.substring(sourceElement.selectionStart);
				sourceElement.focus();
				sourceElement.selectionStart = sourceElement.selectionEnd;
				sourceElement.selectionEnd = sourceElement.selectionEnd;
				break;
			default:
				break;
		}
	}
	onMount(() => {
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keydown', handleKeyUp);
		};
	});
	function appendToContent(text: string) {
		content += `${text}`;
	}

	async function handleSaveToDisk() {
		await handleSave();
		if (!fileHandle) {
			fileHandle = await showSaveFilePicker({
				types: [
					{
						accept: {
							'text/markdown': ['.md']
						}
					}
				]
			});
			await fileHandle.requestPermission({ mode: 'readwrite' });
		}
		toastStore.trigger({ message: 'saving to disk...' });
		const writable = await fileHandle.createWritable({ keepExistingData: false });
		await writable.write(content);
		await writable.close();
	}

	const commands = defineActions([
		{
			title: 'Add GIF',
			subTitle: 'Search Giphy for gifs',
			onRun: () => {
				modalStore.trigger({
					component: 'giphyModal',
					type: 'component',
					response: (r: string) => {
						if (!r) return;
						appendToContent(r);
					}
				});
			}
		},
		{
			title: 'Add Image',
			subTitle: 'Search Unsplash for images',
			onRun: () => {
				modalStore.trigger({
					component: 'unsplashModal',
					type: 'component',
					response: (r: string) => {
						if (!r) return;
						appendToContent(r);
					}
				});
			}
		},
		{
			title: 'Generate Image',
			subTitle: 'Generate an image using DALL-E 2',
			onRun: () => {
				modalStore.trigger({
					component: 'openAiImageModal',
					type: 'component',
					response: (r: string) => {
						if (!r) return;
						appendToContent(r);
					}
				});
			}
		},
		{
			title: 'Get Saved images',
			subTitle: 'Use one of your previously generated images',
			onRun: () => {
				modalStore.trigger({
					component: 'savedImages',
					type: 'component',
					response: (r: string) => {
						if (!r) return;
						appendToContent(r);
					}
				});
			}
		},
		{
			title: 'Generate Cover Image',
			subTitle: 'Use or generate a summary of your article to create a cover image',
			onRun: () => {
				modalStore.trigger({
					component: 'openAiCoverModal',
					type: 'component',
					meta: { content }
				});
			}
		}
	]);
</script>

<CommandPalette
	{commands}
	inputClass="text-black dark:text-white"
	inputStyle={{ color: 'black' }}
	titleStyle={{ color: 'black' }}
/>

<div class="flex h-full w-full flex-col">
	<div class="w-full card p-4 my-2">
		<button class="btn variant-filled" on:click={handleSave}>
			{loading ? 'Saving...' : 'Save'}
		</button>
		<button class="btn variant-filled" on:click={handleDownload}> Download </button>
		<button class="btn variant-filled" on:click={handleSaveToDisk}>Save to file</button>
	</div>
	<div class="w-full flex justify-end">
		<div class="flex space-x-2">
			<button
				class={`uppercase btn variant-${source ? 'filled' : 'ghost'}`}
				on:click={() => (source = true)}>Source</button
			>
			<button
				data-testid="preview-button"
				class={`uppercase btn variant-${source ? 'ghost' : 'filled'}`}
				on:click={() => (source = false)}>Preview</button
			>
		</div>
	</div>
	<div class="h-full w-full py-2 flex justify-center">
		{#if source}
			<textarea
				bind:this={sourceElement}
				data-testid="source"
				class="prose textarea max-w-[70%] w-full min-h-full max-h-full overflow-y-auto text-black dark:text-white card p-4"
				bind:value={content}
			/>
		{:else}
			<div
				data-testid="preview"
				class="w-full max-w-[70%] prose h-full overflow-y-auto text-black dark:text-white card p-4"
			>
				<!-- ts-ignore-svelte/no-at-html-tags -->
				{@html renderedContent.data}
			</div>
		{/if}
	</div>
</div>
