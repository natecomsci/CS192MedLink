<script lang="ts">
  import Logo from '$lib/images/Logo.png';
  import type { PageProps } from "./$types";

  import type { DivisionDTO } from '$lib';
  
  // PopUps
  import DeleteDivisionConfirm from "./DeleteDivisionConfirm.svelte";
  import DeleteDivisionRestricted from "./DeleteDivisionRestricted.svelte";
  import AddDivision from './ElleAddDivision.svelte';
  import EditDivision from './EditDivision.svelte';
  import { pagingQueryHandler } from '$lib/postHandlers';

  import PageBar from "$lib/facilityComponents/PageBar.svelte";
  import SearchViewBar from '$lib/facilityComponents/SearchViewBar.svelte';
  import ManageHeader from '$lib/facilityComponents/ManageHeader.svelte';

  let { data, form }: PageProps = $props();

  let divisions: DivisionDTO[] = $state(data.divisions ?? [])
  let currentPage: number = $state(data.currentPage)
  let totalPages = $state(data.totalPages)

  let linkableServices = $state(data.linkableServices)

  let selectedDivisionID: String = $state('');

  let currPopUp: String = $state("")

  let query = $state('')
  let viewedDivisionID = $state("Default")
  let error = $state('')
  let errorLoc = $state('')

  let isInQueryMode = $state(false)

  // ===================================
  let perPage = $state(10);

  async function getPage(change: number) {
    try {
      const rv = await pagingQueryHandler({page: "divisions", query, isInQueryMode, currentPage, change, totalPages, perPage, viewedDivisionID:"Default"});
      error =  rv.error
      errorLoc =  rv.errorLoc

      if (errorLoc !== "query") {
        divisions =  rv.list
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

  let divisionNameSelected: string = $state("");
</script>

{#if currPopUp === "delete"}
  <DeleteDivisionConfirm
    { data }
    { form }
    {perPage}
    bind:divisions={divisions}
    bind:currPopUp={currPopUp}
    bind:currentPage={currentPage}
    bind:totalPages={totalPages}
    divisionID={String(selectedDivisionID)}
    divisionName={divisionNameSelected}

  />

{:else if currPopUp === "deleteRestricted"}
  <DeleteDivisionRestricted
    bind:currPopUp={currPopUp}
  />

{:else if currPopUp === "addDivision"}
  <AddDivision 
    { data }
    { form }
    { perPage }
    bind:divisions={divisions}
    bind:linkableServices={linkableServices}
    bind:currPopUp={currPopUp}
    bind:currentPage={currentPage}
    bind:totalPages={totalPages}
  />
{:else if currPopUp === "editDivision"}
  <EditDivision 
    { form }
    { perPage }
    bind:currPopUp={currPopUp}
    bind:divisions={divisions}
    bind:currentPage={currentPage}
    bind:totalPages={totalPages}
    divisionID={selectedDivisionID}
  />
{/if}

<!-- Header -->
<ManageHeader
  manage ="Divisions" 
/>

<div class="p-6 bg-gray-50 h-[calc(100vh-50px)]">
    <div class="w-3/4">
      <SearchViewBar
        withfilter={false}
        bind:query
        bind:viewedDivisionID
        bind:errorLoc
        bind:isInQueryMode
        bind:currentPage
        {data}
        {getPage}
      />
    </div>
    <hr class="mt-4 border-gray-300 w-2/3">
    
    <!-- Scrollable List Container -->
    <div class="space-y-3 mt-4 w-2/3 p-4 h-[calc(100vh-250px)] overflow-y-auto pr-8 pt-5">
      {#if errorLoc == "division"}
        {error}
      {/if}
        {#each divisions as { name, divisionID }}
        <div class="flex items-center justify-between p-3 bg-background rounded-[30px] shadow-[0px_4px_10px_rgba(0,0,0,0.3)] w-full">
          <div>
            <h3 class="text-lg font-bold text-gray-900 px-4">{name}</h3>
            <p class="text-purple-600 px-4"></p>
          </div>
        
          <div class="flex items-center space-x-3 pr-4">
            <!-- Edit Button -->
            <button 
              type="button"
              onclick={() => {
                currPopUp='editDivision'
                selectedDivisionID=divisionID
              }} 
              class="inline-flex items-center" data-sveltekit-reload
            >
            <img src="/edit_icon.svg" alt="Edit" class="w-6 h-6 cursor-pointer hover:opacity-80" />
            </button>

            <button 
              type="button" 
              class="inline-flex items-center" 
              onclick={() => {
                currPopUp = divisions.length > 1 ? 'delete' : 'deleteRestricted'
                selectedDivisionID=divisionID
                divisionNameSelected=name
              }} 
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
  
  <div class="w-2/3 items-center justify-center mt-4">
    <PageBar
      bind:currentPage={currentPage}
      bind:totalPages={totalPages}
      bind:perPage={perPage}
      getPage={getPage}
    />
</div>

  <!-- Add Division -->
  <button type="button" class="fixed bottom-6 right-6 bg-purple-500 text-white px-6 py-3 rounded-full flex items-center space-x-2 shadow-lg" onclick={() => {
    currPopUp='addDivision' 
    console.log(currPopUp)
  }
}>
    <span class="text-xl">+ Add Division</span>
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
