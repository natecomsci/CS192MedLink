<script lang="ts">
  import type { PageProps } from "./$types";
  import { dateToTimeMapping } from "$lib/Mappings";

  let { data }: PageProps = $props();

  let updateLogs = $state(data.updateLogs)
  let currentPage = $state(data.currentPage)
  let totalPages = $state(data.totalPages)

  let query = $state('')

  let error = $state('')
  let errorLoc = $state('')

  let queryMode = $state(false)

  async function getPage(change: number) {
    let body;
    let dest;

    try {

      if (queryMode) {
        body = JSON.stringify({ query, currPage: currentPage, change, maxPages: totalPages });
        dest = "./dashboard/searchControlHistoryHandler"
      } else {
        body = JSON.stringify({ currPage: currentPage, change, maxPages: totalPages });
        dest = "./dashboard"
      }

      const response = await fetch(dest, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const rv = await response.json();

      if (rv.success) {
        error = ''
        errorLoc = ''
        updateLogs = rv.updateLogs
        totalPages = rv.totalPages
        currentPage = rv.currentPage
      } else if (rv.description === "logs"){
        error = rv.error
        errorLoc = "logs"
        updateLogs = []
        totalPages = 1
        currentPage = 1
      } else {
        error = rv.error
        errorLoc = "query"
      }
      
    } catch (error) {
      throw new Error(`Response status: ${error}`);
    }
  }

</script>
  <div class="h-full flex flex-col">
  <!-- Sticky Header -->
  <div class="flex items-center  border-green-400 pl-4 sticky bg-white z-10">

    <span class=" text-[30px] font-bold text-lg text-[#9044C4] whitespace-nowrap pr-4">
      Control History
    </span>

    <div class=" flex items-center gap-3 flex-grow">
      <!-- Increased width for better alignment -->

      <input
        type="text"
        placeholder="search"
        bind:value={query}
        class="px-4 py-0 border-2 border-gray-500 rounded-3xl h-10 w-full max-w-[500px]"
      />
      {#if query.length > 0}
        <button onclick={() => {
          query = ""
          error = ""
          errorLoc = ""
          queryMode = false
          currentPage = 1
          getPage(0)
        }}>
          x
        </button>
      {/if}
      <button onclick={() => {
        queryMode = true
        currentPage = 1
        getPage(0)
      }}>
        Search
      </button>
      {#if errorLoc == "query"}
        {error}
      {/if}
      <!-- Ensures "View By:" stays in one line -->
      <span class="whitespace-nowrap">View By:</span>

      <select class="p-4 py-0 border-2 border-gray-500 rounded-3xl h-10">
        <option>Default</option>
      </select>
    </div>

  </div>

  <!-- Scrollable List -->
  <div class="flex-1 overflow-y-auto p-4 ">
    {#if errorLoc == "logs"}
      {error}
    {/if}
    {#each updateLogs as { entity, action, employeeID, createdAt }}
      <!-- history item -->
    <div class="py-2 -b mb-4 ">
        <div class="history-item justify-between  -green-200">
          <div class ='flex items-center'>
            <!-- Profile Placeholder -->
            <!-- <div class="profile-circle"></div> -->
        
            <!-- Left Content: Admin & Message -->
            <div class="info">
              <span class="admin">Admin {employeeID}</span>
              <span class="message">{action} {entity}</span>
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

  <!-- Pagination -->

  <div class="p-4 -t -[#DBD8DF] flex justify-between items-center">
    <button type="button" class="p-2 bg-purple-300 rounded" onclick={() => getPage(-1)}>« Prev</button>
    <span class="text-purple-700 font-semibold">{currentPage} of {totalPages}</span>
    <button type="button" class="p-2 bg-purple-300 rounded" onclick={() => getPage(1)}>Next »</button>
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

  .profile-circle {
    width: 63px;
    height: 63px;
    background: #d9d9d9;
    -radius: 50%;
    flex-shrink: 0;
  }

  .info {
    display: flex;
    flex-direction: column;
    padding-top: 0px;
    width:px;
  }

  .admin {
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    font-size: 20px;
    color: #9044C4;
    letter-spacing: -0.02em;
  }

  .message {
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