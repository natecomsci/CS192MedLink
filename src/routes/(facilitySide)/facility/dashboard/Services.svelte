<script lang="ts">
  import type { ServiceDTO } from "$lib";

  let { mainServicesShown }: {mainServicesShown: ServiceDTO[]} = $props();

</script>

<div class="bg-white shadow-lg rounded-lg p-8 w-full">
  <div class="flex justify-between items-center border-b border-[#DBD8DF] pb-2">
    <h2 class="text-[30px] text-[#9044C4] font-bold">Services</h2>
    <a 
      href="./dashboard/manageServices" 
      class="text-purple-500 text-sm hover:text-purple-400 transition-colors duration-200"
      data-sveltekit-reload
    >✏️ Manage Services</a>
  </div>

  <div class="mt-4">
    {#each mainServicesShown as { type, division }}
      <div class="py-2 border-b border-transparent">
        <p class="font-bold">{type} Information</p>
        {#if division?.name}
          <p class="text-gray-500 italic">{division?.name} Division</p>
        {/if}
      </div>
    {/each}
  </div>
</div>