<script lang="ts">
  import type { PageProps } from './$types';
  import { goto } from '$app/navigation';

  let { data, form }: PageProps = $props(); // Extract data
  let services = $state(data.services ?? []);
  let query = $state("");
  let facilityName = $state(data.facilityName ?? "");

  function searchServices() {
    if (query.trim() !== "") {
      goto(`/servicesForSearch/${data.facilityID}/searchServicesWithinFacility/${query}`);
    }
  }
</script>

<div class=" no-scrollbar overflow-y-auto max-h-[calc(100vh-100px)] sm:max-h-[calc(100vh-150px)] max-w-md mx-auto bg-[#FDFCFD] shadow-lg ">
   <!-- Top Header -->
  <div class="bg-white px-4 py-4 flex items-center shadow-md">
    <button class="mr-2">
      ⬅
    </button>
    <h2 class="text-lg font-bold flex-1 text-center">{facilityName} Services</h2>
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
        placeholder="Search services..."
        class="flex-1 p-2 px-3 text-gray-700 bg-transparent outline-none"
      />
      {#if form?.error}
        <p class="text-red-600 mt-2">{form.error}</p>
      {/if}
      <button type="submit" class="p-2 text-gray-500">
        <img src="/search_icon.svg" alt="Search" class="w-6 h-6" />
      </button>
    </div>
  </form>

{#if services.length > 0}
  <div class="pl-5 pr-5 pb-4 pt-3">
  {#each services as service}
    <div class="mb-3 h-15 flex justify-between items-center pl-4 pr-4 pt-3 pb-3 border border-gray-300 rounded-xl shadow-lg bg-white w-full">

      <form
        method="POST"
        action="?/viewDetails"
        class="flex justify-between items-center w-full"
      >
          <input type="hidden" name="serviceID" value={service.serviceID} />
          <input type="hidden" name="serviceType" value={service.type} />
          <p class="text-l text-[#3D1853] font-semibold">{service.type}</p>
          <button
            class="text-gray-700 hover:bg-gray-200 rounded-full transition">
            <img src="/plus_icon.svg" alt="Add" class="w-5 h-5" />
          </button>
      </form>
      
    </div>
  {/each}
  </div>
  <div class="flex justify-center p-4">
    <button 
      class="bg-[#9044C4] rounded-lg px-6 py-3 text-white font-semibold shadow-md hover:bg-gray-600 transition"
      >
      Load more...
    </button>
  </div>

{:else}
  <p>No services found.</p>
{/if}
</div>
