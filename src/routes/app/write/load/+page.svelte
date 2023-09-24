<script lang="ts">
	import { goto } from '$app/navigation';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { showOpenFilePicker } from 'file-system-access';

	export let data;
	const toastStore = getToastStore();
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
		try {
			const content = await (await filehandle.getFile()).text();

			toastStore.trigger({
				message: 'file loaded'
			});
			const keyBytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data.key));
			const key = await crypto.subtle.importKey('raw', keyBytes, 'AES-CBC', false, ['encrypt']);
			const iv = new Uint8Array(16);
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
			toastStore.trigger({
				message: 'could not open file, please try again'
			});
			console.error(error);
			return;
		}
	}
</script>

<div>
	<p>This page allows you to open a file from your browser</p>
	<button on:click={handleFileLoad}>Load</button>
</div>
