<script lang="ts">
	export let data;
</script>

<a href="/write/new">New Article</a>

{#each data?.articles as article}
	<div>
		<h2>{article.title}</h2>
		<a href={`/write/${article.id}`}>Edit</a>
	</div>
{/each}