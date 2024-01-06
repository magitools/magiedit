<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Github } from 'lucide-svelte';
</script>

<div class="w-full h-full flex flex-col justify-center items-center bg-background">
	<Card.Root>
		<Card.Header>
			<Card.Title>Join MagiEdit</Card.Title>
		</Card.Header>
		<Card.Content>
			<p>
				Creating and logging into an account is used to synchronize your notes and make them
				available on other devices.
			</p>
		</Card.Content>
		<Card.Footer class="w-full flex justify-center">
			<Button href="/login/github" class="">
				<Github class="mr-2 h-4 w-4" />
				Login with Github
			</Button>
		</Card.Footer>
	</Card.Root>
</div>
