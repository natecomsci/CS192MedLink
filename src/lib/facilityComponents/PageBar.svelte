<script lang="ts">
  let { currentPage = $bindable(),
        totalPages = $bindable(),
        perPage = $bindable(),
        getPage
      } = $props();

  let options = [10, 20, 50];

</script>

<!-- PAGINATIONNNNNNN -->
<div class="flex items-center mx-auto justify-center gap-4 mt-4 w-2/3">
  <div class="flex items-center space-x-2">
    <!-- Double Left-->
    <button 
      type="button"
      class="bg-gray-200 p-2 w-8 h-8 hover:bg-gray-300 rounded-md text-gray-700 flex items-center justify-center"
      onclick={() => getPage(-currentPage)+1}
      disabled={currentPage === 1} >
      « 
    </button>

    <!-- Single Left -->
    <button 
      type="button"
      class="bg-gray-200 p-2 w-8 h-8 hover:bg-gray-300 rounded-md text-gray-700 flex items-center justify-center"
      onclick={() => getPage(-1)}
      disabled={currentPage === 1} >
      ‹
    </button>

    <!-- Current Page -->
    <div class="flex items-center justify-center space-x-2">
      <span class="bg-purple-400 p-2 w-8 h-8 hover:bg-purple-700 rounded-md text-white font-semibold flex items-center justify-center">{currentPage}</span>
      <span class="text-gray-700 font-medium">of {totalPages}</span>
    </div>

    <!-- Single Right -->
    <button 
      type="button"
      class="bg-gray-200 p-2 w-8 h-8 hover:bg-gray-300 rounded-md text-gray-700 flex items-center justify-center" 
      onclick={() => getPage(1)} 
      disabled={currentPage === totalPages}>
      ›
    </button>

    <!-- Double Right -->
    <button 
      type="button"
      class="bg-gray-200 p-2 w-8 h-8 hover:bg-gray-300 rounded-md text-gray-700 flex items-center justify-center"
      onclick={() => getPage(totalPages-currentPage)}
      disabled={currentPage === totalPages} >
      »
    </button>

    <!-- View Dropdown -->
    <div class="ml-4 flex items-center">
      <label class="text-gray-700 font-medium gap-2">
        View
        <select
          bind:value={perPage}
          class="border border-gray-400 rounded-md px-2 py-1 text-gray-700 focus:outline-none"
          onchange={()=>{
            currentPage = 1
            getPage(0)
          }}
        >
          {#each options as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
      </label>
    </div>
  </div>  
</div>