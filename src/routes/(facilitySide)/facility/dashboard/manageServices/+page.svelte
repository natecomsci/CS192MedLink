<script lang="ts">
  import Logo from '$lib/images/Logo.png';
  import type { PageProps } from "./$types";
  import type { ServiceDTO } from "$lib";

  // PopUps
  import DeleteServiceConfirm from "./DeleteServiceConfirm.svelte";
  import DeleteServiceRestricted from "./DeleteServiceRestricted.svelte";
  import AddService from './AddService.svelte';
  import EditService from './EditService.svelte';
  
  import { pagingQueryHandler } from '$lib/postHandlers';
  import { Role } from '@prisma/client';

  let { data, form }: PageProps = $props();

  let services: ServiceDTO[] = $state(data.services ?? [])
  let currentPage: number = $state(data.currentPage)
  let totalPages = $state(data.totalPages)

  let selectedServiceType: String = $state('');
  let selectedServiceID: String = $state('');

  let selectedDivisionID: String = $state('');
  let selectedDivisionName: String = $state('');

  let currPopUp: String = $state("")

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
      const rv = await pagingQueryHandler({page: "services", query, isInQueryMode, currentPage, change, totalPages, perPage, viewedDivisionID});
      error =  rv.error
      errorLoc =  rv.errorLoc

      if (errorLoc !== "query") {
        services =  rv.list
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

{#if currPopUp === "delete"}
  <DeleteServiceConfirm
    {form}
    {perPage}
    {viewedDivisionID}
    serviceID={selectedServiceID}
    serviceType={selectedServiceType}
    bind:services={services}
    bind:currPopUp={currPopUp}
    bind:currentPage={currentPage}
    bind:totalPages={totalPages}
  />

{:else if currPopUp === "deleteRestricted"}
  <DeleteServiceRestricted
    bind:currPopUp={currPopUp}
  />

{:else if currPopUp === "addService"}
  <AddService 
    { data } 
    { form }
    {perPage}
    {viewedDivisionID}
    bind:services={services}
    bind:currPopUp={currPopUp}
    bind:currentPage={currentPage}
    bind:totalPages={totalPages}
  />
{:else if currPopUp === "editService"}
  <EditService 
    { data } 
    { form }
    {perPage}
    {viewedDivisionID}
    bind:services={services}
    bind:currPopUp={currPopUp}
    serviceType={selectedServiceType}
    serviceID={selectedServiceID}
    serviceDivisionName={selectedDivisionID}
    serviceDivisionID={selectedDivisionName}
  />
{/if}

<!-- Header -->
<header class="flex items-center justify-between p-3 shadow-sm top-0 duration-200 sticky z-[10] px-6 bg-white ">
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

<div class="p-6 bg-gray-50 max-h-screen h-[calc(100vh-50px)]">
    <!-- View and Search -->
    <div class="w-2/3 flex items-center gap-10">
      <input
        type="text"
        placeholder="search"
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
      }}>
        Search
      </button>
      {#if errorLoc == "query"}
        {error}
      {/if}
      <h1>View By:</h1>

      <select 
        bind:value={viewedDivisionID} 
        class="px-4 py-0 border-2 border-gray-500 rounded-2xl h-10"
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

    <hr class="mt-4 border-gray-300 w-2/3">
    <!-- Scrollable List Container -->
    <div class="space-y-3 mt-4 w-2/3 pl-4 h-[calc(100vh-250px)] overflow-y-auto pr-8 pt-5">
      {#if errorLoc == "services"}
        {error}
      {/if}
      {#each services as  { type, serviceID, division }}
        <div class="flex items-center justify-between p-3 bg-white rounded-[30px] shadow-[0px_4px_10px_rgba(0,0,0,0.3)] w-full">
          <!-- Left Side: Text Content -->
          <div>
            <h3 class="text-lg font-bold text-gray-900 px-4">{type}</h3>
            {#if division?.name}
              <p class="text-purple-600 px-4">Division: {division?.name}</p>
            {/if}
          </div>
        
          <!-- Right Side: Icons -->
          <div class="flex items-center space-x-3 pr-4">
            <button onclick={() => {
              currPopUp='editService' 
              selectedServiceType=type
              selectedServiceID=serviceID
              selectedDivisionID=division?.divisionID ?? ''
              selectedDivisionName=division?.name ?? ''
            }} class="inline-flex items-center" data-sveltekit-reload>
              <img src="/edit_icon.svg" alt="Edit" class="w-6 h-6 cursor-pointer hover:opacity-80" />
            </button>

            <!-- Delete Button (Opens Modal) -->
            {#if data.role === Role.MANAGER}
            <button 
              type="button" 
              class="inline-flex items-center" 
              onclick={() => {selectedServiceID = serviceID,
                              selectedServiceType = type,
                              currPopUp = (services.length > 1 || totalPages !== 1) ? 'delete' : 'deleteRestricted'}
                              } 
                data-sveltekit-reload
            >
              <img src="/trash_icon.svg" alt="Delete" class="w-6 h-6 cursor-pointer hover:opacity-80" />
            </button>
            {/if}

          </div>
        </div>
      {/each}
    </div>
    {#if form?.description === "pass"}
      <p class="text-red-500 text-sm font-semibold">{form?.error}</p>
    {/if}


    <!-- PAGINATIONNNNNNN -->
    <div class="flex items-center justify-center gap-4 mt-4 w-2/3">
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
        <span class="bg-purple-400 p-2 w-8 h-8 hover:bg-purple-700 rounded-md text-white font-semibold flex items-center justify-center">{currentPage}</span>
        <span class="text-gray-700 font-medium">of {totalPages}</span>

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

  {#if data.role === Role.MANAGER}
  <button type="button" class="fixed bottom-6 right-6 bg-purple-500 text-white px-6 py-3 rounded-full flex items-center space-x-2 shadow-lg" onclick={() => {currPopUp='addService'}}>
    <span class="text-xl">+ Add service</span>
  </button>
  {/if}
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
