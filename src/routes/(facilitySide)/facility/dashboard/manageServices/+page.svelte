<script lang="ts">
  import Logo from '$lib/images/Logo.png';
  import type { ServiceDTO } from "$lib/server/DTOs";
  import type { PageProps } from "./$types";

  let { data, form }: PageProps = $props();

  let services: ServiceDTO[] = $state(data.services ?? [])
  let currentPage: number = $state(data.currentPage)
  let totalPages = $state(data.totalPages)

  // PopUps
  import DeleteServiceConfirm from "./DeleteServiceConfirm.svelte";
  import DeleteServiceRestricted from "./DeleteServiceRestricted.svelte";
  import AddService from './AddService.svelte';
  import EditService from './EditService.svelte';

  let selectedServiceType: String = $state('');
  let selectedServiceID: String = $state('');

  let currPopUp: String = $state("")

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
        dest = "./manageServices/searchServicesHandler"
      } else {
        body = JSON.stringify({ currPage: currentPage, change, maxPages: totalPages });
        dest = "./manageServices/servicePagingHandler"
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
        services = rv.services
        totalPages = rv.totalPages
        currentPage = rv.currentPage
      } else if (rv.description === "services"){
        error = rv.error
        errorLoc = "services"
        services = []
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

{#if currPopUp === "delete"}
  <DeleteServiceConfirm
    serviceID={selectedServiceID}
    serviceType={selectedServiceType}
    {form}
    bind:services={services}
    bind:currPopUp={currPopUp}
  />

{:else if currPopUp === "deleteRestricted"}
  <DeleteServiceRestricted
    bind:currPopUp={currPopUp}
  />

{:else if currPopUp === "addService"}
  <AddService 
    { data } 
    { form }
    bind:services={services}
    bind:currPopUp={currPopUp}
  />
{:else if currPopUp === "editService"}
  <EditService 
    { data } 
    { form }
    bind:services={services}
    bind:currPopUp={currPopUp}
    serviceType={selectedServiceType}
    serviceID={selectedServiceID}
  />
{/if}

<!-- Header -->
<header class="flex items-center justify-between p-3 border  border-transparent top-0 duration-200 sticky z-[10] px-6 bg-white ">
    <!-- Back Icon -->
  <div class="items-center flex gap-5">
    <a href="/facility/dashboard" data-sveltekit-reload>
      <img
        src="/back_icon.svg"
        alt="Back"
        class="w-6 h-6 cursor-pointer transition-colors duration-200 hover:opacity-70 active:opacity-50"
      />
    </a>

    <!-- Manage Services -->
    <h2 class="font-bold text-[27px] text-[#3D1853]">Manage Services</h2>
  </div>

  <!-- Medlink Logo -->
  <div class="flex items-center">
      <img src={Logo} alt="MedLink logo" class="w-10 h-13" />
      <h1 class="px-3 font-['DM_Sans'] text-[30px] leading-[40px] tracking-[-0.03em] font-black text-[#3D1853] drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">Med<span class="text-[#9044C4]">Link</span></h1>
  </div>
</header>

<div class="p-6 bg-gray-50 max-h-screen border">
    <!-- View and Search -->
    <div class="w-2/3 flex items-center gap-10">
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
      <h1>View By:</h1>

      <select class="px-4 py-0 border-2 border-gray-500 rounded-2xl h-10">
        <option>Default</option>
      </select>
    </div>

    <!-- Scrollable List Container -->
    <div class="space-y-3 mt-4 w-2/3 border  h-[calc(100vh-300px)] overflow-y-auto pr-8 pt-5">
      {#if errorLoc == "services"}
        {error}
      {/if}
      {#each services as  { type, serviceID, divisionID }}
        <div class="flex items-center justify-between p-3 bg-white rounded-[30px] shadow-[0px_4px_10px_rgba(0,0,0,0.3)] w-full">
          <!-- Left Side: Text Content -->
          <div>
            <h3 class="text-lg font-bold text-gray-900 px-4">{type}</h3>
            {#if divisionID}
              <p class="text-purple-600 px-4">Division: {divisionID}</p>
            {/if}
          </div>
        
          <!-- Right Side: Icons -->
          <div class="flex items-center space-x-3 pr-4">
            <button onclick={() => {currPopUp='editService', selectedServiceType=type, selectedServiceID=serviceID}} class="inline-flex items-center" data-sveltekit-reload>
              <img src="/edit_icon.svg" alt="Edit" class="w-6 h-6 cursor-pointer hover:opacity-80" />
            </button>

            <!-- Delete Button (Opens Modal) -->
            <button 
              type="button" 
              class="inline-flex items-center" 
              onclick={() => {selectedServiceID = serviceID,
                              selectedServiceType = type,
                              currPopUp = services.length > 1 ? 'delete' : 'deleteRestricted'}
                              } 
                data-sveltekit-reload
            >
              <img src="/trash_icon.svg" alt="Delete" class="w-6 h-6 cursor-pointer hover:opacity-80" />
            </button>

          </div>
        </div>
      {/each}
    </div>
    {#if form?.description === "pass"}
      <p class="text-red-500 text-sm font-semibold">{form?.error}</p>
    {/if}
    <div class="flex items-center justify-center gap-4 mt-4 w-2/3">
      <button type="button" class="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300" onclick={() => getPage(-1)}>⟨ Previous</button>
      <span class="font-medium">Page {currentPage} of {totalPages}</span>
      <button type="button" class="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300" onclick={() => getPage(1)}>Next ⟩</button>
    </div>

  <button type="button" class="fixed bottom-6 right-6 bg-purple-500 text-white px-6 py-3 rounded-full flex items-center space-x-2 shadow-lg" onclick={() => {currPopUp='addService'}}>
    <span class="text-xl">+ Add service</span>
  </button>
</div>



<style>
  ::-webkit-scrollbar {
  width: 10px !important;
  }

  ::-webkit-scrollbar-thumb {
  background: #9044C4 !important;
  border-radius: 10px !important;
  }

  ::-webkit-scrollbar-track {
  background: #DCDCDC !important;
  border-radius: 10px !important;
  }

  ::-webkit-scrollbar-thumb:hover {
  background: #6a3191 !important;
  }

</style>
