<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';

	export let data;
	let selectedPlatform: string | null = null;
</script>

<form action="" method="post">
	<Select.Root onSelectedChange={(v) => (selectedPlatform = String(v?.value))}>
		<Select.Trigger>
			<Select.Value placeholder="Platform" />
		</Select.Trigger>
		<Select.Content>
			{#each data.platforms as platform}
				<Select.Item value={platform.platformId}>{platform.platformName}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
	<Label for="publisher_name">Publication Name</Label>
	<Input name="publisher_name" required />
	<input type="hidden" name="publisher_id" value={selectedPlatform} />
	{#if selectedPlatform}
		{#each data.platforms.find((e) => e.platformId === selectedPlatform)?.platformSettings as setting}
			{#if setting.type === 'input'}
				<Label for={setting.label.htmlFor}>{setting.label.value}</Label>
				<Input id={setting.name} name={setting.name} {...setting.settings} />
			{/if}
		{/each}
	{/if}
	<Button type="submit" disabled={!selectedPlatform}>Create</Button>
</form>
