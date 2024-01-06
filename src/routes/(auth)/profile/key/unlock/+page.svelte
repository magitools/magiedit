<script lang="ts">
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import * as Card from '$lib/components/ui/card';

	import LoadingOverlay from '$lib/components/LoadingOverlay.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	let passkey = '';
	let loading = false;
	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();
		loading = true;
		const data = new FormData();
		data.append('passkey', passkey);
		const res = await fetch('/api/key/unlock', {
			method: 'POST',
			body: data
		});
		if (!res.ok) {
			console.log(await res.json());
			loading = false;
			toast.error('something went wrong, pleasy try again later');
			return;
		}
		sessionStorage.setItem('magiedit:key', passkey);
		await goto('/app');
	}
</script>

<div class="flex justify-center items-center h-full bg-background">
	<Card.Root>
		<Card.Header>
			<Card.Title>Just One More Step</Card.Title>
		</Card.Header>
		<Card.Content>
			{#if loading}
				<LoadingOverlay text="checking and unlocking content, please wait" />
			{/if}
			<p>please enter the key you previously created to unlock your articles</p>
			<form method="post" on:submit={handleSubmit}>
				<Label for="passkey">Passkey</Label>
				<Input
					bind:value={passkey}
					disabled={loading}
					type="password"
					name="passkey"
					autocomplete="current-password"
				/>
				<button disabled={loading} type="submit" class="btn variant-filled mt-2">Submit</button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
