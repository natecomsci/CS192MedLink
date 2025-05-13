<script lang="ts">
  import type { PageProps } from "./$types";
  import { dateToTimeMapping } from "$lib/Mappings";
  import { pagingQueryHandler } from "$lib/postHandlers";

  import PageBar from "$lib/facilityComponents/PageBar.svelte";

  let { data }: PageProps = $props();

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

<div class="h-full p-4 flex flex-col ">
  <!-- Sticky Header -->
  <div class="flex items-center pl-2 sticky  z-10">
    <span class=" text-dashboard-header whitespace-nowrap pr-4">
      Control History
    </span>
  
    <div class=" flex items-center gap-3 flex-grow ">
      <!-- Search -->
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
      {#if data.hasDivisions && data.divisions.length > 1}
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

  </div>

  <hr class="mt-4 border-gray-300"> <!-- Line -->   

  <!-- Scrollable List -->
  <div class="flex-1 overflow-y-auto p-4">
    {#if errorLoc == "logs"}
      {error}
    {/if}
    {#each updateLogs as { entity, action, employee, createdAt }}
      <!-- history item -->
      <div class="history-item justify-between py-2 -b mb-4">
        <!-- Left Content: Admin & Message -->
        <div class ='flex items-center'>        
          <div class="info">
            <span class="message">{String(action).charAt(0).toUpperCase() + String(action).toLowerCase().slice(1) + "d"} {entity}</span>
            <span class="admin">  {employee.fname} {employee.lname}</span>
          </div>
        </div>
      
        <!-- Right Content: Timestamp & Department -->
        <div class="details ">
          <span class="timestamp">Updated at {dateToTimeMapping(new Date(createdAt))}</span>
          <!-- <span class="department">{department}</span> -->
        </div>
      </div>
    {/each}
  </div>

  <PageBar
    bind:currentPage={currentPage} 
    bind:totalPages={totalPages} 
    bind:perPage={perPage} 
    getPage={getPage}
  />
</div>

<style>
  .history-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: full;
    height: 60px;
    padding: 0;
  }

  .info {
    display: flex;
    flex-direction: column;
    padding-top: 0px;
    width:px;
  }

  .message {
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    font-size: 20px;
    color: #9044C4;
    letter-spacing: -0.02em;
  }

  .admin {
    font-family: 'DM Sans', sans-serif;
    font-style: italic;
    font-weight: 600;
    font-size: 20px;
    color: #565656;
    letter-spacing: -0.02em;
  }

  .details {
    display: flex;
    flex-direction: column;
    padding-top: 0px;
    width: 179px;
    text-align: right;
  }

  .timestamp {
    font-family: 'DM Sans', sans-serif;
    font-style: italic;
    font-weight: 500;
    font-size: 20px;
    color: #6d6666;
    letter-spacing: 0.01em;
  }
</style>