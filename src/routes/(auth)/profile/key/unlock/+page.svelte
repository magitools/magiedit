<script lang="ts">
	import { goto } from '$app/navigation';

	let passkey = '';
	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();
		const data = new FormData();
		data.append('passkey', passkey);
		const res = await fetch('/api/key/unlock', {
			method: 'POST',
			body: data
		});
		if (!res.ok) {
			console.log('error');
			return;
		}
		sessionStorage.setItem('magiedit:key', passkey);
		await goto('/app');
	}
</script>

<p>Almost done! please enter the key you previously created to unlock your articles</p>

<form action="" method="post" on:submit={handleSubmit}>
	<label for="passkey">
		<span>Passkey</span>
		<input
			bind:value={passkey}
			type="password"
			name="passkey"
			autocomplete="current-password"
			class="input"
		/>
	</label>
	<button type="submit" class="btn variant-filled">Submit</button>
</form>
