<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props(); // Extract data
  let query = data.query;
  let results = data.results ?? [];

</script>

<!-- <div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Results for "{query}"</h1>

  {#if results.length > 0}
    <ul class="list-disc pl-5">
      {#each results as service}
        <li class="flex justify-between items-center mb-2">
          <form
            method="POST"
            action="?/viewDetails"
          >
            <input type="hidden" name="serviceID" value={service.serviceID} />
            <input type="hidden" name="serviceType" value={service.type} />
            <span>{service.type}</span>
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
</div> -->



<div class=" no-scrollbar overflow-y-auto max-h-[calc(100vh-100px)] sm:max-h-[calc(100vh-150px)] max-w-md mx-auto bg-[#FDFCFD] shadow-lg ">
   <!-- Top Header -->
  <div class="bg-white px-4 py-4 flex items-center shadow-md">
    <button class="mr-2">
      ⬅
    </button>
    <h2 class="text-lg font-bold flex-1 text-center"> services</h2>
  </div>

  <!-- Search Bar -->
  <form 
    method="POST"
    action="?/search"
    class="items-center space-x-2 p-4"
  >
    <div class="flex items-center gap-2 p-2 rounded-full border border-gray-300 bg-white shadow-sm w-full">
      <input
        type="text"
        name="query"
        value={query}
        placeholder="Search services"
        class="flex-1 p-2 px-3 text-gray-700 bg-transparent outline-none"
      />

      <button type="submit" class="p-2 text-gray-500">
        <img src="/search_icon.svg" alt="Search" class="w-6 h-6" />
      </button>
    </div>
  </form>

  <h1 class="text-xl text-center font-bold">Results for "{query}"</h1>
{#if results.length > 0}
  <div class="pl-5 pr-5 pb-4 pt-3">
    {#each results as service}
    <div class="mb-3 h-15 flex justify-between items-center pl-4 pr-4 pt-3 pb-3 border border-gray-300 rounded-xl shadow-lg bg-white w-full">
      <form
      method="POST"
      action="?/viewDetails"
      class="flex justify-between items-center w-full"
    >
      <input type="hidden" name="serviceID" value={service.serviceID} />
      <input type="hidden" name="serviceType" value={service.name} />
      <p class="text-l text-[#3D1853] font-semibold">{service.type}</p>
      <button
        name="viewDetails"
        type="submit"
        class="text-gray-700 hover:bg-gray-200 rounded-full transition"
      >
        <img src="/plus_icon.svg" alt="Add" class="w-5 h-5" />
      </button>
    </form>
    
    </div>
  {/each}
  </div>


{:else}
  <p>No services found.</p>
{/if}
</div>

