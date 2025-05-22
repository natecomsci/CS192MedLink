<script lang="ts">
  import Logo from '$lib/images/Logo.png';
  import type { PageProps } from "./$types";
  import type { ServiceDTO } from "$lib";

  // PopUps
  import DeleteServiceConfirm from "./DeleteServiceConfirm.svelte";
  import DeleteServiceRestricted from "./DeleteServiceRestricted.svelte";
  import AddService from './AddService.svelte';
  import EditService from './EditService.svelte';

  import PageBar from "$lib/facilityComponents/PageBar.svelte";
  import SearchViewBar from '$lib/facilityComponents/SearchViewBar.svelte';
  import ManageHeader from '$lib/facilityComponents/ManageHeader.svelte';
  import NoDatabaseConnection from '$lib/facilityComponents/NoDatabaseConnection.svelte';
  
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

  // elle

  if (form?.error === "No database connection.") {
  currPopUp = "NoDatabaseConnection";
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
    serviceDivisionName={selectedDivisionName}
    serviceDivisionID={selectedDivisionID}
  />
  {:else if currPopUp === "NoDatabaseConnection"}
    <NoDatabaseConnection
     
    />
{/if}

<!-- Header -->
<ManageHeader manage ="Services" />

<div class="p-6 bg-gray-50 max-h-screen h-[calc(100vh-50px)]">
    <!-- View and Search -->
    <SearchViewBar
      bind:query
      bind:viewedDivisionID
      bind:error
      bind:errorLoc
      bind:isInQueryMode
      bind:currentPage
      {data}
      {getPage}
    />

    <hr class="mt-4 border-gray-300 w-2/3">
    <!-- Scrollable List Container -->
    <div class="space-y-3 mt-4  w-2/3 p-4 h-[calc(100vh-250px)] overflow-y-auto pr-8 pt-5">
      {#if errorLoc == "services"}
        {error}
      {/if}
      {#each services as  { type, serviceID, division }}
        <div class="flex items-center justify-between p-3 bg-background rounded-[30px] shadow-[0px_4px_10px_rgba(0,0,0,0.3)] w-full">
          <!-- Left Side: Text Content -->
          <div>
            <h3 class="text-lg font-bold text-gray-900 px-4">{type}</h3>
            {#if division?.name}
              <p class="text-primary-500 font-semibold italic text-lg px-4">{division?.name}</p>
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
                              currPopUp = (services.length <= 1 && totalPages === 1) ? 'deleteRestricted' : 'delete'}
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
      <p class="error text-red-500 text-sm font-semibold">{form?.error}</p>
    {/if}

  <PageBar
    bind:currentPage={currentPage} 
    bind:totalPages={totalPages} 
    bind:perPage={perPage} 
    getPage={getPage}
  />

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
  background: #bcb6c0 !important;
  }

</style>
