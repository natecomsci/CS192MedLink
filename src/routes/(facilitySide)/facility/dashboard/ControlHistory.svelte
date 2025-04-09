<script lang="ts">
  import type { PageProps } from "./$types";
  import { dateToTimeMapping } from "$lib/Mappings";
  import { pagingQueryHandler } from "$lib/postHandlers";

  let { data }: PageProps = $props();

  let updateLogs = $state(data.updateLogs)
  let currentPage = $state(data.currentPage)
  let totalPages = $state(data.totalPages)

  let query = $state('')

  let error = $state('')
  let errorLoc = $state('')

  let isInQueryMode = $state(false)

  let viewedDivisionID = $state("Default")

  // ===================================
  let perPage = $state(10);
  let options = [10, 20, 50];

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

<div class=" h-full p-4 flex flex-col">
  <!-- Sticky Header -->
  <div class="border-b border-[#DBD8DF] flex items-center pl-2 pb-2 sticky bg-white z-10">

    <span class=" text-[30px] font-bold text-lg text-[#9044C4] whitespace-nowrap pr-4">
      Control History
    </span>

    <div class=" flex items-center gap-3 flex-grow">
      <!-- Increased width for better alignment -->

      <input
        type="text"
        placeholder="Search"
        bind:value={query}
        onkeydown={handleKeydown}
        class="px-4 py-0 border-2 border-gray-500 rounded-3xl h-10 w-full max-w-[500px]"
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
          Clear
        </button>
      {/if}
      <button onclick={() => {
        isInQueryMode = true
        currentPage = 1
        getPage(0)
        }}
        class="border-black"
      >
        Search
      </button>
      {#if errorLoc == "query"}
        {error}
      {/if}
      <!-- Ensures "View By:" stays in one line -->
      <span class="whitespace-nowrap">View By:</span>

      <select 
        bind:value={viewedDivisionID} 
        class="p-4 py-0 border-2 border-gray-500 rounded-3xl h-10"
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
    </div>

  </div>

  <!-- Scrollable List -->
  <div class="flex-1 overflow-y-auto p-4 ">
    {#if errorLoc == "logs"}
      {error}
    {/if}
    {#each updateLogs as { role, entity, action, employee, createdAt }}
      <!-- history item -->
    <div class="py-2 -b mb-4 ">
        <div class="history-item justify-between  -green-200">
          <div class ='flex items-center'>
            <!-- Profile Placeholder -->
            <!-- <div class="profile-circle"></div> -->
        
            <!-- Left Content: Admin & Message -->
            <div class="info">
              <span class="message">{
                String(action).charAt(0).toUpperCase() + String(action).toLowerCase().slice(1) + "d"

              } {entity}</span>
              <span class="admin"> {employee.fname} {employee.lname}</span>
            </div>
          </div>
        
          <!-- Right Content: Timestamp & Department -->
          <div class="details ">
            <span class="timestamp">Updated at {dateToTimeMapping(new Date(createdAt))}</span>
            <!-- <span class="department">{department}</span> -->
          </div>
      </div>
    </div>
    {/each}
  </div>

  
<!-- PAGINATIONNNNNNN -->
<div class="flex items-center mx-auto justify-center gap-4 mt-4 w-2/3">
  <div class="flex items-center space-x-2">
    <!-- Double Left-->
    <button class="bg-gray-200 p-2 w-8 h-8 hover:bg-gray-300 rounded-md text-gray-700 flex items-center justify-center">« </button>

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
    <button class="bg-gray-200 p-2 w-8 h-8 hover:bg-gray-300 rounded-md text-gray-700 flex items-center justify-center" >»</button>

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

  /*.profile-circle {
    width: 63px;
    height: 63px;
    background: #d9d9d9;
    -radius: 50%;
    flex-shrink: 0;
  }*/

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

  /*.department {
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    font-size: 20px;
    color: #9044C4;
    letter-spacing: -0.02em;
  }*/
</style>