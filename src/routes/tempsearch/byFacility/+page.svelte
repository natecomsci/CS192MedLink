<script lang="ts">
    import type { PageProps } from './$types';
    let { data, form }: PageProps = $props();
    let query = "";

    async function handleSearch(event: SubmitEvent) {
        event.preventDefault();
        
        const formData = new FormData(event.target as HTMLFormElement);
        const response = await fetch("/search", {
            method: "POST",
            body: formData
        });

        const result = await response.json();
        data.facilities = result.facilities || [];
    }
</script>

<h1>Facilities</h1>

<form method="POST" action="/tempsearch/byFacility">
    <input type="text" bind:value={query} name="query" placeholder="Search facilities..." />
    <button type="submit">Search</button>
</form>


{#if data.facilities.length > 0}
    <ul>
        {#each data.facilities as facility}
            <li>{facility.name}</li>
        {/each}
    </ul>
{:else}
    <p>No facilities found.</p>
{/if}
