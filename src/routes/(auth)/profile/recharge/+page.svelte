<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import type { PageServerData } from './$types';
	let quantity = 0;
	let loading = false;
	export let data: PageServerData;

	async function recharge() {
		loading = true;
		const res = await fetch('/api/stripe/recharge', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ quantity })
		});
		const data = await res.json();
		window.location.replace(data.url);
		loading = false;
	}
</script>

<h1>here you can recharge your credits</h1>
<Label for="quantity">Quantity</Label>
<Input
	disabled={loading}
	class="input"
	type="number"
	name="quantity"
	id="quantity"
	bind:value={quantity}
/>
{#if data.price && data.price.unit_amount}
	<p>The total is <b>{(quantity * (data.price.unit_amount / 100)).toFixed(2)}€</b></p>
{/if}
<Button disabled={quantity < 1} on:click={recharge}>Recharge</Button>
