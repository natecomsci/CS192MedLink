<script lang="ts">
  import type { PageProps } from "./$types";
  import { dateToTimeMapping } from "$lib/Mappings";

  let admin = "Admin 1";

  let { data }: PageProps = $props();

  let services = $state(data.services)
  let currentPage = $state(data.currentPage)
  let totalPages = data.totalPages

  async function getPage(currPage: number, change: number, maxPages: number) {
    console.log(currPage, change, maxPages)
    const body = JSON.stringify({currPage, change, maxPages});

    try {
      const response = await fetch("./dashboard/manageServices/facilityHandler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      services = await response.json();
      currentPage = (currentPage + change)
      
    } catch (error) {
      throw new Error(`Response status: ${error}`);
    }
  }

</script>
  <div class="h-full flex flex-col">
    <!-- Sticky Header -->
    <div class="flex items-center justify-between text-[30px] pl-4 pr-4 text-[#9044C4] font-bold text-lg border-b border-[#DBD8DF] sticky bg-white z-10">
      Control History
      <div class=text-[20px]>
        Searchbar 
        View
      </div>
    </div>

    <!-- Scrollable List -->
    <div class="flex-1 overflow-y-auto p-4">
      {#each services as { type, updatedAt }}
        <!-- history item -->
      <div class="py-2 border-b border-transparent">
          <div class="history-item justify-between">
            <div class ='flex space-x-5 items-center'>
              <!-- Profile Placeholder -->
              <div class="profile-circle"></div>
          
              <!-- Left Content: Admin & Message -->
              <div class="info">
                <span class="admin">{admin}</span>
                <span class="message">Updated {type} Information</span>
              </div>
            </div>
          
            <!-- Right Content: Timestamp & Department -->
            <div class="details">
              <span class="timestamp">Updated at {dateToTimeMapping(new Date(updatedAt))}</span>
              <!-- <span class="department">{department}</span> -->
            </div>
        </div>
      </div>
      {/each}
    </div>

    <!-- Pagination -->

    <div class="p-4 border-t border-[#DBD8DF] flex justify-between items-center">
      <button type="button" class="p-2 bg-purple-300 rounded" onclick={() => currentPage > 1 ? getPage(currentPage, -1, totalPages) : ''}>« Prev</button>
      <span class="text-purple-700 font-semibold">{currentPage} of {totalPages}</span>
      <button type="button" class="p-2 bg-purple-300 rounded" onclick={() => currentPage < totalPages ? getPage(currentPage, 1, totalPages): ''}>Next »</button>
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
    border-radius: 50%;
    flex-shrink: 0;
  }

  .info {
    display: flex;
    flex-direction: column;
    padding-top: 11px;
    width: 300px;
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
    padding-top: 11px;
    width: 179px;
    text-align: right;
  }

  .timestamp {
    font-family: 'DM Sans', sans-serif;
    font-style: italic;
    font-weight: 500;
    font-size: 20px;
    color: #565656;
    letter-spacing: -0.02em;
  }

  /*.department {
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    font-size: 20px;
    color: #9044C4;
    letter-spacing: -0.02em;
  }*/
</style>