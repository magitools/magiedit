<script lang="ts">
	import '../app.postcss';
	import { AppShell, Modal, Toast, initializeStores } from '@skeletonlabs/skeleton';
	import Footer from '$lib/components/footer.svelte';
	import Header from '$lib/components/header.svelte';
	import { modalRegistry } from '$lib/modals';
	initializeStores();

	export let data;
</script>

<Modal components={modalRegistry} />
<Toast />
<AppShell>
	<svelte.fragment slot="header"
		><Header username={data.username} authed={data.authed} /></svelte.fragment
	>
	<slot />
	<svelte.fragment slot="pageFooter">
		<Footer />
	</svelte.fragment>
</AppShell>
