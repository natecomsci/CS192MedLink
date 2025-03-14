<script lang="ts">
  import type { ServiceDTO } from "$lib/server/DTOs";
    import type { PageProps } from "./$types";

  let { data, form }: PageProps = $props();
  const services: ServiceDTO[] = data.services ?? []

</script>

<div class="bg-white shadow-lg rounded-lg p-8">
  <div class="flex justify-between items-center border-b border-[#DBD8DF] pb-2">
    <h2 class="text-[30px] text-[#9044C4] font-bold">Services</h2>
    <a 
      href="./dashboard/manageServices" 
      class="text-purple-500 text-sm hover:text-purple-400 transition-colors duration-200"
      data-sveltekit-reload
    >✏️ Manage Services</a>
  </div>

  <div class="mt-4">
    {#each services as { type }}
      <div class="py-2 border-b border-transparent">
        <p class="font-bold">{type} Information</p>
        <!-- <p class="text-gray-500 italic">Emergency Division</p> -->
      </div>
    {/each}
  </div>
</div>