<script>
    import * as Table from "$lib/components/ui/table";
    import { Input } from "$lib/components/ui/input";
    import { Button } from "$lib/components/ui/button";
    import { Trash } from "lucide-svelte";
    export let fm;
    export let onChange;

    let data = fm;
    function addRow() {
        data = [...data, { key: "", value: "" }];
    }

    function deleteRow(rowKey) {
        data = data.filter((e) => e.key !== rowKey);
    }

    $: onChange(data);
</script>

<div>
    <Table.Root>
        <Table.Header>
            <Table.Row>
                <Table.Head>Key</Table.Head>
                <Table.Head>Value</Table.Head>
                <Table.Head>Actions</Table.Head>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {#each data as { key, value }}
                <Table.Row>
                    <Table.Cell><Input bind:value={key} /></Table.Cell>
                    <Table.Cell><Input bind:value /></Table.Cell>
                    <Table.Cell>
                        <Button on:click={deleteRow(key)} variant="destructive">
                            <Trash />
                        </Button>
                    </Table.Cell>
                </Table.Row>
            {/each}
        </Table.Body>
    </Table.Root>
    <Button on:click={addRow}>Add</Button>
</div>
