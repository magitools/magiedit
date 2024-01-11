<script lang="ts">
	import { onMount } from 'svelte';
	import { mode } from 'mode-watcher';
	import { handleDownload } from '$lib/articles/download';

	import 'highlight.js/styles/nord.css';
	/* 	import { showSaveFilePicker, type FileSystemFileHandle } from 'file-system-access'; */
	import * as Command from '$lib/components/ui/command';
	import { EditorState, Compartment } from '@codemirror/state';
	import { EditorView, keymap } from '@codemirror/view';
	import { defaultKeymap } from '@codemirror/commands';
	import { basicSetup } from 'codemirror';
	import { markdown } from '@codemirror/lang-markdown';
	import { languages } from '@codemirror/language-data';
	import { solarizedDark } from 'cm6-theme-solarized-dark';
	import { solarizedLight } from 'cm6-theme-solarized-light';
	import { toast } from 'svelte-sonner';

	import { parser } from '$lib/articles/parser';
	import LoadingOverlay from '$lib/components/LoadingOverlay.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import Giphy from '$lib/components/commands/giphy.svelte';
	import Unsplash from '$lib/components/commands/unsplash.svelte';

	export let data;
	let source = true;
	let loading = false;
	let loadingText = 'loading, please wait...';

	const textUpdateListener = EditorView.updateListener.of((update) => {
		if (update.docChanged) {
			content = view.state.doc.toString();
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
	$: parser.process(content).then((data) => {
		renderedContent = {
			frontmatter: { ...(data.data.frontmatter as Record<string, any>) },
			data: data.toString()
		};
	});
	let editorContainer: HTMLDivElement;
	let commandDialogOpen = false;
	let giphyDialogOpen = false;
	let unsplashDialogOpen = false;
	let startState = EditorState.create({
		doc: content,
		extensions: [
			baseCodeMirrorConfig,
			themeCompartment.of($mode === 'light' ? solarizedLight : solarizedDark)
		]
	});
	let view = new EditorView({ state: startState });

	mode.subscribe((currentTheme) => {
		view.dispatch({
			effects: themeCompartment.reconfigure(
				currentTheme === 'light' ? solarizedLight : solarizedDark
			)
		});
	});

	async function handleSave() {
		const toastId = toast.loading('Saving article...');
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
			toast.error('something went wrong, check console for full trace', { id: toastId });
		} else {
			toast.success('article saved', { id: toastId });
		}
		loading = false;
	}

	async function handleFileDownload() {
		loading = true;
		await handleSave();
		await handleDownload(content);
		loading = false;
	}
	function handleKeyDown(event: KeyboardEvent) {
		if (!event.metaKey && !event.ctrlKey) return;
		event.preventDefault();
		switch (event.key) {
			case 's':
				handleSave();
				break;
			case 'l':
				source = !source;
				break;
			case 'k':
				commandDialogOpen = !commandDialogOpen;
				break;
		}
	}
	onMount(() => {
		window.addEventListener('keydown', handleKeyDown);
		editorContainer.appendChild(view.dom);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});

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

	function addToDoc(event) {
		const length = startState.doc.length;
		const newText = `\n${event.detail}\n`;
		const transaction = view.state.update({ changes: { from: length, insert: newText } });
		view.dispatch(transaction);
		console.log(event);
	}
</script>

<Command.Dialog bind:open={commandDialogOpen} loop>
	<Command.Input placeholder="Type a command or search..." />
	<Command.List>
		<Command.Empty>No results found.</Command.Empty>
		<Command.Group heading="Images">
			<Command.Item
				onSelect={() => {
					giphyDialogOpen = !giphyDialogOpen;
					commandDialogOpen = false;
				}}
				>Giphy
			</Command.Item>
			<Command.Item
				onSelect={() => {
					unsplashDialogOpen = !unsplashDialogOpen;
					commandDialogOpen = false;
				}}
			>
				Unsplash
			</Command.Item>
		</Command.Group>
		<Command.Separator />
	</Command.List>
</Command.Dialog>

<Giphy on:addToDoc={addToDoc} bind:open={giphyDialogOpen} />
<Unsplash on:addToDoc={addToDoc} bind:open={unsplashDialogOpen} />

<div class="flex h-full w-full flex-col relative p-4">
	{#if loading}
		<LoadingOverlay text={loadingText} />
	{/if}
	<div class="w-full card p-4 my-2">
		<Button class="btn variant-filled" on:click={handleSave}>
			{loading ? 'Saving...' : 'Save'}
		</Button>
		<Button class="btn variant-filled" on:click={handleFileDownload}>Download</Button>
		<Button class="btn variant-filled" on:click={handleSaveToDisk}>Save to file</Button>
	</div>
	<div class="w-full flex justify-end md:hidden">
		<Button variant={source ? 'default' : 'outline'} on:click={() => (source = true)}>Source</Button
		>
		<Button variant={source ? 'outline' : 'default'} on:click={() => (source = false)}
			>Preview</Button
		>
	</div>
	<div class="h-full w-full grid grid-cols-1 md:grid-cols-2 group gap-4" data-source={source}>
		<div
			bind:this={editorContainer}
			class="w-full block group-data-[source=true]:block group-data-[source=false]:hidden md:group-data-[source=true]:block md:group-data-[source=false]:block"
		/>
		<div
			class="w-full min-h-[100%] h-full min-w-full overflow-y-auto prose p-4 bg-primary text-primary-foreground block group-data-[source=true]:hidden group-data-[source=false]:block md:group-data-[source=true]:block md:group-data-[source=false]:block"
		>
			<!-- ts-ignore-svelte/no-at-html-tags -->
			{@html renderedContent.data}
		</div>
	</div>
</div>
