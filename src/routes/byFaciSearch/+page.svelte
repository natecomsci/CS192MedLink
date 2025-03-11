<script lang="ts">
  export let data;
  let activeTab = "facility";
  let facilities = Array(6).fill({ name: "Facility Name", expanded: false });

  // Determine if Load More should be displayed (adjust threshold as needed)
  let showLoadMore = facilities.length > 6;
</script>

<!-- <form method="get">
  <input type="text" name="query" placeholder="Search facilities..." required />
  <button type="submit">Search</button>
</form> -->

<!-- {#if data.facilities.length > 0}
  <h2>Search Results:</h2>
  <ul>
    {#each data.facilities as facility}
      <li>{facility.name}</li>
    {/each}
  </ul>
{:else}
  <p>No facilities found.</p>
{/if} -->

<div class="max-w-md mx-auto p-4">
  <!-- Search Bar -->
  <form method="get" class="flex items-center space-x-2">
    <input type="text" name="query" placeholder="Search facilities..."  class="flex-1 p-2 rounded-lg border border-gray-300" required />
    <button type="submit" class="p-2 rounded-full bg-gray-200">Search</button>
  </form>

  <!-- Tabs -->
  <div class="flex mt-4 border-b">
    <button
      class="flex-1 text-center py-2 font-semibold"
      class:text-purple-600={activeTab === "service"}
      on:click={() => (activeTab = "service")}
    >
      BY SERVICE
    </button>
    <button
      class="flex-1 text-center py-2 font-semibold"
      class:text-purple-600={activeTab === "facility"}
      on:click={() => (activeTab = "facility")}
    >
      BY FACILITY
    </button>
  </div>

  <!-- Facility List -->
  <div class="mt-4 space-y-3">
    {#if data.facilities.length > 0}
        {#each data.facilities as facility}
            <div
                class="bg-white shadow-lg rounded-lg p-4 flex justify-between items-center cursor-pointer"
            >
                <span class="font-semibold">{facility.name}</span>
                <button class="text-xl font-bold">+</button>
            </div>
        {/each}
    {:else}
        <p>No facilities found.</p>
    {/if}
  </div>

  <!-- Load More Button (Only if facilities exceed screen length) -->
  {#if showLoadMore}
    <button class="mt-6 w-full bg-purple-600 text-white py-2 rounded-lg">
      Load More
    </button>
  {/if}
</div>