<script lang="ts">
  import type { PageProps } from './$types';
  import { enhance } from '$app/forms';

  let { data, form }: PageProps = $props(); // Extract data from load function
  let services = data.results; // Fix: Use `results` instead of `services`
  let query = data.query; // Retain previous query in input
  let facilityID = data.facilityID;
</script>

<div class="max-w-md mx-auto p-4">
  <!-- Search Bar -->
  <form 
    use:enhance
    method="GET"
    action={`/servicesForSearch/${facilityID}/services`} <!-- Fix: Ensure facilityID is included in the URL -->
    class="flex items-center space-x-2"
  >
    <input
      type="text"
      name="query"
      placeholder="Search services..."
      value="{query}" <!-- Fix: Retain previous search value -->
      class="flex-1 p-2 rounded-lg border border-gray-300"
    />
    <button type="submit" class="p-2 rounded-full bg-gray-200">Search</button>
  </form>

  {#if form?.error}
    <p class="text-red-600 mt-2">{form.error}</p>
  {/if}

  <!-- Services List -->
  {#if services.length > 0}
    <ul class="list-disc pl-5 mt-4">
      {#each services as service}
        <li class="flex justify-between items-center p-2 border-b">
          <span>{service.type}</span>
          <button class="text-xl font-bold px-2 py-1 bg-blue-500 text-white rounded-lg">+</button>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="mt-4 text-gray-600">No services available.</p>
  {/if}
</div>
