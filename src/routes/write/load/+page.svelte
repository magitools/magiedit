<script lang="ts">
	import { showOpenFilePicker } from 'file-system-access';

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
	}
</script>

<div>
	<button on:click={handleFileLoad}>Load</button>
</div>
