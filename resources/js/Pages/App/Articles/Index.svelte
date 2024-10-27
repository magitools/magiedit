<script>
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { Label } from "$lib/components/ui/label";
    import * as Sheet from "$lib/components/ui/sheet";
    import { Switch } from "$lib/components/ui/switch";
    import { toast } from "svelte-sonner";
    import { inertia } from "@inertiajs/svelte";
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

    let selectedPublishers = {};
    let publisherSelectOpen = false;
    let selectedArticle = null;
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
            <Card.Footer>
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
                <!--
                <Button variant="destructive">Delete</Button>
                -->
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
