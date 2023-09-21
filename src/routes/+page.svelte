<script lang="ts">
	import { ProgressBar } from '@skeletonlabs/skeleton';
	let loading = false;
</script>

<div class="w-full h-full flex flex-col">
	{#if loading}
		<ProgressBar />
	{/if}
	<div class="flex flex-col items-center h-full justify-center space-y-2">
		<h1 class="text-3xl">Welcome to Magiedit</h1>
		<p>your one-stop destination to writing and publishing articles</p>
		<a class="btn variant-filled animate-pulse" href="/app">Get Writing</a>
	</div>
</div>
