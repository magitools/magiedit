<script lang="ts">
	import { db } from '$lib/storage/db';

export let data;
let dev_token = "";
let hashnode_token = "";
let hashnode_publication_id = "";

const handleSave = async() => {
    if (dev_token) {
        await db.settings.put({name:"dev_token", value: dev_token})
    }
    if (hashnode_token) {
        await db.settings.put({name:"hashnode_token", value: hashnode_token})
    }
    if (hashnode_publication_id) {
        await db.settings.put({name:"hashnode_publication_id", value: hashnode_publication_id});
    }
}
</script>

<div>
    <label class="label">
        <span>Dev.to</span>
        <input bind:value={dev_token} class="input" placeholder="dev.to api key" />
    </label>
    <label class="label">
        <span>Hashnode</span>
        <input bind:value={hashnode_token} class="input" placeholder="hashnode personal token" />
    </label>
    <label class="label">
        <span>Hashnode Publication Id</span>
        <input bind:value={hashnode_publication_id} class="input" placeholder="hashnode publication id" />
    </label>
</div>

<button class="btn" on:click={handleSave}>Save</button>