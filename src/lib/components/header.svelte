<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	export let authed: boolean;
	export let username: string;
</script>

<AppBar>
	<svelte.fragment slot="lead"><a href="/">MagiEdit</a></svelte.fragment>
	<svelte.fragment slot="trail">
		{#if authed}
			<a href="/profile">{username}</a>
			<a href="/app/settings">settings</a>
		{:else}
			<a href="/login">Sign In</a>
		{/if}
	</svelte.fragment>
</AppBar>
