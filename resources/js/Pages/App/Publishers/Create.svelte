<script>
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import * as Select from "$lib/components/ui/select";
    import { Label } from "$lib/components/ui/label";
    import { router } from "@inertiajs/svelte";
    import { toast } from "svelte-sonner";

    export let providers;

    let name = "";
    let selectedProvider = null;
    let data = {};

    function save() {
        router.post(
            route("app.publishers.store"),
            {
                name,
                data,
                class_name: selectedProvider,
            },
            {
                onSuccess: () => {
                    console.log("ok");
                },
            },
        );
    }
</script>

<div>
    <Select.Root
        onSelectedChange={(v) => {
            data = {};
            selectedProvider = v?.value;
        }}
    >
        <Select.Trigger>
            <Select.Value placeholder="choose a provider..." />
        </Select.Trigger>
        <Select.Content>
            {#each providers as provider}
                <Select.Item value={provider.class}>{provider.name}</Select.Item
                >
            {/each}
        </Select.Content>
    </Select.Root>
    <div class="space-y-6">
        <form on:submit|preventDefault={save}>
            <div>
                <Label for="name">Publisher Name</Label>
                <Input bind:value={name} id="name" required />
            </div>
            {#if selectedProvider != null}
                {#each providers.find((e) => e.class == selectedProvider)["inputs"] as input}
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
            {/if}
        </form>
    </div>
</div>
