<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ServiceResultsDTO } from '$lib';
  
  let { data, form } = $props();

  let services: ServiceResultsDTO[] = $state(data.services ?? [])

  let currOffset: number = $state(10)
  let hasMore: boolean = $state(data.moreServices ?? false)

  async function getPage(query: string) {
    if (!hasMore) {
      return
    } 
    const body = JSON.stringify({currOffset, query});

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
      services = [...services, ...rv.results];
      currOffset = currOffset + 10;
      hasMore = rv.hasMore;
      
    } catch (error) {
      throw new Error(`Response status: ${error}`);
    }
  }
function viewServiceDetails(service: ServiceResultsDTO) {
  let url = "";

  if (service.type === "Ambulance") {
    url = `/serviceInfo/Ambulance/${service.serviceID}`;
  } else if (service.type === "Blood Bank") {
    url = `/serviceInfo/BloodBank/${service.serviceID}`;
  } else if (service.type === "Emergency Room") {
    url = `/serviceInfo/Emergency/${service.serviceID}`;
  } else if (service.type === "Intensive Care Unit") {
    url = `/serviceInfo/ICU/${service.serviceID}`;
  } else {
    url = `/serviceInfo/Outpatient/${service.serviceID}`;
  }

  window.location.href = url; // Forces a full page reload
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
      placeholder="Search services..."
      class="flex-1 p-2 rounded-lg border border-gray-300"
    />
    {#if form?.error}
      <p class="text-red-600 mt-2">{form.error}</p>
    {/if}
    <button type="submit" class="p-2 rounded-full bg-gray-200">Search</button>

  </form>
  {#if services.length > 0}
    {#each services as service}
      <div class="bg-white shadow-lg rounded-lg p-4 flex justify-between items-center">
        <div>
          <span class="font-semibold">{service.name}</span>
          <p class="text-sm text-gray-600">{service.type}</p> <!-- Display service type -->
          <input type="hidden" name="facilityID" value={service.facilityID} />
        </div>
        <button class="text-xl font-bold" onclick={() => viewServiceDetails(service)}>+</button>
      </div>
    {/each}
    {#if hasMore} 
      <button onclick={() => getPage(data.query ?? '')}>
        Load more...
      </button>
    {/if}
  {:else}
    <p>No services found.</p>
  {/if}
</div>
