<script lang="ts">
	import { generateArticleBlob } from "$lib/articles/download";
    let loading = false;
    export let article;

    let frontmatter = article.frontmatter ? JSON.parse(article.frontmatter) : {};

    const handleDownload = async(id: string) => {
		loading = true;
		const article = await db.articles.get(id);
		const data = await generateArticleBlob(id);
		const link = window.URL.createObjectURL(data)
		let a = document.createElement("a");
		a.setAttribute("download", `${article.title}.md`);
		a.setAttribute("href", link);
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		loading = false;
	}
    console.log(article)
</script>

<div class="card min-w-[300px]">
    <h2 class="card-header">{article.title}</h2>
    {#if frontmatter?.cover}
        <img src={frontmatter.cover} class="w-full h-auto" alt="article cover">
    {/if}
    <section class="p-4">
    </section>
    <div class="card-footer">
    <a class="btn variant-filled" href={`/write/${article.id}`}>Edit</a>
    <button class="btn variant-filled" on:click={() => handleDownload(article.id)}>Download</button>
    </div>
</div>