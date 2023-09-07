<script lang="ts">
	import { enhance } from '$app/forms';

	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>Profile</h1>
<p>User id: {data.userId}</p>
<p>username: {data.username}</p>
<p>email: {data.email}</p>
<form method="post" action="?/logout" use:enhance>
	<button class="btn variant-filled-error" type="submit">Sign Out</button>
</form>
