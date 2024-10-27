<script>
    import Editor from "@/Components/Articles/Editor.svelte";
    import Frontmatter from "@/Components/Articles/Frontmatter.svelte";
    import { Button } from "$lib/components/ui/button";
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

<div>
    <Button on:click={save}>Save</Button>
    {article.title}
    <Frontmatter {fm} onChange={onFmChange} />
    <Editor {content} {onChange} />
</div>
