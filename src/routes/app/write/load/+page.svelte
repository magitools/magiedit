<script lang="ts">
	import { goto } from '$app/navigation';
	import { db } from '$lib/storage/db';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { showOpenFilePicker } from 'file-system-access';
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
			const id = await db.articles.add({
				title: filehandle.name,
				content,
				tags: []
			});
			toastStore.trigger({
				message: 'file loaded'
			});
			await goto(`/app/write/${id}`);
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
	<button on:click={handleFileLoad}>Load</button>
</div>
