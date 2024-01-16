<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';

	export let data;
</script>

<form method="post">
	<Label for="name">Publication Name</Label>
	<Input name="name" value={data.publication.name} />
	{#each Object.keys(data.publication.publisherData) as pubDataName}
		<Label for={pubDataName}>{data.labels.find((e) => e.htmlFor === pubDataName)?.value}</Label>
		<Input name={pubDataName} value={data.publication.publisherData[pubDataName]} />
	{/each}
	<Button type="submit">Save</Button>
</form>
