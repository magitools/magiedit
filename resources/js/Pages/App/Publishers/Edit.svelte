<script>
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
    import { router } from "@inertiajs/svelte";
    import { toast } from "svelte-sonner";
    import { onMount } from "svelte";
    export let publisher;
    export let provider;

    let name = "";
    let data = {};

    function save() {
        router.put(
            route("app.publishers.update", [publisher.id]),
            {
                data,
                name,
            },
            {
                onSuccess: () => {
                    console.log("ok");
                },
            },
        );
    }

    onMount(() => {
        Object.keys(publisher.data).forEach((k) => {
            data[k] = publisher.data[k];
        });
        name = publisher.name;
    });
</script>

<Breadcrumb.Root slot="crumbs">
    <Breadcrumb.List>
        <Breadcrumb.Item>
            <Breadcrumb.Link href={route("app.publishers.index")}>
                Publishers
            </Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
            <Breadcrumb.Link
                href={route("app.publishers.edit", [publisher.id])}
            >
                Edit
            </Breadcrumb.Link>
        </Breadcrumb.Item>
    </Breadcrumb.List>
</Breadcrumb.Root>

<div>
    <div class="space-y-6">
        <form on:submit|preventDefault={save}>
            <div>
                <Label for="name">Publisher Name</Label>
                <Input bind:value={name} id="name" required />
            </div>
            {#each provider["inputs"] as input}
                <div>
                    <Label for={input.name}>{input.label}</Label>
                    {#if input.input == "input"}
                        <Input
                            id={input.name}
                            required
                            bind:value={data[input.name]}
                            placeholder={input.placeholder}
                        />
                    {/if}
                </div>
            {/each}
            <Button type="submit">Create</Button>
        </form>
    </div>
</div>
