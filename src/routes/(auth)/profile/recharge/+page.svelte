<script lang="ts">
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

<label for="quantity" class="label">
	<span>Quantity</span>
	<input
		disabled={loading}
		class="input"
		type="number"
		name="quantity"
		id="quantity"
		bind:value={quantity}
	/>
</label>
{#if data.price && data.price.unit_amount}
	<p>The total is <b>{(quantity * (data.price.unit_amount / 100)).toFixed(2)}€</b></p>
{/if}
<button class="btn variant-filled" disabled={quantity < 1} on:click={recharge}> Recharge </button>
