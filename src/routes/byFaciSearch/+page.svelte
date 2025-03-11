<script lang="ts">
  export let data;
  let activeTab = "facility"; // Default view
  let query = ""; // Store search input
  let facilities = data.facilities || [];

  // Function to handle tab change
  function changeTab(tab: "facility" | "service") {
    activeTab = tab;
    query = ""; // Reset search on tab switch
  }
</script>

<div class="max-w-md mx-auto p-4">
  <!-- Search Bar -->
  <form method="get" use:enhance class="flex items-center space-x-2">
    <input
      type="text"
      name="query"
      bind:value={query}
      placeholder={activeTab === "facility" ? "Search facilities..." : "Search services..."}
      class="flex-1 p-2 rounded-lg border border-gray-300"
      required
    />
    <input type="hidden" name="type" value={activeTab === "facility" ? "byFacility" : "byService"} />
    <button type="submit" class="p-2 rounded-full bg-gray-200">Search</button>
  </form>

  <!-- Tabs -->
  <div class="flex mt-4 border-b">
    <button
      class="flex-1 text-center py-2 font-semibold"
      class:text-purple-600={activeTab === "service"}
      on:click={() => changeTab("service")}
    >
      BY SERVICE
    </button>
    <button
      class="flex-1 text-center py-2 font-semibold"
      class:text-purple-600={activeTab === "facility"}
      on:click={() => changeTab("facility")}
    >
      BY FACILITY
    </button>
  </div>

  <!-- Facility List -->
  <div class="mt-4 space-y-3">
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
  </div>
</div>
