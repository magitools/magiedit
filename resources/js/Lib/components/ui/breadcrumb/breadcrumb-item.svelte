<script>
	import { cn } from "$lib/utils.js";
	export let el = undefined;
	let className = undefined;
	export { className as class };
</script>

<li bind:this={el} class={cn("inline-flex items-center gap-1.5", className)}>
	<slot />
</li>
