<script lang="ts">
  import type { ServiceDTO } from "$lib";

  let { mainServicesShown }: {mainServicesShown: ServiceDTO[]} = $props();

</script>

<div class="bg-white shadow-lg rounded-lg flex-1 flex flex-col h-full p-4">
  <!-- Header -->
  <div class="flex justify-between items-center p-2">
    <h2 class="text-[30px] text-[#9044C4] font-bold">Services</h2>
    <a 
      href="./dashboard/manageServices"
      class="flex items-center text-purple-500 text-m hover:text-purple-400 gap-2"
      data-sveltekit-reload
    >
      <img src="/dashedit_icon.svg" alt="Edit" class="h-7" /> Manage Services
    </a>
  </div>

  <hr class="mt-2 border-gray-300"> <!-- Line -->   

  <!-- Scrollable content that adapts -->
  <div class="overflow-y-auto flex-1 h-0 min-h-0 max-h-full p-2 ">
    {#each mainServicesShown as { type, division }}
      <div class="py-2 border-b border-transparent">
        <p class="service">{type}</p>
        {#if division?.name}
          <p class="text-gray-500 italic">{division.name}</p>
        {/if}
      </div>
    {/each}
  </div>
</div>



<style>
  .service {
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 20px;
    color: #565656;
    letter-spacing: -0.02em;
  }
</style>