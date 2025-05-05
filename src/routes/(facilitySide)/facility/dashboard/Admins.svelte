<script lang="ts">
  import type { AdminDTO } from "$lib";
  let { admins }: { admins: AdminDTO[]} = $props();

  import TempMan from '$lib/images/TempMan.png';

</script>

<div class="bg-white shadow-lg rounded-lg flex-1 flex flex-col h-2/8 pl-4 pr-4 pt-4 pb-2"> <!-- Adjusted height to 2/8 of the parent container -->
  <!-- Admin Header -->
  <div class="flex justify-between items-center p-2">
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
  

  <hr class="my-2 border-gray-300"> <!-- Line -->   

  <!-- Horizontal Scrollable Admin List -->
  <div class="overflow-x-auto whitespace-nowrap flex gap-3 h-full items-center justify-start p-2"> <!-- Added padding for better spacing -->
    {#if admins.length > 0}
      {#each admins as {fname, lname}}
        <div class="flex flex-col items-center w-24 shrink-0 ">
          <!-- Rounded Profile Image Placeholder -->
          <img src={TempMan} alt="Profile" class="w-16 h-16 rounded-full border border-gray-300" />

          <!-- Display Admin Name in 'J. Doe' Format -->
          <p class=" font-semibold text">{fname.charAt(0)}. {lname}</p>
        </div>        
      {/each}

    {:else}
      <div class="flex justify-center items-center h-full w-full">
        <a 
          href="/facility/dashboard/manageAdmins" 
          class="px-6 py-3 text-[25px] text-center font-semibold text-primary-400 hover:text-primary-300 transition-all duration-200 rounded-lg"
        >
          + Add an Admin
        </a>
      </div>
    {/if}
  </div>
</div>
  
<style>
  /* Apply to the horizontal scrolling container */
  .overflow-x-auto::-webkit-scrollbar {
    height: 5px; /* Reducing height to make the scrollbar thinner */
  }

  .overflow-x-auto::-webkit-scrollbar-thumb {
    background: #b0a0ba; /* Scrollbar color */
    border-radius: 5px;
  }

  .overflow-x-auto::-webkit-scrollbar-track {
    background: #e0e0e0; /* Track color */
  }

.overflow-x-auto::-webkit-scrollbar {
    width: 5px !important;
}
</style>