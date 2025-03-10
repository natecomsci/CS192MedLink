<script lang="ts">
    export let data;
</script>

<form method="get">
    <input type="text" name="query" placeholder="Search facilities..." required>
    <button type="submit">Search</button>
</form>

{#if data.facilities.length > 0}
    <h2>Search Results:</h2>
    <ul>
        {#each data.facilities as facility}
            <li>{facility.name}</li>
        {/each}
    </ul>
{:else}
    <p>No facilities found.</p>
{/if}
