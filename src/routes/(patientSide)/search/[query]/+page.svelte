<script lang="ts">
  import type { ServiceResultsDTO } from '$lib';

  let { data, form } = $props();

  const patientSearchPageSize = data.patientSearchPageSize ?? 5;

  let services: ServiceResultsDTO[] = $state(data.services ?? [])

  let currOffset: number = $state(5)
  let hasMore: boolean = $state(data.moreServices ?? false)

  async function loadMode(query: string) {
    if (!hasMore) {
      return
    } 
    const body = JSON.stringify({currOffset, query});

    try {
      const response = await fetch("./loadMoreHandler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const rv = await response.json();
      services = [...services, ...rv.results];
      currOffset = currOffset + patientSearchPageSize;
      hasMore = rv.hasMore;
      
    } catch (error) {
      throw new Error(`Response status: ${error}`);
    }
  }

</script>

<div class="max-w-md mx-auto p-4 bg-[#FDFCFD]">
  <form 
    method="POST"
    action="?/search"
    class="items-center space-x-2"
  >
    <div class="flex items-center gap-2 p-2 rounded-full border border-gray-300 bg-white shadow-sm w-full">
      <a href="/" class="pl-4 text-gray-500">
        ←
      </a>
      <input
        type="text"
        name="query"
        value={data.query}
        placeholder="Search services..."
        class="flex-1 p-2 text-gray-700 bg-transparent outline-none"
      />
      <button type="submit" class="p-2 text-gray-500">
        <img src="/search_icon.svg" alt="Search" class="w-6 h-6" />
      </button>
    </div>
  </form>
  {#if form?.error}
    <p class="error">{form.error}</p>
  {/if}
  {#if services.length > 0}
    <div class="mt-3">
      {#each services as service}
        <div class="mb-3 flex justify-between items-center pl-4 pr-4 pt-3 pb-3 border border-gray-300 rounded-xl shadow-lg bg-white w-full">
          <div class="w-full">
            <div class="flex justify-between items-center">
              <p class="font-bold text-purple-900">{service.name}</p>
              <form
                method="POST"
                action="?/viewDetails"
              >
                <input type="hidden" name="facilityID" value={service.facilityID} />
                <input type="hidden" name="serviceID" value={service.serviceID} />
                <input type="hidden" name="serviceType" value={service.type} />

                <button
                  class="text-gray-700 hover:bg-gray-200 rounded-full transition">
                  <img src="/plus_icon.svg" alt="Add" class="w-5 h-5" />
                </button>
              </form>
            </div>
            <hr class="my-1 border-gray-300">
            <p class="italic text-sm text-gray-600">{service.type}</p>
          </div>
        </div>
      {/each}
    </div>
    {#if hasMore} 
      <div class="flex justify-center mt-4">
        <button 
          class="bg-[#9044C4] rounded-lg px-6 py-3 text-white font-semibold shadow-md hover:bg-gray-600 transition"
          onclick={() => loadMode(data.query ?? '')}>
          Load More
        </button>
      </div>
    {/if}
  {:else}
    <p>No services found.</p>
  {/if}
</div>
