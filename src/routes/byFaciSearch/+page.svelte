<script lang="ts">
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();
    let query = '';
    let searchResults = [...data.facilities]; // Initially, show all facilities

    async function handleSearch(event: SubmitEvent) {
        event.preventDefault();
        
        const formData = new FormData(event.target as HTMLFormElement);
        console.log("🔍 Search query submitted:", query);

        try {
            const response = await fetch("/byFaciSearch", { 
                method: "POST", 
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log("✅ Search results:", result.facilities?.map(f => f.name));

            // ✅ Only show search results (do not revert to all facilities)
            searchResults = [...result.facilities];

        } catch (error) {
            console.error("❌ Fetch error:", error);
            searchResults = []; // ✅ If error occurs, show no results
        }
    }
</script>

<h1>Facilities</h1>

<form onsubmit={handleSearch} method="POST">
    <input type="text" bind:value={query} name="query" placeholder="Search facilities..." />
    <button type="submit">Search</button>
</form>

{#if searchResults.length > 0}
    <ul>
        {#each searchResults as facility}
            <li>{facility.name}</li>
        {/each}
    </ul>
{:else}
    <p>No facilities found.</p>
{/if}
