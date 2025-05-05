<script lang="ts">
  import type { DivisionDTO } from "$lib";

  let { divisions }: { divisions: DivisionDTO[]} = $props();
</script>


<div class="bg-white shadow-lg rounded-lg flex-1 flex flex-col h-full p-4">
  <!-- Header -->
  <div class="flex justify-between items-center p-2">
    <h2 class="text-[30px] text-[#9044C4] font-bold">Divisions</h2>
    <a 
        href="./dashboard/manageDivisions" 
        class="flex items-center text-purple-500 text-m hover:text-purple-400 gap-2 transition-colors duration-200"
        data-sveltekit-reload
      >
        <img src="/dashedit_icon.svg" alt="Edit" class="w- h-7">      
        Manage Divisions
      </a>
  </div>

  <hr class="mt-2 border-gray-300"> <!-- Line -->   

  <div class="overflow-y-auto flex-1 h-0 min-h-0 max-h-full p-2 ">
    {#each divisions as {name}}
      <p class="py-2 border-b border-transparent italic">{name}</p>
    {/each}
  </div>
</div>
