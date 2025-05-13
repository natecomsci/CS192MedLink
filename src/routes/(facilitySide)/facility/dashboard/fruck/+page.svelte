<script lang="ts">
  import { writable } from "svelte/store";

  let searchQuery = writable("");

  function clearSearch() {
    searchQuery.set("");
  }
</script>

<div class="relative w-full max-w-md">
    <!-- Search Input -->
    <input 
        type="text" 
        bind:value={$searchQuery}
        placeholder="Search" 
        class="w-full border border-gray-300 rounded-full py-2 pl-10 pr-10 focus:outline-none focus:border-purple-500"
    >

    <!-- Clear Button ("X") -->
    {#if $searchQuery.length > 0}
      <button 
        class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600 focus:outline-none"
        on:click={clearSearch}
      >
        ✕
      </button>
    {/if}
</div>


<!-- <div class="relative flex items-center gap-2 pl-2 rounded-full border border-gray-300 bg-background shadow-sm flex-grow">
        <input
          type="text"
          name="Search"
          bind:value={query}
          onkeydown={handleKeydown}
          placeholder="Search"
          class="flex-1 p-2 text-gray-700 bg-transparent outline-none"
        />
        {#if query.length > 0 || isInQueryMode}
            <button onclick={() => {
              query = ""
              error = ""
              errorLoc = ""
              isInQueryMode = false
              currentPage = 1
              getPage(0)
            }}>
                <img src="/x.svg" alt="Search" class="w-4 h-4" />
            </button>
        {/if}
        <button type="submit" class="text-gray-500 mr-2" 
                onclick={() => {
                  isInQueryMode = true
                  currentPage = 1
                  getPage(0)
                  }}
                >
          <img src="/search_icon.svg" alt="Search" class="w-6 h-6" />
        </button>
      </div> -->