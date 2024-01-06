<script lang="ts">
	import Button from './ui/button/button.svelte';

	export let authed: boolean;
	export let username: string;
</script>

<div class="w-full flex justify-between bg-background py-6 px-4 items-center">
	<a href="/app">MagiEdit</a>
	<div class="flex">
		{#if authed}
			<Button href="/profile">{username}</Button>
			<Button href="/app/settings">settings</Button>
		{:else}
			<Button href="/login">Sign In</Button>
		{/if}
	</div>
</div>
