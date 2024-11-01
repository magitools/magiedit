<script>
    import * as Card from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { toast } from "svelte-sonner";
    import { inertia, router } from "@inertiajs/svelte";
    import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
    export let publishers;

    function prepareDestroy(id) {
        deleteId = id;
        deleteDialogOpen = true;
    }

    async function destroy() {
        const toastId = toast.loading("deleting publisher...");
        await router.delete(route("app.publishers.destroy", [deleteId]), {
            onSuccess: () => {
                toast.success("publisher deleted!", { id: toastId });
            },
        });
        deleteDialogOpen = false;
        deleteId = null;
    }

    let deleteId = null;
    let deleteDialogOpen = false;
</script>

<svelte:head>
    <title>Publishers | Magiedit</title>
</svelte:head>

<Breadcrumb.Root slot="crumbs">
    <Breadcrumb.List>
        <Breadcrumb.Item>
            <Breadcrumb.Link href={route("app.publishers.index")}
                >Publishers</Breadcrumb.Link
            >
        </Breadcrumb.Item>
    </Breadcrumb.List>
</Breadcrumb.Root>

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
            <Card.Footer>
                <Button>
                    <a
                        use:inertia
                        href={route("app.publishers.edit", [publisher.id])}
                        >Edit</a
                    >
                </Button>
                <Button
                    variant="destructive"
                    on:click={prepareDestroy(publisher.id)}>Delete</Button
                >
            </Card.Footer>
        </Card.Root>
    {/each}
</div>

<Dialog.Root bind:open={deleteDialogOpen}>
    <Dialog.Trigger />
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>Delete Publisher?</Dialog.Title>
            <Dialog.Description
                >Are you sure? This is a definitive action</Dialog.Description
            >
        </Dialog.Header>
        <Dialog.Footer>
            <Button
                on:click={() => {
                    deleteId = null;
                    deleteDialogOpen = false;
                }}>Cancel</Button
            >
            <Button type="submit" variant="destructive" on:click={destroy}
                >Ok</Button
            >
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
