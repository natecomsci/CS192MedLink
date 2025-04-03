<script lang="ts">
  import { goto } from '$app/navigation';
  import type { PageProps } from './$types';
  import type { ServiceDTO } from '$lib';

  let { data }: PageProps = $props(); // Extract data
  let query = data.query;
  let results = data.results ?? [];

  function viewServiceDetails(service: ServiceDTO) {
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

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Results for "{query}"</h1>

  {#if results.length > 0}
    <ul class="list-disc pl-5">
      {#each results as service}
        <li class="flex justify-between items-center mb-2">
          <span>{service.type}</span>
          <button 
            class="p-2 text-white bg-blue-500 rounded-full hover:bg-blue-600 transition" 
            onclick={() => viewServiceDetails(service)}
          >
            +
          </button>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="text-gray-600">No results found.</p>
  {/if}
</div>
