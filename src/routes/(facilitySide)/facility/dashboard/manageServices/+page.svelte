<script lang="ts">
  import Logo from '$lib/images/Logo.png';
  import type { ServiceDTO } from "$lib/server/DTOs";
  import type { PageProps } from "./$types";

  import { specializedServiceType } from "$lib/projectArrays";
  let { data, form }: PageProps = $props();

  let services: ServiceDTO[] = $state(data.services ?? [])
  let currentPage: number = $state(data.currentPage)
  let totalPages = data.totalPages

  // PopUps
  import DeleteServiceConfirm from "./DeleteServiceConfirm.svelte";
  import DeleteServiceRestricted from "./DeleteServiceRestricted.svelte";
  import AddService from './AddService.svelte';
  import EditService from './EditService.svelte';

  let selectedServiceType: String = $state('');
  let selectedServiceID: String = $state('');

  let currPopUp: String = $state("")

  let search: String = $state("");

  async function getPage(currPage: number, change: number, maxPages: number) {
    if ((currPage === 1 && change === -1) || (currPage === maxPages && change === 1)) {
      return
    } 

    const body = JSON.stringify({currPage, change});

    try {
      const response = await fetch("./manageServices/facilityHandler", {
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

{#if data.success}
    {currPopUp = ""}
  {/if}

{#if currPopUp === "delete"}
  <DeleteServiceConfirm
    serviceID={selectedServiceID}
    serviceType={selectedServiceType}
    {form}
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
    bind:currPopUp={currPopUp}
  />
{:else if currPopUp === "editService"}
  <EditService 
    { data } 
    { form }
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
        placeholder="Search"
        class="px-4 py-0 border-2 border-gray-500 rounded-2xl h-10 w-2/3"
      />
      <h1>View By:</h1>

      <select class="px-4 py-0 border-2 border-gray-500 rounded-2xl h-10">
        <option>Default</option>
      </select>
    </div>

    <!-- Scrollable List Container -->
    <div class="space-y-3 mt-4 w-2/3 border  h-[calc(100vh-300px)] overflow-y-auto pr-8 pt-5">
      {#each services as  { type, serviceID }}
        <div class="flex items-center justify-between p-3 bg-white rounded-[30px] shadow-[0px_4px_10px_rgba(0,0,0,0.3)] w-full">
          <!-- Left Side: Text Content -->
          <div>
            <h3 class="text-lg font-bold text-gray-900 px-4">{type}</h3>
            <p class="text-purple-600 px-4">Insert Division Here</p>
          </div>
        
          <!-- Right Side: Icons -->
          <div class="flex items-center space-x-3 pr-4">

            <!-- edit button -->
            <a href={'./manageServices/' + serviceTypeURL(type) + '/' + serviceID} class="inline-flex items-center" data-sveltekit-reload>
              <img src="/edit_icon.svg" alt="Edit" class="w-6 h-6 cursor-pointer hover:opacity-80" />
            </a> -->

            <!-- edit button -->
            <button onclick={() => {currPopUp='editService', currService=type}} class="inline-flex items-center" data-sveltekit-reload>
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
      <button type="button" class="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300" onclick={() => currentPage > 1 ? getPage(currentPage, -1, totalPages) : ''}>⟨ Previous</button>
      <span class="font-medium">Page {currentPage} of {totalPages}</span>
      <button type="button" class="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300" onclick={() => currentPage < totalPages ? getPage(currentPage, 1, totalPages): ''}>Next ⟩</button>
    </div>

  <button type="button" class="fixed bottom-6 right-6 bg-purple-500 text-white px-6 py-3 rounded-full flex items-center space-x-2 shadow-lg" onclick={() => {currPopUp='addService'}}>
    <span class="text-xl">+</span>
    Add service
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
