<script lang="ts">
  import type { PageProps } from './$types';
  import { enhance } from '$app/forms';
  let { data, form }: PageProps = $props(); // Extract data
  let services = $state(data.services);
  let query = $state("");
  async function getNewAdmins() {
    const body = JSON.stringify({query: query});

    try {
      const response = await fetch("./servicesForSearch/"+ data.facilityID, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      services = await response.json();
      
    } catch (error) {
      throw new Error(`Response status: ${error}`);
    }
  }

</script>


<div class="max-w-md mx-auto p-4">
  <!-- Search Bar -->
  <form 
  use:enhance
    method="POST"
    action="?/search"
    class="flex items-center space-x-2"
  >
    <input
      type="text"
      name="query"
      bind:value={query}
      placeholder="Search services..."
      class="flex-1 p-2 rounded-lg border border-gray-300"
    />
    {#if form?.error}
      <p class="text-red-600 mt-2">{form.error}</p>
    {/if}
    <button type="button" class="p-2 rounded-full bg-gray-200" on_click={()=>getNewAdmins()}>Search</button>
  </form>

  <!-- Services List -->
  {#if data.services.length > 0}
    <ul class="list-disc pl-5 mt-4">
      {#each data.services as service}
      <li class="flex justify-between items-center">
        <span>{service.type}</span>
        <button class="text-xl font-bold px-2 py-1 bg-blue-500 text-white rounded-lg">+</button>
      </li>
    {/each}
    </ul>
  {:else}
    <p class="mt-4">No services available.</p>
  {/if}
</div>