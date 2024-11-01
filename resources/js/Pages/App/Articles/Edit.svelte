<script>
    import Editor from "@/Components/Articles/Editor.svelte";
    import Frontmatter from "@/Components/Articles/Frontmatter.svelte";
    import { Button } from "$lib/components/ui/button";
    import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
    import { router } from "@inertiajs/svelte";
    import { toast } from "svelte-sonner";
    export let article;

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

        router.put(
            route("app.articles.update", [article.id]),
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

    let content = article.content;
    let loading = false;
    let fm = Object.keys(article.fm).map((key) => ({
        key,
        value: article.fm[key],
    }));
</script>

<svelte:head>
    <title>Articles | Magiedit</title>
</svelte:head>

<Breadcrumb.Root slot="crumbs">
    <Breadcrumb.List>
        <Breadcrumb.Item>
            <Breadcrumb.Link href={route("app.articles.index")}
                >Articles</Breadcrumb.Link
            >
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
            <Breadcrumb.Link href={route("app.articles.edit", [article.id])}>
                Edit
            </Breadcrumb.Link>
        </Breadcrumb.Item>
    </Breadcrumb.List>
</Breadcrumb.Root>

<div class="flex flex-col space-y-6">
    <div>
        <Button on:click={save}>Save</Button>
    </div>
    <h1 class="font-bold text-xl">{article.title}</h1>
    <Frontmatter {fm} onChange={onFmChange} />
    <Editor {content} {onChange} />
</div>
