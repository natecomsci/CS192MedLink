<script lang="ts">
  import type { ActionData, PageData } from './$types';
  import { enhance } from '$app/forms';
      
  import AmbulanceService from './AddAmbulanceService.svelte';
  import BloodBankService from './AddBloodBankService.svelte';
  import ERService from './AddERService.svelte';
  import ICUService from './AddICUService.svelte';
  import OutpatientService from './AddOutpatientService.svelte';

  import type { ServiceDTO } from '$lib';
  import { pagingQueryHandler } from '$lib/postHandlers';

  let { data,
        form, 
        currPopUp = $bindable(), 
        services = $bindable(),
        currentPage = $bindable(),
        totalPages = $bindable(),
        perPage,
        viewedDivisionID
      }:{ data: PageData,
          form: ActionData, 
          currPopUp: String, 
          services: ServiceDTO[],
          currentPage: number,
          totalPages: number,
          perPage:number,
          viewedDivisionID:string
        } = $props();

  let serviceType: String = $state(["Ambulance", "Blood Bank", "Emergency Room", "Intensive Care Unit"].includes(String(data.availableServices[0])) ? String(data.availableServices[0]) : "Outpatient");

  let selectedDivisionID = $state("")
  let selectedDivisionName = $state("")

  async function getNewService() {
    try {
      const rv = await pagingQueryHandler({
        page: 'services',
        query: '',
        isInQueryMode:false,
        currentPage:1,
        change:0,
        totalPages:1,
        perPage,
        viewedDivisionID
      });
      services =  rv.list
      currentPage = 1
      totalPages = rv.totalPages
    } catch (error) {
      console.log((error as Error).message)
    }
  }
</script>
 
<div class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
  <div class=" w-11/12 max-w-3/4 rounded-lg  overflow-hidden ">
    <form 
      method="POST"
      action="?/addService"
      use:enhance={() => {
        return async ({ update }) => {
          await update({invalidateAll:true});
          if (form?.success) {
              currPopUp = ''
              getNewService()
          }
        };
      }}
      class="grid grid-cols-1 bg-white m-6 space-y-2 rounded-2xl p-2 shadow drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
    >
      <div class="h-[calc(100vh-100px)] flex bg-gray-100 rounded-2xl">

        <!-- Left Panel -->
        <div class="w-1/3 bg-white p-6 flex flex-col ">
            <div class="flex items-center gap-5">
                <button onclick={() => currPopUp = ''} type="button">
                  <img src="/back_icon.svg" alt="Back" class="w-6 h-6 cursor-pointer transition-colors duration-200 hover:opacity-70 active:opacity-50"/>
                </button>
                <h1 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900">Add a Service</h1>
            </div>

            <label class="mt-5">
              <span class="text-label">Select a Service</span>
              <select name="serviceType" bind:value={serviceType} required class="border-2 border-[#D9D9D9] p-2 rounded w-full">
                {#each (data.availableServices ?? []) as service}
                  <option value={service} onclick={() => serviceType = service}>{service}</option>
                {/each}
              </select>
            </label>

            <button type="submit" class="mt-auto bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700" data-sveltekit-reload>
                Add Service
            </button>
        </div>

        <!-- Vertical Divider -->
        <div class="w-[2px] bg-gray-300"></div>

        <!-- Right Panel -->
        <div class="flex-1 p-6 overflow-y-auto  "> 
          <h2 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900">{serviceType}</h2>
          <label class="grid grid-cols-1">
            {#if form?.error}
                <p class="error">{form.error}</p>
            {/if}
            {#if serviceType == "Ambulance"}
              <AmbulanceService />
            {:else if serviceType == "Blood Bank"}
              <BloodBankService/>
            {:else if serviceType == "Emergency Room"}
              <ERService />
            {:else if serviceType == "Intensive Care Unit"}
              <ICUService />
            {:else if serviceType == "Outpatient"}
              <OutpatientService {data} {form}/>
            {/if}
          </label>
          
          <input type="text" class="hidden" name="divisionID" bind:value={selectedDivisionID} />
          <input type="text" class="hidden" name="divisionName" bind:value={selectedDivisionName} />

          {#if data.hasDivisions}
            <label>
              Divisions
              {#each (data.divisions ?? []) as division}
              {division.name}
                <input 
                  type="radio" 
                  name="divSelect" 
                  onclick={() => {
                    selectedDivisionID = division.divisionID
                    selectedDivisionName = division.name
                  }}
                  class="input-box w-30"
                >
              {/each}
            </label>
          {/if}
        </div>
      </div>
    </form>
  </div>
</div>
