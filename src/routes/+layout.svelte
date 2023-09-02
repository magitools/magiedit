<script lang='ts'>
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';
	import { AppShell, Toast } from '@skeletonlabs/skeleton';
	import Footer from '$lib/components/footer.svelte';
	import Header from '$lib/components/header.svelte';

</script>

<Toast />
<AppShell>
	<svelte.fragment slot="header"><Header /></svelte.fragment>
	<slot />
	<svelte.fragment slot="pageFooter">
		<Footer />
	</svelte.fragment>
</AppShell>

