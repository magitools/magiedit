<script lang="ts">
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import * as Card from '$lib/components/ui/card';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	let passkey = '';
	let loading = false;
	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();
		const toastId = toast.loading('Unlocking you content');
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
			toast.error('something went wrong, pleasy try again later', { id: toastId });
			return;
		}
		toast.success('articles unlocked! welcome back!', { id: toast });
		sessionStorage.setItem('magiedit:key', passkey);
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
				<p>please enter the key you previously created to unlock your articles</p>
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
