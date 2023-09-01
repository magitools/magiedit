<script lang="ts">
    let query = "";

    const handleSearch = async() => {
        const data = await (await fetch(`/api/giphy?query=${query}`)).json()
        console.log(data)
        results = data.data
    }

    let results = []

</script>

<div class="w-2/3 h-2/3">
    <label for="query" class="label"><span>Search</span>
        <input type="search" name="query" id="query" class="input" bind:value={query}>
    </label>
    <button class="btn variant-filled" on:click={handleSearch} >Search</button>
    <div class="grid grid-cols-3 gap-4 overflow-y-auto h-full">
        {#each results as result}
            <img src={result.images.downsized_medium.url} alt={result.title} />
        {/each}
    </div>
</div>