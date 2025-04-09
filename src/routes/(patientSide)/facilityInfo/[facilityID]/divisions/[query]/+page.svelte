<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props(); // Extract data
  let query = data.query;
  let results = data.results ?? [];

</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Results for "{query}"</h1>

  {#if results.length > 0}
    <ul class="list-disc pl-5">
      {#each results as division}
        <li class="flex justify-between items-center mb-2">
          <form
            method="POST"
            action="?/viewDetails"
          >
            <input type="hidden" name="divisionID" value={division.divisionID} />
            <input type="hidden" name="divisionName" value={division.name} />
            <span>{division.name}</span>
            <button 
            class="p-2 text-white bg-blue-500 rounded-full hover:bg-blue-600 transition" 
          >+</button>
          </form>

        </li>
      {/each}
    </ul>
  {:else}
    <p class="text-gray-600">No results found.</p>
  {/if}
</div>
