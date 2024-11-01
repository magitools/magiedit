<script>
	import { cn } from "$lib/utils.js";
	export let href = undefined;
	export let el = undefined;
	export let asChild = false;
	let className = undefined;
	export { className as class };
	let attrs;
	$: attrs = {
		class: cn("hover:text-foreground transition-colors", className),
		href,
		...$$restProps,
	};
</script>

{#if asChild}
	<slot {attrs} />
{:else}
	<a bind:this={el} {...attrs} {href}>
		<slot {attrs} />
	</a>
{/if}
