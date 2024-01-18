<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	export let authed: boolean;
	export let username: string;
</script>

<div class="w-full flex justify-between bg-background py-6 px-4 items-center">
	<a href="/app">MagiEdit</a>
	<div>
		{#if authed}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					Hi, {username}!
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.Item href="/profile">Profile</DropdownMenu.Item>
					</DropdownMenu.Group>
					<DropdownMenu.Separator />
					<DropdownMenu.Group>
						<DropdownMenu.Item href="/app/publications">Publishers</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{:else}
			<Button href="/login">Sign In</Button>
		{/if}
	</div>
</div>
