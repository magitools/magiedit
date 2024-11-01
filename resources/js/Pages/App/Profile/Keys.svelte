<script>
    import * as Table from "$lib/components/ui/table";
    import { Button } from "$lib/components/ui/button";
    import * as Sheet from "$lib/components/ui/sheet";
    import * as Dialog from "$lib/components/ui/dialog";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { toast } from "svelte-sonner";
    import { Trash } from "lucide-svelte";
    import { router } from "@inertiajs/svelte";
    export let keys;

    async function create() {
        const toastId = toast.loading("creating your new API key...");
        const res = await axios.post(
            route("app.profile.keys.store", {
                name: keyName,
            }),
        );
        if (res.status == 201) {
            toast.success("API key created!", { id: toastId });
            token = res.data.token;
            keySheetOpen = false;
            keyName = "";
            keyCopyDialogOpen = true;
        }
    }

    function closeCopyKey() {
        keyCopyDialogOpen = false;
        token = null;
        router.reload({ only: ["keys"] });
    }

    let keySheetOpen = false;
    let keyCopyDialogOpen = false;
    let keyName = "";
    let token = null;
</script>

<svelte:head>
    <title>Keys | Magiedit</title>
</svelte:head>

<div class="space-y-6">
    <div>
        <Button on:click={() => (keySheetOpen = true)}>New</Button>
    </div>
    <Table.Root>
        <Table.Caption>A list of all your api keys</Table.Caption>
        <Table.Header>
            <Table.Row>
                <Table.Head>Name</Table.Head>
                <Table.Head>Created At</Table.Head>
                <Table.Head>Actions</Table.Head>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {#each keys as key}
                <Table.Row>
                    <Table.Cell>{key.name}</Table.Cell>
                    <Table.Cell>{key.created_at}</Table.Cell>
                    <Table.Cell>
                        <Button variant="destructive" on:click={delete key.id}>
                            <Trash />
                        </Button>
                    </Table.Cell>
                </Table.Row>
            {/each}
        </Table.Body>
    </Table.Root>
</div>

<Dialog.Root bind:open={keyCopyDialogOpen}>
    <Dialog.Trigger />
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>Here's your new API Key</Dialog.Title>
            <Dialog.Description
                >Please copy it somewhere; you won't be able to see its value
                again!</Dialog.Description
            >
        </Dialog.Header>
        <Dialog.Description>
            <div class="space-y-6">
                <div>
                    <span>{token}</span>
                </div>
                <div class="flex">
                    <div class="flex-1"></div>
                    <Button on:click={closeCopyKey}>Got It!</Button>
                </div>
            </div>
        </Dialog.Description>
    </Dialog.Content>
</Dialog.Root>

<Sheet.Root bind:open={keySheetOpen}>
    <Sheet.Trigger />
    <Sheet.Content>
        <Sheet.Header>
            <Sheet.Title>Want to create a new API Key?</Sheet.Title>
        </Sheet.Header>
        <Sheet.Description>
            <form class="space-y-6" on:submit|preventDefault={create}>
                <div>
                    <Label for="name">Name</Label>
                    <Input
                        bind:value={keyName}
                        id="name"
                        required
                        placeholder="name your API Key"
                    />
                </div>
                <Button type="submit">Create</Button>
            </form>
        </Sheet.Description>
    </Sheet.Content>
</Sheet.Root>
