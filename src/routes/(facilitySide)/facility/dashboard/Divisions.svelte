<script lang="ts">
  import type { DivisionDTO } from "$lib";

  let { divisions }: { divisions: DivisionDTO[]} = $props();
</script>


<div class="bg-white shadow-lg rounded-lg p-8 w-full">
  <div class="flex justify-between items-center border-b border-[#DBD8DF] pb-2">
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

  <div class="mt-4">
    {#each divisions as {name}}
      <p class="py-2 border-b border-transparent italic">{name}</p>
    {/each}
  </div>
</div>
