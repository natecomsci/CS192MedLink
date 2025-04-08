<script lang="ts">
  import type { AdminDTO } from "$lib";

  let { admins }: { admins: AdminDTO[]} = $props();
</script>

<div class="bg-white shadow-lg rounded-lg p-4 h-2/7">
  <div class="flex justify-between items-center border-b border-[#DBD8DF] pb-2">
    <h2 class="text-[30px] text-[#9044C4] font-bold">Admins</h2>
      <a 
        href="./dashboard/manageAdmins" 
        class="flex items-center text-purple-500 text-m hover:text-purple-400 gap-2 transition-colors duration-200"
        data-sveltekit-reload
      >
        <img src="/dashedit_icon.svg" alt="Edit" class="w- h-7">      
        Manage Admins

      </a>
  </div>
  
  <div class="flex gap-2 mt-4">
    {#if admins.length > 0}
      {#each admins as {fname, lname}}
        <div class="w-15 h-15 text-center bg-gray-300 rounded-full">
          {fname} {lname}
        </div>
      {/each}
    {:else}
      <a href="/facility/dashboard/manageAdmins">Add an admin</a>
    {/if}

  </div>
</div>
  