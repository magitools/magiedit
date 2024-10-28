<script>
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { Label } from "$lib/components/ui/label";
    import * as Sheet from "$lib/components/ui/sheet";
    import * as Dialog from "$lib/components/ui/dialog";
    import { Switch } from "$lib/components/ui/switch";
    import { toast } from "svelte-sonner";
    import { inertia, router } from "@inertiajs/svelte";
    export let articles;
    export let publishers;

    function handlePublish(id) {
        selectedArticle = id;
        publisherSelectOpen = true;
    }

    async function publish() {
        const toastId = toast.loading("publishing content...");
        const res = await axios.post(
            route("app.articles.publish", [selectedArticle]),
            {
                publishers: Object.keys(selectedPublishers).filter(
                    (e) => selectedPublishers[e],
                ),
            },
        );
        if (res.status == 200) {
            toast.success("content published!", { id: toastId });
            selectedPublishers = {};
            publisherSelectOpen = false;
        }
    }

    function prepareDestroy(id) {
        selectedArticle = id;
        articleDeleteDialogOpen = true;
    }

    async function destroy() {
        const toastId = toast.loading("deleting content...");
        await router.delete(route("app.articles.destroy", [selectedArticle]), {
            onSuccess: () => {
                toast.success("content deleted!", { id: toastId });
                selectedArticle = null;
                articleDeleteDialogOpen = false;
            },
        });
    }

    let selectedPublishers = {};
    let publisherSelectOpen = false;
    let selectedArticle = null;
    let articleDeleteDialogOpen = false;
    //TODO show status for individual publisher output
</script>

<Button>
    <a use:inertia href={route("app.articles.create")}>New</a>
</Button>
<div class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {#each articles as article}
        <Card.Root>
            <Card.Header>
                <Card.Title>{article.title}</Card.Title>
            </Card.Header>
            <Card.Content></Card.Content>
            <Card.Footer class="space-x-6">
                <Button>
                    <a
                        use:inertia
                        href={route("app.articles.edit", [article.id])}>Edit</a
                    >
                </Button>
                <!--
                <Button>Download</Button>
                -->
                <Button on:click={handlePublish(article.id)}>Publish</Button>
                <Button
                    variant="destructive"
                    on:click={prepareDestroy(article.id)}>Delete</Button
                >
            </Card.Footer>
        </Card.Root>
    {/each}
</div>

<Sheet.Root bind:open={publisherSelectOpen}>
    <Sheet.Trigger />
    <Sheet.Content>
        <Sheet.Header>
            <Sheet.Title>Ready to publish?</Sheet.Title>
            <Sheet.Description>
                <form
                    class="space-y-6 flex flex-col"
                    on:submit|preventDefault={publish}
                >
                    <span>Please choose at least one publisher</span>
                    {#each publishers as publisher}
                        <Label for={publisher.id}>{publisher.name}</Label>
                        <Switch
                            bind:checked={selectedPublishers[publisher.id]}
                            id={publisher.id}
                        />
                    {/each}
                    <Button type="submit">Send it!</Button>
                </form>
            </Sheet.Description>
        </Sheet.Header>
    </Sheet.Content>
</Sheet.Root>

<Dialog.Root bind:open={articleDeleteDialogOpen}>
    <Dialog.Trigger />
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>Delete Article?</Dialog.Title>
            <Dialog.Description
                >Are you sure? This is a definitive action</Dialog.Description
            >
        </Dialog.Header>
        <Dialog.Footer>
            <Button
                on:click={() => {
                    articleDeleteDialogOpen = false;
                    selectedArticle = null;
                }}>Cancel</Button
            >
            <Button variant="destructive" on:click={destroy}>Ok</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
