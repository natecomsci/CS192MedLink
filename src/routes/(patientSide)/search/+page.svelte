<script lang="ts">
  import { enhance } from '$app/forms';
  import type { FacilityDTO } from '$lib';
  import { goto } from '$app/navigation';
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

  function viewServiceDetails(service) {
  if (service.type === "Ambulance") {
    goto(`/serviceInfo/Ambulance/${service.serviceID}`);
  } else if (service.type === "Blood Bank") {
    goto(`/serviceInfo/BloodBank/${service.serviceID}`);
  } else if (service.type === "Emergency Room") {
    goto(`/serviceInfo/Emergency/${service.serviceID}`);
  } else if (service.type === "Intensive Care Unit") {
    goto(`/serviceInfo/ICU/${service.serviceID}`);
  } else {
    goto(`/serviceInfo/Outpatient/${service.serviceID}`);
  }
}

</script>

<div class="max-w-md mx-auto p-4 bg-[#FDFCFD]">
  <!-- Search Bar -->
  <form 
    use:enhance 
    action="?/search"
    class="items-center space-x-2"
  >

  <!-- Search Bar -->
  <div class="flex items-center gap-2 p-2 rounded-full border border-gray-300 bg-white shadow-sm w-full">
    <button type="button" class="pl-4 text-gray-500">
      ←
    </button>
    <input
      type="text"
      name="query"
      value={data.query}
      placeholder="Search"
      class="flex-1 p-2 text-gray-700 bg-transparent outline-none"
    />
    <button type="submit" class="p-2 text-gray-500">
      <img src="/search_icon.svg" alt="Search" class="w-6 h-6" />
    </button>
  </div>

  <!-- Tabs -->
    <div class="flex mt-2 border-b">
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

    <!-- ================= Facility ================== -->

  {#if activeTab === "facility"}
    {#if facilities.length > 0}
      <div class="mt-3">
        {#each facilities as facility}

        <div class="mb-3 flex justify-between items-center p-2 pl-4 border border-gray-300 rounded-xl shadow-lg bg-white w-full">
          <div>
            <span class="font-bold text-purple-900">{facility.name}</span>
          </div>
        <form method="POST" action="?/viewDetails" class="flex justify-center items-center">
          <input type="hidden" name="facilityID" value={facility.facilityID} />
          <button type="submit" class="p-2 text-gray-700 hover:bg-gray-200 rounded-full transition">
            <img src="/plus_icon.svg" alt="Add" class="w-5 h-5" />
          </button>
        </form>

        </div>
        {/each}
      </div>


      {#if currFacilityHasMore} 
        <div class="flex justify-center mt-4">
          <button 
            class="bg-[#9044C4] rounded-lg px-6 py-3 text-white font-semibold shadow-md hover:bg-gray-600 transition"
            onclick={() => getPage(currFacilityHasMore, data.query ?? '')}>
            Load more...
          </button>
        </div>
      {/if}

    {:else}     
      <p>No facilities found.</p>
    {/if}

  <!-- ================= Service ================== -->

  {:else if activeTab === "service"}
    {#if services.length > 0}
      <div class="mt-3">
        {#each services as service}
        <div class="mb-3 flex justify-between items-center pl-4 pr-4 pt-3 pb-3 border border-gray-300 rounded-xl shadow-lg bg-white w-full">
          <div class="w-full">
            <div class="flex justify-between items-center">
              <p class="font-bold text-purple-900">{service.name}</p>
              <input type="hidden" name="facilityID" value={service.facilityID} />
              <button 
                onclick={() => viewServiceDetails(service)}
                class="text-gray-700 hover:bg-gray-200 rounded-full transition">
                <img src="/plus_icon.svg" alt="Add" class="w-5 h-5" />
              </button>
            </div>
            <hr class="my-1 border-gray-300">
            <p class="italic text-sm text-gray-600">{service.type}</p>
          </div>
        </div>
        {/each}
      </div>

      {#if currServiceHasMore} 
        <div class="flex justify-center mt-4">
          <button 
            class="bg-[#9044C4] rounded-lg px-6 py-3 text-white font-semibold shadow-md hover:bg-gray-600 transition"
            onclick={() => getPage(currServiceHasMore, data.query ?? '')}>
            Load more...
          </button>
        </div>

      {/if}
    {:else}
      <p>No services found.</p>
    {/if}
    
{/if}   
</div>
