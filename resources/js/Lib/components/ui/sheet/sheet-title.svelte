<script>
	import { Dialog as SheetPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	let className = undefined;
	export { className as class };
</script>

<SheetPrimitive.Title
	class={cn("text-foreground text-lg font-semibold", className)}
	{...$$restProps}
>
	<slot />
</SheetPrimitive.Title>
