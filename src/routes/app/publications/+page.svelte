<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	export let data;
</script>

<div class="w-full flex justify-center">
	<Button href="/app/publications/new">Add Publication</Button>
</div>
<div class="w-full gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4">
	{#each data.publications as publication}
		<Card.Root>
			<Card.Header>
				<Card.Title>{publication.name}</Card.Title>
			</Card.Header>
			<Card.Footer>
				<Button href={`/app/publications/${publication.id}`}>Edit</Button>
				<form action={`?/deletePublication&publicationId=${publication.id}`} method="post">
					<Button type="submit" variant="destructive">Delete</Button>
				</form>
			</Card.Footer>
		</Card.Root>
	{/each}
</div>
