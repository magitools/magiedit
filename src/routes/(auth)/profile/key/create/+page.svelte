<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import * as Card from '$lib/components/ui/card';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	let passkey = '';
	let loading = false;

	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();
		const toastId = toast.loading('Creating your key');
		const data = new FormData();
		data.append('passkey', passkey);
		const res = await fetch('/api/key/create', {
			method: 'POST',
			body: data
		});
		if (!res.ok) {
			console.log('error');
			toast.error('something went wrong, pleasy try again later', { id: toastId });
			loading = false;
			return;
		}
		toast.success('key created! welcome!', { id: toastId });
		await goto('/app');
	}
</script>

<div class="flex justify-center items-center h-full bg-background">
	<Card.Root>
		<Card.Header>
			<Card.Title>Just One More Step</Card.Title>
		</Card.Header>
		<form method="post" on:submit={handleSubmit}>
			<Card.Content>
				<p>
					you just need to choose a master encryption key; this will be used to securely store
					articles on our servers. Be careful to not loose it
				</p>
				<Label for="passkey">Passkey</Label>
				<Input
					required
					bind:value={passkey}
					disabled={loading}
					type="password"
					name="passkey"
					autocomplete="current-password"
				/>
			</Card.Content>
			<Card.Footer>
				<Button disabled={loading} type="submit" class="mt-2">Submit</Button>
			</Card.Footer>
		</form>
	</Card.Root>
</div>
