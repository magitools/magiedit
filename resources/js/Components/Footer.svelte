<script>
    import { Button } from "$lib/components/ui/button";
    import { Sun, Moon } from "lucide-svelte";
    import { toggleMode } from "mode-watcher";
</script>

<div class="w-full flex justify-between items-center bg-background px-4 py-4">
    <p>
        &copy; {new Date().getFullYear()} Magitools
    </p>
    <Button on:click={toggleMode} variant="outline" size="icon">
        <Sun
            class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        />
        <Moon
            class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        />
        <span class="sr-only">Toggle theme</span>
    </Button>
</div>
