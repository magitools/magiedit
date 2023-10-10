<script lang="ts">
	import { goto } from '$app/navigation';
	import LoadingOverlay from '$lib/components/LoadingOverlay.svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';

	let passkey = '';
	let loading = false;
	const toastStore = getToastStore();

	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();
		loading = true;
		const data = new FormData();
		data.append('passkey', passkey);
		const res = await fetch('/api/key/create', {
			method: 'POST',
			body: data
		});
		if (!res.ok) {
			console.log('error');
			toastStore.trigger({ message: 'something went wrong, pleasy try again later' });
			loading = false;
			return;
		}
		sessionStorage.setItem('magiedit:key', passkey);
		await goto('/app');
	}
</script>

<div class="flex justify-center items-center h-full">
	<div class="card min-h-[200px] relative">
		{#if loading}
			<LoadingOverlay text="checking and unlocking content, please wait" />
		{/if}
		<div class="card-header text-xl font-bold">Almost there!</div>
		<div class="p-4 space-y-2">
			<p>
				you just need to choose a master encryption key; this will be used to securely store
				articles on our servers. Be careful to not loose it
			</p>
			<form method="post" on:submit={handleSubmit}>
				<label for="passkey">
					<span>Passkey</span>
					<input
						disabled={loading}
						bind:value={passkey}
						type="password"
						name="passkey"
						autocomplete="new-password"
						class="input"
					/>
				</label>
				<button disabled={loading} type="submit" class="btn variant-filled mt-2">Submit</button>
			</form>
		</div>
	</div>
</div>
