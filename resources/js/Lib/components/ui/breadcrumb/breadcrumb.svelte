<script>
	export let el = undefined;
	let className = undefined;
	export { className as class };
</script>

<nav class={className} bind:this={el} aria-label="breadcrumb" {...$$restProps}>
	<slot />
</nav>
