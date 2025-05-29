<script lang="ts">
    let {
      withfilter = true,
      query = $bindable(),
      viewedDivisionID = $bindable(),
      error = $bindable(),
      errorLoc = $bindable(),
      isInQueryMode = $bindable(),
      data, // not bindable
      currentPage = $bindable(),
      getPage // not bindable
    } = $props();
  
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Enter") {
        isInQueryMode = true;
        currentPage = 1;
        getPage(0);
      }
    }
  
    function clearSearch() {
      query = "";
      error = "";
      errorLoc = "";
      isInQueryMode = false;
      currentPage = 1;
      getPage(0);
    }
  
    function triggerSearch() {
      isInQueryMode = true;
      currentPage = 1;
      getPage(0);
    }
  
    function handleViewChange() {
      query = "";
      error = "";
      errorLoc = "";
      getPage(0);
    }
  </script>
 
<!-- Search and View By -->
<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between w-2/3 mb-6 pr-9">
<div class="relative flex items-center gap-2 pl-2 rounded-full border border-gray-300 bg-background shadow-sm flex-grow">
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
</div>
{#if errorLoc == "query"}
    {error}
{/if}
{#if withfilter && data.hasDivisions && data.divisions.length > 1}
        <!-- Ensures "View By:" stays in one line -->
        <span class="whitespace-nowrap text-sm">View By :</span>
        <select
        bind:value={viewedDivisionID}
        class="pl-2 text-sm border border-gray-300 rounded-full h-10 w-1/7 shadow-sm"
        onchange={()=>{
            console.log(viewedDivisionID)
            query = ""
            error = ""
            errorLoc = ""
            getPage(0)
        }}
        >
        <option
            value="Default"
        >Default</option>
        {#each data.divisions as {name, divisionID}}
            <option
            value={divisionID}
            >{name}</option>
        {/each}
        </select>
    {/if}
</div>
