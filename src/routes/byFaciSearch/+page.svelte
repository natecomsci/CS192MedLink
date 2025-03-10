<script lang="ts">
    import type { PageProps } from './$types';
    import { enhance } from '$app/forms';

    let { data }: PageProps = $props();
    let query = $state('');
    let searchResults = $state(data.facilities); // Initially, show all facilities


</script>

<h1>Facilities</h1>

<form method="POST" action="/byFaciSearch" use:enhance>
    <input type="text" bind:value={query} name="query" placeholder="Search facilities..." />
    <button type="submit">Search</button>

    {#if searchResults.length > 0}
        <ul>
            {#each searchResults as facility}
                <li>{facility.name}</li>
            {/each}
        </ul>
    {:else}
        <p>No facilities found.</p>
    {/if}
</form>
