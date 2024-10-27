<script>
    import * as Card from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { inertia } from "@inertiajs/svelte";
    export let publishers;
</script>

<Button>
    <a use:inertia href={route("app.publishers.create")}>New</a>
</Button>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each publishers as publisher}
        <Card.Root>
            <Card.Header>
                <Card.Title>{publisher.name}</Card.Title>
            </Card.Header>
            <Card.Content></Card.Content>
            <Card.Footer></Card.Footer>
        </Card.Root>
    {/each}
</div>
