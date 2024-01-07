<script lang="ts">
	import { goto } from '$app/navigation';
	import { generateIv } from '$lib/articles/crypto.js';
	import { showOpenFilePicker } from 'file-system-access';
	import { toast } from 'svelte-sonner';

	export let data;
	async function handleFileLoad() {
		const [filehandle] = await showOpenFilePicker({
			accepts: [
				{
					extensions: ['md'],
					mimeTypes: ['text/markdown']
				}
			],
			types: [
				{
					accept: {
						'text/markdown': ['.md']
					}
				}
			]
		});
		if (!filehandle) return;
		const toastId = toast.loading('loading your file');
		try {
			const content = await (await filehandle.getFile()).text();

			toast.success('file loaded', { id: toastId });
			const keyBytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data.key));
			const key = await crypto.subtle.importKey('raw', keyBytes, 'AES-CBC', false, ['encrypt']);
			const iv = generateIv();
			const encodedContent = await crypto.subtle.encrypt(
				{ name: 'AES-CBC', iv: iv },
				key,
				new TextEncoder().encode(content)
			);
			const base64 = btoa(String.fromCharCode(...new Uint8Array(encodedContent)));
			const formData = new FormData();
			formData.append('content', base64);
			formData.append('iv', iv.toString());
			const res = await (
				await fetch('/api/articles', {
					method: 'POST',
					body: formData
				})
			).json();
			await goto(`/app/write/${res.id}`);
		} catch (error) {
			toast.error('could not open file, please try again', { id: toastId });
			console.error(error);
			return;
		}
	}
</script>

<div>
	<p>This page allows you to open a file from your browser</p>
	<button on:click={handleFileLoad}>Load</button>
</div>
