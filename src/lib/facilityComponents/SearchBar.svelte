<script lang="ts">
    import { pagingQueryHandler } from "$lib/postHandlers";

    let { data } = $props();

    let updateLogs = $state(data.updateLogs)
    let currentPage = $state(data.currentPage)
    let totalPages = $state(data.totalPages)

    let query = $state('')

    let error = $state('')
    let errorLoc = $state('')

    let isInQueryMode = $state(false)

    let viewedDivisionID = $state("Default")

    let perPage = $state(10);

    async function getPage(change: number) {
        try {
            const rv = await pagingQueryHandler({page: "logs", query, isInQueryMode, currentPage, change, totalPages, perPage, viewedDivisionID});
            error =  rv.error
            errorLoc =  rv.errorLoc

            if (errorLoc !== "query") {
            updateLogs =  rv.list
            totalPages =  rv.totalPages
            currentPage =  rv.currentPage
            
            }
        } catch (error) {
            console.log(error)
        }
    }

    function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter")
        {
            isInQueryMode = true
            currentPage = 1
            getPage(0)
        }
    }
</script>
     
     <!-- Search -->
      <div class="relative flex items-center gap-2 pl-2 rounded-full border border-gray-300 bg-white shadow-sm flex-grow">
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
