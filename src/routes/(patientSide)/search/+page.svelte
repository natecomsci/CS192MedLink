<script lang="ts">
  import { enhance } from '$app/forms';
  import { onMount } from 'svelte';
  
  let { data, form } = $props();
  let activeTab = $state("service"); // Default view

  // State variables for loading more
  let offset = 10; // Start after the initial 10 results
  let facilities = [...(data.byFacilities ?? [])]; // Preserve facilities
  let hasMoreFacilities = data.hasMoreFacilities ?? false;
  
  async function loadMore() {
    const query = data.query;

    const res = await fetch(`?/search?query=${query}&offset=${offset}`);
    const newData = await res.json();

    if (newData.results.length > 0) {
      facilities = [...facilities, ...newData.results]; // Append new results
      offset += 10; // Increase offset for next fetch
      hasMoreFacilities = newData.hasMore; // Update "Load More" visibility
    }
  }
</script>

<div class="max-w-md mx-auto p-4">
  <!-- Search Bar -->
  <form 
    use:enhance 
    action="?/search"
    class="flex items-center space-x-2"
  >
    <input
      type="text"
      name="query"
      value={data.query}
      placeholder={activeTab === "facility" ? "Search facilities..." : "Search services..."}
      class="flex-1 p-2 rounded-lg border border-gray-300"
    />
    {#if form?.error}
      <p class="text-red-600 mt-2">{form.error}</p>
    {/if}
    <button type="submit" class="p-2 rounded-full bg-gray-200">Search</button>

    <!-- Tabs -->
    <div class="flex mt-4 border-b">
      <button
        class="flex-1 text-center py-2 font-semibold"
        class:text-purple-600={activeTab === "service"}
        type="button"
        onclick={() => activeTab = "service"}
      >
        BY SERVICE
      </button>
      <button
        class="flex-1 text-center py-2 font-semibold"
        class:text-purple-600={activeTab === "facility"}
        type="button"
        onclick={() => activeTab = "facility"}
      >
        BY FACILITY
      </button>
    </div>
  </form>

  {#if activeTab === "facility"}
    {#if facilities.length > 0}
      {#each facilities as facility}
        <div class="bg-white shadow-lg rounded-lg p-4 flex justify-between items-center">
          <div>
            <span class="font-semibold">{facility.name}</span>
          </div>
          <button class="text-xl font-bold">+</button>
        </div>
      {/each}
      
      {#if hasMoreFacilities}
        <button 
          class="mt-4 p-2 bg-gray-200 rounded-lg w-full text-center"
          onclick={loadMore}
        >
          Load More
        </button>
      {/if}
      
    {:else}
      <p>No facilities found.</p>
    {/if}
  {/if}
</div>
