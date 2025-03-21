<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props(); // Ensure you're properly extracting the services data
  let services = $state(data.services);
  let name = $state(data.facilityName);
  
</script>

<div class="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
  <h2 class="text-xl font-semibold">Services Offered by </h2>

  {#if services.length > 0}
    <ul class="list-disc pl-5">
      {#each services as service}
        <li>{service.type}</li>
      {/each}
    </ul>
  {:else}
    <p>No services available for this facility.</p>
  {/if}
</div>
