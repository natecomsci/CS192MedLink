<script lang="ts">
  import { enhance } from '$app/forms';

  let { data, form } = $props();
  let activeTab = $state("service"); // Default view
  let query = $state(""); // Store search input
  let facilities = data.facilities || [];

</script>

<div class="max-w-md mx-auto p-4">
  <!-- Search Bar -->
  <form 
    use:enhance 
    class="flex items-center space-x-2"
  >
    <input
      type="text"
      name="query"
      value={query}
      placeholder={activeTab === "facility" ? "Search facilities..." : "Search services..."}
      class="flex-1 p-2 rounded-lg border border-gray-300"
    />
    <input type="hidden" name="type" value={activeTab === "facility" ? "byFacility" : "byService"} />
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
    {#if data.byFacilities.length > 0}
      {#each data.byFacilities as facility}
        <div class="bg-white shadow-lg rounded-lg p-4 flex justify-between items-center">
          <div>
            <span class="font-semibold">{facility.name}</span>
            {#if activeTab === "service" && facility.service}
              <p class="text-sm text-gray-600">Services: {facility.serviceID.name(", ")}</p>
            {/if}
          </div>
          <button class="text-xl font-bold">+</button>
        </div>
      {/each}
    {:else}
      <p>No facilities found.</p>
    {/if}

  {:else if activeTab === "service"}
    {#if form ? data.byService.length > 0 : form?.byService.length}
      {#each data.byService as facility}
        <div class="bg-white shadow-lg rounded-lg p-4 flex justify-between items-center">
          <div>
            <span class="font-semibold">{facility.name}</span>
            {#if activeTab === "service" && facility.service}
              <p class="text-sm text-gray-600">Services: {facility.serviceID.name(", ")}</p>
            {/if}
          </div>
          <button class="text-xl font-bold">+</button>
        </div>
      {/each}
    {:else}
      <p>No facilities found.</p>
    {/if}
  {/if}

  <!-- <div class="mt-4 space-y-3">
    {#if facilities.length > 0}
      {#each facilities as facility}
        <div class="bg-white shadow-lg rounded-lg p-4 flex justify-between items-center">
          <div>
            <span class="font-semibold">{facility.name}</span>
            {#if activeTab === "service" && facility.service}
              <p class="text-sm text-gray-600">Services: {facility.serviceID.name(", ")}</p>
            {/if}
          </div>
          <button class="text-xl font-bold">+</button>
        </div>
      {/each}
    {:else}
      <p>No facilities found.</p>
    {/if}
  </div> -->
</div>
