<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { page, inertia } from "@inertiajs/svelte";
    import { KeyRound, Newspaper, NotebookPen, PowerOff } from "lucide-svelte";
</script>

<div class="w-full flex justify-between bg-background py-6 px-4 items-center">
    <a use:inertia href={route("app.articles.index")}>MagiEdit</a>
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
                                href={route("app.articles.index")}
                                class="inline-flex items-center gap-2"
                            >
                                <NotebookPen />
                                Articles
                            </a>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item>
                            <a
                                use:inertia
                                href={route("app.publishers.index")}
                                class="inline-flex items-center gap-2"
                            >
                                <Newspaper />
                                Publishers
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
            <Button><a use:inertia href={route("login")}>Sign In</a></Button>
        {/if}
    </div>
</div>
