<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { fade } from 'svelte/transition';

	export let text = 'loading, please wait';
</script>

<div
	class="absolute w-full h-full flex flex-col justify-center items-center bg-black dark:bg-white z-50"
	transition:fade
>
	<ProgressRadial meter="stroke-primary-500" />
	<p class="text-white dark:text-black">{text}</p>
</div>
