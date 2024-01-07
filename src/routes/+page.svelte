<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';

	let loading = false;
</script>

<div class="w-full h-full flex flex-col justify-center items-center bg-background">
	<Card.Root>
		<Card.Content class="space-y-4">
			<h1
				class="text-4xl h-16 lg:text-5xl bg-gradient-to-r dark:from-[#59C173] dark:via-[#a17fe0] dark:to-[#2C5364] from-[#000428] to-[#004e92] bg-clip-text text-transparent"
			>
				Welcome to Magiedit
			</h1>
			<p>your one-stop destination to writing and publishing articles</p>
		</Card.Content>
		<Card.Footer>
			<Button href="/app" class="w-full">Get Writing</Button>
		</Card.Footer>
	</Card.Root>
</div>
