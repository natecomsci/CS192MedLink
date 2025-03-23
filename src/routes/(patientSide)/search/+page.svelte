<script lang="ts">
  import { enhance } from '$app/forms';
    import type { FacilityDTO } from '$lib';

  let { data, form } = $props();
  let activeTab = $state("service"); // Default view

  let facilities: FacilityDTO[] = $state([])
  let services: FacilityDTO[] = $state([])

  facilities = [...(data.facilities ?? [])]
  services = [...(data.services ?? [])]

  let currFacilityOffset: number = $state(10)
  let currServiceOffset: number = $state(10)

  let currFacilityHasMore: boolean = $state(data.moreFacilities ?? false)
  let currServiceHasMore: boolean = $state(data.moreServices ?? false)

  async function getPage(hasMore: boolean, query: string) {
    let currOffset: number
    if (!hasMore) {
      return
    } 

    if (activeTab === "facility") {
      currOffset = currFacilityOffset
    } else if (activeTab === "service") {
      currOffset = currServiceOffset
    } else {
      return
    }

    const body = JSON.stringify({activeTab, currOffset, query});

    try {
      const response = await fetch("./search/loadMoreHandler", {
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

      if (activeTab === "facility") {
        facilities = [...facilities, ...rv.results];
        currFacilityOffset = currFacilityOffset + 10;
        currFacilityHasMore = rv.hasMore;
      } else if (activeTab === "service") {
        services = [...services, ...rv.results];
        currServiceOffset = currServiceOffset + 10;
        currServiceHasMore = rv.hasMore;
      } else {
        return
      }
      
    } catch (error) {
      throw new Error(`Response status: ${error}`);
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
        <form method="POST" action="?/viewDetails">
          <input type="hidden" name="facilityID" value={facility.facilityID} />
          <button type="submit" class="text-xl font-bold">+</button>
        </form>
      </div>
      {/each}
      {#if currFacilityHasMore} 
        <button onclick={() => getPage(currFacilityHasMore, data.query ?? '')}>
          Load more...
        </button>
      {/if}
    {:else}     
      <p>No facilities found.</p>
    {/if}

    {:else if activeTab === "service"}
    {#if services.length > 0}
      {#each services as service}
        <div class="bg-white shadow-lg rounded-lg p-4 flex justify-between items-center">
          <div>
            <span class="font-semibold">{service.name}</span>
            <p class="text-sm text-gray-600">{service.type}</p> <!-- Display service type -->
            <input type="hidden" name="facilityID" value={service.facilityID} />
          </div>
          <button class="text-xl font-bold">+</button>
        </div>
      {/each}
      {#if currServiceHasMore} 
        <button onclick={() => getPage(currServiceHasMore, data.query ?? '')}>
          Load more...
        </button>
      {/if}
    {:else}
      <p>No services found.</p>
    {/if}
  {/if}  
</div>
