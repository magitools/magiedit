<script>
	import { page } from '$app/stores';
	import { db } from '$lib/storage/db';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import { redirect } from '@sveltejs/kit';
	import { marked } from 'marked';
	export let data;
	let source = true;
	let title = data?.article?.title ?? '';
	let content = data?.article?.content ?? '';
    let loading = false;
	$: renderedContent = marked.parse(content);

    async function handleSave() {
        loading = true;
        if (data?.article?.id) {
            await db.articles.update(data.article.id, {
                title,
                content,
                published: false
            });
        } else {
            const id = await db.articles.put({
                title,
                content,
                tags: []
            });
            redirect(302, `/write/${id}`);
        }
    }
</script>


<div class="flex flex-col h-full w-full">
    <SlideToggle on:change={() => (source = !source)} name="view-source" checked={source}
        >View {source ? 'rendered' : 'source'}</SlideToggle
    >
    
    <button class="btn variant-filled-primary" on:click={handleSave}>
        Save
    </button>
    
    {#if source}
    <div class="w-full h-full flex flex-col">
        <label for="title" class="label">
            <span>title</span>
            <input bind:value={title} type="text" class="input" name="title" placeholder="the title of the article goes here" />
        </label>
        <textarea bind:value={content} class="textarea flex-1" placeholder="Enter your article here." />
    </div>
    {:else}
        <h1>{title}</h1>
        {@html renderedContent}
    {/if}
</div>




