<script lang="ts">
	import '../app.postcss';
	import { AppShell, Modal, Toast, initializeStores } from '@skeletonlabs/skeleton';
	import Footer from '$lib/components/footer.svelte';
	import Header from '$lib/components/header.svelte';
	import { modalRegistry } from '$lib/modals';
	initializeStores();
</script>

<Modal components={modalRegistry} />
<Toast />
<AppShell>
	<svelte.fragment slot="header"><Header /></svelte.fragment>
	<slot />
	<svelte.fragment slot="pageFooter">
		<Footer />
	</svelte.fragment>
</AppShell>
