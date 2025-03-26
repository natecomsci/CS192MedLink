<script lang="ts">
  import type { PageProps } from './$types';
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';

  let { data, form }: PageProps = $props(); // Extract data
  let services = data.services; 
  let query = ""; // Removed $state, unnecessary in Svelte
  let facilityName = data.facilityName;

  function searchServices() {
    if (query.trim() !== "") {
      goto(`/servicesForSearch/${data.facilityID}/searchServicesWithinFacility/${query}`);
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

<div class="max-w-md mx-auto p-4">
  <h2 class="text-lg font-semibold">Services offered by {facilityName}</h2>

  <!-- Search Bar -->
  <div class="flex items-center space-x-2">
    <input
      type="text"
      bind:value={query}
      placeholder="Search services..."
      class="flex-1 p-2 rounded-lg border border-gray-300"
    />
    {#if form?.error}
      <p class="text-red-600 mt-2">{form.error}</p>
    {/if}
    <button
      type="button"
      class="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
      onclick={searchServices}
    >
      Search
    </button>
  </div>

  <!-- Services List -->
  {#if services.length > 0}
    <ul class="list-disc pl-5 mt-4">
      {#each services as service}
        <li class="flex justify-between items-center">
          <span>{service.type}</span>
          <button
            class="text-xl font-bold"
            onclick={() => viewServiceDetails(service)}
          >
            +
          </button>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="mt-4">No services available.</p>
  {/if}
</div>