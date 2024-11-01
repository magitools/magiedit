<script>
    import Editor from "@/Components/Articles/Editor.svelte";
    import Frontmatter from "@/Components/Articles/Frontmatter.svelte";
    import { Button } from "$lib/components/ui/button";
    import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
    import { router } from "@inertiajs/svelte";
    import { toast } from "svelte-sonner";

    function onChange(value) {
        content = value;
    }

    function onFmChange(value) {
        fm = value;
    }

    function save() {
        const formattedFm = {};
        const toastId = toast.loading("saving data...");
        fm.forEach((el) => {
            formattedFm[el.key] = el.value;
        });

        router.post(
            route("app.articles.store"),
            {
                content,
                fm: formattedFm,
            },
            {
                onSuccess: () => {
                    toast.success("content saved", { id: toastId });
                },
            },
        );
    }

    let content = "<p>hello world</p>";
    let loading = false;
    let fm = [];
</script>

<Breadcrumb.Root slot="crumbs">
    <Breadcrumb.List>
        <Breadcrumb.Item>
            <Breadcrumb.Link href={route("app.articles.index")}
                >Articles</Breadcrumb.Link
            >
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
            <Breadcrumb.Link href={route("app.articles.create")}>
                New
            </Breadcrumb.Link>
        </Breadcrumb.Item>
    </Breadcrumb.List>
</Breadcrumb.Root>

<div>
    <Button on:click={save}>Save</Button>
    <Frontmatter {fm} onChange={onFmChange} />
    <Editor {content} {onChange} />
</div>
