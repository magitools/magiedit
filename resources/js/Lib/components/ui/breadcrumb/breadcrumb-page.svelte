<script>
	import { cn } from "$lib/utils.js";
	export let el = undefined;
	export let className = undefined;
	export { className as class };
</script>

<span
	bind:this={el}
	role="link"
	aria-disabled="true"
	aria-current="page"
	class={cn("text-foreground font-normal", className)}
	{...$$restProps}
>
	<slot />
</span>
