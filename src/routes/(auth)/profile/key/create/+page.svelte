<script lang="ts">
	import { goto } from '$app/navigation';

	let passkey = '';
	async function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();
		const data = new FormData();
		data.append('passkey', passkey);
		const res = await fetch('/api/key/create', {
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

<p>
	Almost done! you just need to choose a master encryption key; this will be used to securely store
	articles on our servers. Be careful to not loose it
</p>

<form action="" method="post" on:submit={handleSubmit}>
	<label for="passkey">
		<span>Passkey</span>
		<input
			required
			bind:value={passkey}
			type="password"
			name="passkey"
			autocomplete="new-password"
			class="input"
		/>
	</label>
	<button type="submit" class="btn variant-filled">Submit</button>
</form>
