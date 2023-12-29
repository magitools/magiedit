<script lang="ts">
	import { onMount } from 'svelte';
	import { handleDownload } from '$lib/articles/download';

	import { getModalStore, getToastStore, modeCurrent } from '@skeletonlabs/skeleton';
	import 'highlight.js/styles/nord.css';
	/* 	import { showSaveFilePicker, type FileSystemFileHandle } from 'file-system-access';
	 */ import CommandPalette, { defineActions } from 'svelte-command-palette';
	import { EditorState, Compartment } from '@codemirror/state';
	import { EditorView, keymap } from '@codemirror/view';
	import { defaultKeymap } from '@codemirror/commands';
	import { basicSetup } from 'codemirror';
	import { markdown } from '@codemirror/lang-markdown';
	import { languages } from '@codemirror/language-data';
	import { solarizedDark } from 'cm6-theme-solarized-dark';
	import { solarizedLight } from 'cm6-theme-solarized-light';
	import { parser } from '$lib/articles/parser';
	import LoadingOverlay from '$lib/components/LoadingOverlay.svelte';

	export let data;
	let source = true;
	let loading = false;
	let loadingText = 'loading, please wait...';

	const modalStore = getModalStore();
	const toastStore = getToastStore();
	const textUpdateListener = EditorView.updateListener.of((update) => {
		if (update.docChanged) {
			parser.process(view.state.doc.toString()).then((data) => {
				renderedContent = {
					frontmatter: { ...(data.data.frontmatter as Record<string, any>) },
					data: data.toString()
				};
			});
		}
	});
	const baseCodeMirrorConfig = [
		basicSetup,
		textUpdateListener,
		keymap.of(defaultKeymap),
		markdown({ codeLanguages: languages })
	];
	const themeCompartment = new Compartment();
	let content = data?.article?.content ?? 'here goes your markdown content';
	let renderedContent = { frontmatter: {}, data: '' };
	//let fileHandle: FileSystemFileHandle;
	let editorContainer: HTMLDivElement;

	let startState = EditorState.create({
		doc: content,
		extensions: [
			baseCodeMirrorConfig,
			themeCompartment.of($modeCurrent ? solarizedLight : solarizedDark)
		]
	});
	let view = new EditorView({ state: startState });

	modeCurrent.subscribe((currentTheme) => {
		view.dispatch({
			effects: themeCompartment.reconfigure(currentTheme ? solarizedLight : solarizedDark)
		});
	});

	async function handleSave() {
		loading = true;
		loadingText = 'generating encryption key...';
		const keyBytes = await window.crypto.subtle.digest(
			'SHA-256',
			new TextEncoder().encode(sessionStorage.getItem('magiedit:key')!)
		);
		const key = await window.crypto.subtle.importKey('raw', keyBytes, 'AES-CBC', false, [
			'encrypt'
		]);
		const iv = new Uint8Array(data.article.iv.split(',').map((e) => parseInt(e)));
		loadingText = 'encrypting content...';
		const encodedContent = await window.crypto.subtle.encrypt(
			{ name: 'AES-CBC', iv },
			key,
			new TextEncoder().encode(content)
		);
		loadingText = 'converting to base64...';
		const base64 = btoa(String.fromCharCode(...new Uint8Array(encodedContent)));
		const formData = new FormData();
		formData.append('content', base64);
		loadingText = 'saving to server...';
		const res = await fetch(`/api/articles/${data.article.id}`, {
			method: 'PUT',
			body: formData
		});
		if (!res.ok) {
			console.error(res);
			toastStore.trigger({ message: 'something went wrong, check console for full trace' });
		}
		loading = false;
	}

	async function handleFileDownload() {
		loading = true;
		await handleSave();
		await handleDownload(content);
		loading = false;
	}
	let ctrlDown = false;
	function handleKeyUp(event: KeyboardEvent) {
		if (event.key === 'Control') {
			ctrlDown = false;
		}
	}
	function handleKeyDown(event: KeyboardEvent) {
		/* 		if (event.repeat) return;
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
		}*/
	}
	onMount(() => {
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
		editorContainer.appendChild(view.dom);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keydown', handleKeyUp);
		};
	});
	function appendToContent(text: string) {
		content += `${text}`;
	}

	async function handleSaveToDisk() {
		/* 		await handleSave();
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
		await writable.close(); */
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

<div class="flex h-full w-full flex-col relative p-4">
	{#if loading}
		<LoadingOverlay text={loadingText} />
	{/if}
	<div class="w-full card p-4 my-2">
		<button class="btn variant-filled" on:click={handleSave}>
			{loading ? 'Saving...' : 'Save'}
		</button>
		<button class="btn variant-filled" on:click={handleFileDownload}> Download </button>
		<button class="btn variant-filled" on:click={handleSaveToDisk}>Save to file</button>
	</div>
	<div class="w-full flex justify-end md:hidden">
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
	<div class="h-full w-full grid grid-cols-1 md:grid-cols-2 group" data-source={source}>
		<div
			bind:this={editorContainer}
			class="w-full block group-data-[source=true]:block group-data-[source=false]:hidden md:group-data-[source=true]:block md:group-data-[source=false]:hidden"
		/>
		<div
			class="w-full h-full block group-data-[source=true]:hidden group-data-[source=false]:block md:group-data-[source=true]:block md:group-data-[source=false]:block"
		>
			<div data-testid="preview" class="w-full prose h-full text-black dark:text-white card p-4">
				<!-- ts-ignore-svelte/no-at-html-tags -->
				{@html renderedContent.data}
			</div>
		</div>
	</div>
</div>
