<script lang="ts">
  import type { ActionData, PageData } from './$types';
  import { enhance } from '$app/forms';

  import type { DivisionDTO, MultiServiceDivisionsDTO } from '$lib';

  import AmbulanceService from './AddAmbulanceService.svelte';
  import BloodBankService from './AddBloodBankService.svelte';
  import ERService from './AddERService.svelte';
  import ICUService from './AddICUService.svelte';
  import OutpatientService from './AddOutpatientService.svelte';

  let { data, form, currPopUp = $bindable(), divisions = $bindable(), linkableServices = $bindable() }: { data:PageData, form: ActionData, currPopUp: String, divisions:DivisionDTO[], linkableServices: MultiServiceDivisionsDTO[] } = $props();

  let selectedLinkableServices: Record<string, string[]> = {};

  for (var { divisionID } of linkableServices) {
    selectedLinkableServices[divisionID] = []
  }

  let currNewServices: number = $state(0);
  let serviceType = $state('');

  let showDropdown = $state(false)

  async function getLinkableServices() {
    const body = JSON.stringify({});

    try {
      const response = await fetch("./manageDivisions/getLinkableServicesHandler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const multiServiceDivisions = await response.json();
      
    } catch (error) {
      throw new Error(`Response status: ${error}`);
    }
  }
  getLinkableServices()

</script>
 
<div class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
  <div class="max-w-3/4 rounded-lg  overflow-hidden ">
    <form 
      method="POST" 
      action="?/addDivision"
      use:enhance
      class="grid grid-cols-1 bg-white m-6 space-y-2 rounded-2xl p-2 shadow drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
    >
      <div class="h-[calc(100vh-100px)] flex bg-gray-100 rounded-2xl">

        <div class=" bg-white p-6 flex flex-col gap-3 overflow-y-auto">
          {console.log(serviceType)}
          <div class="flex items-center gap-5">
              <button onclick={() => currPopUp = ''}  type="button">
                <img src="/back_icon.svg" alt="Back" class="w-6 h-6 cursor-pointer transition-colors duration-200 hover:opacity-70 active:opacity-50"/>
              </button>
              <h1 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900">Create a Division</h1>
          </div>

          <label class="mt-5">
            <span class="text-label">Division Name</span>
            <input class = "input-box" type = "text" name = "name" placeholder="Divison Name">
          </label>

          <div class="grid grid-cols-2 gap-5 items-center">

              <label class="flex flex-col">
                  <span class="text-label">Contact No.</span>
                  <input 
                      class="input-box w-full" 
                      type="text" 
                      name="phoneNumber" 
                      placeholder="Contact No."
                  >
              </label>

              <label class="flex flex-col">
                  <span class="text-label">Hours of Operation</span>
                  <div class="flex items-center space-x-2">
                      <input 
                          class="input-box w-30"
                          name="opening"
                          type="time"
                          value="08:00"
                      >
                      <span class="text-label">to</span>
                      <input 
                          class="input-box w-30"
                          name="closing"
                          type="time"
                          value="16:00"
                      >
                  </div>
              </label>
          </div>

          <label>
            <span class="text-label">Link a Service</span>
            {#each linkableServices as { divisionID, name, services }}
              {name}
              {#each services as { serviceID, type }}
                {type}

                <div class="option">
                  <input type=checkbox
                              bind:group={selectedLinkableServices[divisionID]}
                              name={serviceID}
                              value={serviceID}
                              id={type}
                              disabled={selectedLinkableServices[divisionID].length === (selectedLinkableServices[divisionID].length - 1) && !selectedLinkableServices[divisionID].includes(serviceID)}
                              >
                  <label for={type}>{type}</label>
                </div>
                }
              {/each}
            {/each} 
          </label>

          <button 
            class="w-full border bg-white text-left p-2 rounded relative overflow-hidden pr-8" 
            onclick={() => showDropdown = !showDropdown}
            type="button" 
          >
            <span class="fade-mask">
              Select Providers
            </span>
    
            <svg class="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 transition-transform pointer-events-none" 
              style="transform: {showDropdown ? 'rotate(180deg)' : 'rotate(0deg)'}" 
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>

          {#if showDropdown}
            <div class="">
<!--               {#each providers as t}
                <label class="flex items-center space-x-2">
                  <input 
                      name={t} 
                      type="checkbox" 
                      onclick={() => selectedProviders.includes(t) ? selectedProviders.splice(selectedProviders.indexOf(t), 1) : selectedProviders.push(t)} 
                  />
                  <span>{t}</span>
                </label>
              {/each} -->

              {#each linkableServices as { divisionID, name, services }}
                {name}
                {#each services as { serviceID, type }}
                  {type}

                  <label class="flex items-center space-x-2">
                    <input 
                        name={type} 
                        type="checkbox"
                    />
                    <span>{type}</span>
                  </label>

                  <div class="option">
                    <input type=checkbox
                                bind:group={selectedLinkableServices[divisionID]}
                                name={serviceID}
                                value={serviceID}
                                id={type}
                                disabled={selectedLinkableServices[divisionID].length === (selectedLinkableServices[divisionID].length - 1) && !selectedLinkableServices[divisionID].includes(serviceID)}
                                >
                    <label for={type}>{type}</label>
                  </div>
                  }
                {/each}
              {/each} 
            </div>
          {/if} 

          <!-- <button type="button" class="mt-2 font-semibold text-purple-500 rounded-lg hover:text-purple-200"  onclick={() => {currNewServices = currNewServices == 0 ? currNewServices + 1 : currNewServices}} >
          + Create New Service
          </button> -->
          
          <!-- {#each [0, 1, 2] as i}
            {#if currNewServices > i}
              <div class="h-[calc(100vh-100px)] flex bg-gray-100 rounded-2xl">
                <div class="w-1/3 bg-white p-6 flex flex-col  ">
                    <div class="flex items-center gap-5">
                        <button onclick={() => currPopUp = ''} >
                          <img src="/back_icon.svg" alt="Back" class="w-6 h-6 cursor-pointer transition-colors duration-200 hover:opacity-70 active:opacity-50"/>
                        </button>
                        <h1 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900">Add a Service</h1>
                    </div>

                    <label class="mt-5">
                      <span class="text-label">Select a Service</span>
                      <select name={(() => { return serviceTypeNames[i]})()} bind:value={serviceTypes[i]} required class="border-2 border-[#D9D9D9] p-2 rounded w-full">
                        {#each (data.availableServices ?? []) as service}
                          <option 
                            value={service} 
                            onclick={() => serviceTypes[i] = service}
                            disabled={serviceTypes.includes(service)}
                          >{service}</option>
                        {/each}
                      </select>
                    </label>
                </div>

                <div class="w-[2px] bg-gray-300"></div>

                <div class="flex-1 p-6 overflow-y-auto  "> 
                    <h2 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900">{serviceTypes[i]}</h2>
                    <label class="grid grid-cols-1">
                      {#if form?.error}
                          <p class="error">{form.error}</p>
                      {/if}
                      {#if serviceTypes[i] === "Ambulance"}
                        <AmbulanceService {i} />
                      {:else if serviceTypes[i] === "Blood Bank"}
                        <BloodBankService {i} />
                      {:else if serviceTypes[i] === "Emergency Room"}
                        <ERService {i} />
                      {:else if serviceTypes[i] === "Intensive Care Unit"}
                        <ICUService {i} />
                      {:else if serviceTypes[i] === "Outpatient"}
                        <OutpatientService {data} {i}/>
                      {/if}
                    </label>
                </div>
              </div>
            {/if}
          {/each} -->

          <div class="h-[calc(100vh-100px)] flex bg-gray-100 rounded-2xl">
            <div class="w-1/3 bg-white p-6 flex flex-col  ">
              <div class="flex items-center gap-5">
                  <button onclick={() => currPopUp = ''} >
                    <img src="/back_icon.svg" alt="Back" class="w-6 h-6 cursor-pointer transition-colors duration-200 hover:opacity-70 active:opacity-50"/>
                  </button>
                  <h1 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900">Add a Service</h1>
              </div>

              <label class="mt-5">
                <span class="text-label">Select a Service</span>
                <select name="serviceType" bind:value={serviceType} class="border-2 border-[#D9D9D9] p-2 rounded w-full">
                  {#each (data.availableServices ?? []) as service}
                    <option 
                      value={service} 
                      onclick={() => serviceType = (service as string)}
                    >{service}</option>
                  {/each}
                </select>
              </label>
            </div>

            <div class="w-[2px] bg-gray-300"></div>

            <div class="flex-1 p-6 overflow-y-auto  "> 
                <h2 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900">{serviceType}</h2>
                <label class="grid grid-cols-1">
                  {#if form?.error}
                      <p class="error">{form.error}</p>
                  {/if}
                  {#if serviceType === "Ambulance"}
                    <AmbulanceService />
                  {:else if serviceType === "Blood Bank"}
                    <BloodBankService />
                  {:else if serviceType === "Emergency Room"}
                    <ERService />
                  {:else if serviceType === "Intensive Care Unit"}
                    <ICUService />
                  {:else if serviceType === "Outpatient"}
                    <OutpatientService {data} />
                  {/if}
                </label>
            </div>
          </div>
<!--             <button type="button" class="mt-2 font-semibold text-purple-500 rounded-lg hover:text-purple-200"  onclick={() => {
              currNewServices = currNewServices - 1
              serviceTypes[currNewServices] = ''
            }} >
            - Remove New Service
            </button>
 -->

          <button type="submit" class="mt-auto bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700" >
              Add Division
          </button>

        </div>

      </div>
    </form>
  </div>
</div>
