<script lang="ts">
    import { AppBar } from '@skeletonlabs/skeleton';

</script>

<AppBar>
    <svelte.fragment slot="lead"><a href="/">MagiEdit</a></svelte.fragment>
    <svelte.fragment slot="trail">
        <ul>
            <li><a href="/settings">settings</a></li>
        </ul>
    </svelte.fragment>
</AppBar>