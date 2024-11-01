<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { page, inertia, Link } from "@inertiajs/svelte";
    import { KeyRound, Newspaper, NotebookPen, PowerOff } from "lucide-svelte";
    import * as Sheet from "$lib/components/ui/sheet/index.js";
    import { Menu } from "lucide-svelte";
</script>

<div class="w-full flex justify-between bg-background py-6 px-4 items-center">
    <div class="flex items-center space-x-6">
        <a use:inertia href={route("app.articles.index")}>MagiEdit</a>

        {#if $page.props.auth.authed}
            <nav
                class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
            >
                <a
                    href={route("app.articles.index")}
                    use:inertia
                    class={route("app.articles.index").includes($page.url)
                        ? "text-foreground hover:text-foreground transition-colors"
                        : "text-muted-foreground hover:text-foreground transition-colors"}
                >
                    Articles
                </a>
                <a
                    href={route("app.publishers.index")}
                    use:inertia
                    class={route("app.publishers.index").includes($page.url)
                        ? "text-foreground hover:text-foreground transition-colors"
                        : "text-muted-foreground hover:text-foreground transition-colors"}
                >
                    Publishers
                </a>
            </nav>
            <Sheet.Root>
                <Sheet.Trigger asChild let:builder>
                    <Button
                        variant="outline"
                        size="icon"
                        class="shrink-0 md:hidden"
                        builders={[builder]}
                    >
                        <Menu class="h-5 w-5" />
                    </Button>
                </Sheet.Trigger>
                <Sheet.Content side="left">
                    <nav class="grid gap-6 text-lg font-medium">
                        <a
                            href={route("app.articles.index")}
                            use:inertia
                            class={route("app.articles.index").includes(
                                $page.url,
                            )
                                ? "text-foreground hover:text-foreground transition-colors"
                                : "text-muted-foreground hover:text-foreground transition-colors"}
                        >
                            Articles
                        </a>
                        <a
                            href={route("app.publishers.index")}
                            use:inertia
                            class={route("app.publishers.index").includes(
                                $page.url,
                            )
                                ? "text-foreground hover:text-foreground transition-colors"
                                : "text-muted-foreground hover:text-foreground transition-colors"}
                        >
                            Publishers
                        </a>
                    </nav>
                </Sheet.Content>
            </Sheet.Root>
        {/if}
    </div>
    <div>
        {#if $page.props.auth.authed}
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    Hi, {$page.props.auth.user.name}!
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    <DropdownMenu.Group>
                        <DropdownMenu.Item>
                            <a
                                use:inertia
                                href={route("app.profile.keys")}
                                class="inline-flex items-center gap-2"
                            >
                                <KeyRound />
                                Keys
                            </a>
                        </DropdownMenu.Item>
                    </DropdownMenu.Group>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Group>
                        <DropdownMenu.Item>
                            <a
                                use:inertia
                                href={route("logout")}
                                class="inline-flex items-center gap^-2"
                            >
                                <PowerOff />
                                Sign Out
                            </a>
                        </DropdownMenu.Item>
                    </DropdownMenu.Group>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        {:else}
            <Button><a href={route("login")}>Sign In</a></Button>
        {/if}
    </div>
</div>
<div class="">
    <slot name="crumbs" />
</div>
