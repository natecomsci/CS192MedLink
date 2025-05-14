<script lang="ts">
  import { type ServiceDTO } from '$lib';
  import { OPServiceTypes } from '$lib/projectArrays';
  import type { PageData, ActionData } from './$types';
  import { enhance } from '$app/forms';

  import { pagingQueryHandler } from '$lib/postHandlers';

  import EditAmbulanceService from './EditAmbulanceService.svelte';
  import EditBloodBankService from './EditBloodBankService.svelte';
  import EditERService from './EditERService.svelte';
  import EditICUService from './EditICUService.svelte';
  import EditOPService from './EditOPService.svelte';
    import { Role } from '@prisma/client';

  let { data, 
        form, 
        serviceType, 
        serviceID, 
        currPopUp = $bindable(), 
        services = $bindable(),
        serviceDivisionName = $bindable(),
        serviceDivisionID = $bindable(),
        perPage,
        viewedDivisionID
      }:{ data: PageData, 
          form: ActionData, 
          serviceType: String, 
          serviceID: String, 
          currPopUp: String, 
          services: ServiceDTO[],
          serviceDivisionName: String,
          serviceDivisionID: String,
          perPage:number,
          viewedDivisionID:string
        } = $props();

  let selectedDivisionName: String = $state(serviceDivisionName)
  let selectedDivisionID: String = $state(serviceDivisionID)

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
    } catch (error) {
      console.log((error as Error).message)
    }
  }

</script>
<div class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
  <div class=" w-11/12 max-w-3/4 rounded-lg  overflow-hidden ">
    <div class="grid grid-cols-1 bg-background m-6 space-y-2 rounded-2xl p-0 shadow drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">

      <form method="POST" 
        id="editService"
        action="?/editService"
        use:enhance={() => {
          return async ({ update }) => {
            await update({invalidateAll:true});
            if (form?.success) {
              currPopUp = ''
              getNewService()
            }
          };
        }}
      >
        <div class="h-[calc(100vh-100px)] flex bg-gray-100 rounded-2xl">
          <!-- Left Panel -->
          <div class="w-1/3 bg-background p-6 flex flex-col rounded-l-2xl">
              <div class="flex items-center gap-5">
                  <button onclick={() => currPopUp = ''} data-sveltekit-reload type="button">
                    <img src="/back_icon.svg" alt="Back" class="w-6 h-6 cursor-pointer transition-colors duration-200 hover:opacity-70 active:opacity-50"/>
                  </button>
                  <h1 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900">Edit Service</h1>
              </div>

              <div class=" pt-10">
                  <h1 class=" text-[25px] font-['DM_Sans'] font-bold text-black">{serviceType}</h1>
                  <!-- <h3 class="text-[20px] font-['DM_Sans'] font-bold text-purple-500">Division Name</h3> -->
              </div>

              {#if data.hasDivisions && data.role == Role.MANAGER}
              <input type="text" class="hidden" name="divisionName" bind:value={selectedDivisionName} />
              <label class="mt-5">
                <span class="text-label">Division</span>
                <select name="divisionID" bind:value={selectedDivisionID} required class="input-box">
                    {#each (data.divisions ?? []) as division}
                      <option 
                        value={division.divisionID}
                        onclick={() => {
                          selectedDivisionName = division.name
                        }}
                      >{division.name}</option>
                    {/each}
                </select>
              </label>
              {/if}

              <!-- <input type="text" class="hidden" name="divisionID" bind:value={selectedDivisionID} />
              <input type="text" class="hidden" name="divisionName" bind:value={selectedDivisionName} /> -->

              <!-- {#if data.hasDivisions && data.role == Role.MANAGER}
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
                      checked={selectedDivisionID === division.divisionID}
                      class="input-box w-30"
                    >
                  {/each}
                </label>
              {/if} -->


              <button form="editService" type="submit" class="mt-auto bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700" data-sveltekit-reload>
                  Edit Service
              </button>
          </div>

          <!-- Vertical Divider -->
          <div class="w-[2px] bg-gray-300"></div>

          <!-- Right Panel -->
          <div class="flex-1 p-6 overflow-y-auto  "> 
            <h2 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900">{serviceType}</h2>
            <label class="grid grid-cols-1">
              <input type="text" class="hidden" name="serviceType" bind:value={serviceType} />
              {#if serviceType == "Ambulance"}
                <EditAmbulanceService 
                  { data }
                  { form }
                  { serviceID }
                />
              {:else if serviceType == "Blood Bank"}
                <EditBloodBankService
                  { data }
                  { form }
                  { serviceID }
                />
              {:else if serviceType == "Emergency Room"}
                <EditERService
                  { data }
                  { form }
                  { serviceID }
                />
              {:else if serviceType == "Intensive Care Unit"}
                <EditICUService
                  { data }
                  { form }
                  { serviceID }
                />
              {:else if OPServiceTypes.includes(String(serviceType))}
                <EditOPService
                  { data }
                  { form }
                  { serviceType }
                  { serviceID }
                />
              {/if}

            </label>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
