<script lang="ts">
    import Footer from "./Footer.svelte";
    import Header from "./Header.svelte";
    import { ModeWatcher } from "mode-watcher";
    import { Toaster } from "$lib/components/ui/sonner";
</script>

<Toaster richColors />
<ModeWatcher />
<header>
    <Header />
</header>
<main class="flex-1 bg-background">
    <slot />
</main>
<footer>
    <Footer />
</footer>
