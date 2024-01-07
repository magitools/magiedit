<script lang="ts">
	import '../app.postcss';
	import Footer from '$lib/components/footer.svelte';
	import Header from '$lib/components/header.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';

	export let data;
</script>

<Toaster />
<ModeWatcher />
<header>
	<Header username={data.username} authed={data.authed} />
</header>
<main class="flex-1 bg-background">
	<slot />
</main>
<footer>
	<Footer />
</footer>
