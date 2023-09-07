<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	export let authed: boolean;
	export let username: string;
</script>

<AppBar>
	<svelte.fragment slot="lead">MagiEdit</svelte.fragment>
	<svelte.fragment slot="trail">
		{#if authed}
			<a href="/profile">{username}</a>
		{:else}
			<a href="/login">Sign In</a>
		{/if}
	</svelte.fragment>
</AppBar>
