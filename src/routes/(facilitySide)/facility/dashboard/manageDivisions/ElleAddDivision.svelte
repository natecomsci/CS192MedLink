<script lang="ts">
    import type { ActionData, PageData } from './$types';
    import { enhance } from '$app/forms';

    import type { DivisionDTO, MultiServiceDivisionsDTO } from '$lib';
    import { pagingQueryHandler } from '$lib/postHandlers';

    import AmbulanceService from './AddAmbulanceService.svelte';
    import BloodBankService from './AddBloodBankService.svelte';
    import ERService from './AddERService.svelte';
    import ICUService from './AddICUService.svelte';
    import OutpatientService from './AddOutpatientService.svelte';

    import CreationSuccess from '$lib/facilityComponents/CreationSuccess.svelte';
    import DeletionSuccess from '$lib/facilityComponents/DeletionSuccess.svelte';

    let { data, 
            form, 
            currPopUp = $bindable(),
            divisions = $bindable(),
            linkableServices = $bindable(),
            currentPage = $bindable(),
            totalPages = $bindable(),
            perPage
            }:{ data:PageData, 
                form: ActionData, 
                currPopUp: String, 
                divisions:DivisionDTO[], 
                linkableServices: MultiServiceDivisionsDTO[],
                currentPage: number, 
                totalPages: number, 
                perPage: number
            } = $props();

    // let selectedLinkableServices: Record<string, string[]> = {};
    let selectedLinkableServices = $state<Record<string, string[]>>({});
    let linkableServiceList: string[] = $state([])


    function toggleDivision(name: string, divisionID: string) {
        if (linkableServiceList.includes(name)) {
            linkableServiceList = linkableServiceList.filter(d => d !== divisionID);
        } else {
            linkableServiceList = [...linkableServiceList, divisionID];
        }
    }

    function isAccepted( division:string ): boolean {
        return linkableServiceList.includes(division) ?? false
    }

    for (var { divisionID } of linkableServices) {
        selectedLinkableServices[divisionID] = []
    }


    async function getNewDivisions() {
        try {
        const rv = await pagingQueryHandler({
            page: 'divisions',
            query: '',
            isInQueryMode:false,
            currentPage:1,
            change:0,
            totalPages:1,
            perPage,
            viewedDivisionID: "Default"
        });
        divisions =  rv.list
        currentPage = 1
        totalPages = rv.totalPages
        } catch (error) {
        console.log((error as Error).message)
        }
    }
    function toggleServiceSelection(divisionID: string, serviceID: string) {
        let current = selectedLinkableServices[divisionID] || [];

        if (current.includes(serviceID)) {
            selectedLinkableServices[divisionID] = current.filter(id => id !== serviceID);
        } else {
            selectedLinkableServices[divisionID] = [...current, serviceID];
        }
    }

    let divisionNameMap: Record<string, string> = {};
    let serviceTypeMap: Record<string, string> = {};

    for (const { divisionID, name, services } of linkableServices) {
        divisionNameMap[divisionID] = name;
        for (const { serviceID, type } of services) {
            serviceTypeMap[serviceID] = type;
        }
    }


    // let serviceType = $state('');
    // let showDropdown = $state(false)
    // let newServicesCount = $state(0)
    // let newServiceTypes: string[] = $state([])

    // let currState = $state(-1)




    let mode = $state("")
    let newServicesCount = $state(0)
    let newServiceTypes: string[] = $state([])

    //elle
    // let tempServiceList = Array(10).fill().map((_, index) => `Service ${index + 1}`);
    let tempServiceList: string[] = [];
    let currState = $state(-1)
    let showDropdown = $state(false)
    let showServiceSuccess = $state(false)
    let showDivisionSuccess = $state(false)

</script>

<form 
      method="POST" 
      action="?/addDivision"
      use:enhance={() => {
        return async ({ update }) => {
          await update({invalidateAll:true});
          if (form?.success) {
              currPopUp = ''
              getNewDivisions()
          }
        };
      }}
    >

<div class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"> <!-- BACKGROUND -->
    {#if form?.error}
        form.error
    {/if}


    <!-- {#if currState === 1} -->
    <div class="w-11/12 max-w-3/4 rounded-lg  overflow-hidden h-[calc(100vh-100px)] flex bg-gray-100 rounded-2xl {currState === -1 ? "" : "hidden"}">
    
        <!-- Left Side -->
        <div class="w-1/2 p-6 flex flex-col bg-background">
            <!-- Header -->
            <div class="flex items-center gap-5 ">
                <button onclick={() => currPopUp = ''} type="button">
                    <img src="/back_icon.svg" alt="Back" class="w-6 h-6 cursor-pointer transition-colors duration-200 hover:opacity-70 active:opacity-50"/>
                </button>
                <h1 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900">Add a Division</h1>
            </div>

            <div class="gap-3 flex flex-col">

                <label class="mt-5 ">
                  <span class="text-label">Division Name</span>
                  <input class = "input-box" type = "text" name = "name" placeholder="Divison Name">
                </label>

                <div class="grid grid-cols-2 gap-5 items-center ">
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

                <label class="flex flex-col ">
                    <span class="text-label">Email</span>
                    <input
                    class="input-box w-full"
                    type="email"
                    name="email"
                    placeholder="Email"
                    >
                </label>
                <label class="relative block w-full ">
                    <span class="text-label">Link or Create Service</span>
                    <!-- Link A Service Input Box DropDown -->
                    <span>
                        <button
                            class="input-box text-left p-2 rounded relative overflow-hidden pr-8 w-full"
                            onclick={() => showDropdown = !showDropdown}
                            type="button">
                            <span class="fade-mask text-neutral-600">Link a Service</span>
                            <svg class="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 transition-transform pointer-events-none"
                            style="transform: {showDropdown ? 'rotate(180deg)' : 'rotate(0deg)'}"
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clip-rule="evenodd" />
                            </svg>
                        </button>
                        <!-- Dropdown -->
                        <div
                            class={"border border-gray-300 absolute mt-1 bg-background shadow-lg rounded p-2 w-full max-h-60 overflow-y-auto " + (showDropdown ? "" : "hidden")}
                            style="z-index: 50;"
                        >
                            <div>
                            {#each linkableServices as { divisionID, name, services }}
                                <span class="block font-semibold">{name}</span>
                                {#each services as { serviceID, type }}
                                    <label class="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedLinkableServices[divisionID]?.includes(serviceID)}
                                            onchange={() => toggleServiceSelection(divisionID, serviceID)}
                                        />
                                        <span>{type}</span>
                                    </label>
                                {/each}
                            {/each}
                            </div>
                        </div>
                    </span>
                    <button
                        class="text-lg font-semibold my-1 text-primary-500 rounded-lg hover:underline "
                        onclick={() => {
                            newServicesCount++
                            currState = newServicesCount-1;
                            newServiceTypes.push('')
                            mode = "Add"
                        }
                        }
                    >
                        + Create A New Service
                    </button>
                </label>
            </div>

            <button type="submit" class="mt-auto bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700" data-sveltekit-reload >
                Create Division
            </button> 
        </div>


        <!-- Right Side -->
        <div class="w-1/2  p-6 flex flex-col ">
            <h1 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900">Linked Services</h1>
            <div class=" overflow-y-auto p-6 ">


                <!-- Linked Services -->
                {#each Object.entries(selectedLinkableServices) as [divisionID, services]}
                    {#each services as serviceID}
                        <div class="card2 mb-4 flex items-center justify-between rounded-lg bg-gray-50 shadow-sm">
                            <div class="flex items-start gap-4">
                                <div>
                                    <p class="font-bold text-lg text-gray-800">{serviceTypeMap[serviceID]}</p>
                                    <p class="text-sm text-gray-500">from {divisionNameMap[divisionID]}</p>
                                </div>
                            </div>
                            <button class="text-red-600 hover:text-red-800" onclick={() => toggleServiceSelection(divisionID, serviceID)}>
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    {/each}
                {/each}

                <!-- New Services -->
                {#if newServicesCount > 0}
                    {#each newServiceTypes as newservice, index}
                        <div class="card2 mb-4 flex items-center justify-between rounded-lg bg-gray-50 shadow-sm">
                            <div class="flex items-start gap-4 ">
                                <p class="font-bold text-lg text-gray-800">{newservice}</p>
                            </div>
                            
                            <div class=" items-center justify-center flex gap-3">
                                <button class="text-red-600 hover:text-red-800"
                                onclick={() => {
                                    currState = index; 
                                    mode = "Edit"
                                    }}
                                >
                                    <img src="/dashedit_icon.svg" alt="edit" class="w-6 h-6 cursor-pointer hover:opacity-80" />
                                </button>
                                {#if index === newServicesCount-1}
                                <button class="text-red-600 hover:text-red-800"
                                        onclick={() => {
                                            newServiceTypes = newServiceTypes.filter((_, idx) => idx !== index);
                                            newServicesCount--;
                                        }}
                                
                                >
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                {/if}
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>        
        </div>
    </div>

    <!--========================================== next state: creating a service ==========================================-->

    {#each {length: newServicesCount}, i}
    <div class="w-11/12 max-w-3/4 rounded-lg  overflow-hidden h-[calc(100vh-100px)] flex bg-gray-100 rounded-2xl {currState === i ? "": "hidden"}">
        <!-- Left Side -->
        <div class="w-1/3 p-6 flex flex-col bg-background">
            <!-- Header -->
            <div class="flex items-center gap-5 ">
                <button type="button"  onclick={() => {
                        currState = -1

                        if (mode === "Add") {
                            newServicesCount--
                            newServiceTypes.pop()
                        }
                    }}
                >      
                    <img src="/back_icon.svg" alt="Back" class="w-6 h-6 cursor-pointer transition-colors duration-200 hover:opacity-70 active:opacity-50"/>
                </button>
                <h1 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900">Creating A New Service</h1>
            </div>
            <!-- Select a Service -->
            <label class="mt-5">
                <span class="text-label">Select a Service</span>
                <select name="serviceType{i}" 
                    bind:value={newServiceTypes[i]} class="input-box">
                    <option value="" disabled selected>Select a Service</option>
                    {#each (data.availableServices ?? []) as service}
                        <option value={service}
                                onclick={() => newServiceTypes[i] = (service as string)}
                        >{service}</option>
                    {/each}
                </select>
            </label>
            {#if mode === "Add"}
            <button type="button" class="mt-auto bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700" 
                onclick= {()=>
                    showServiceSuccess = true}>
                Create Service
            </button>
            {/if}
        </div>


        <!-- Right Side -->
        <div class="w-2/3 p-6 flex flex-col ">
            <!-- Service -->
            <div class="flex-1 p-6 overflow-y-auto"> 
                <h2 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900">{newServiceTypes[i]}</h2>
                <label class="grid grid-cols-1">
                    {#if newServiceTypes[i] === "Ambulance"}
                    <AmbulanceService {i}/>
                    {:else if newServiceTypes[i] === "Blood Bank"}
                    <BloodBankService {i}/>
                    {:else if newServiceTypes[i] === "Emergency Room"}
                    <ERService {i}/>
                    {:else if newServiceTypes[i] === "Intensive Care Unit"}
                    <ICUService {i}/>
                    {:else if newServiceTypes[i] === "Outpatient"}
                    <OutpatientService {data} {i}/>
                    {/if}
                </label>
            </div>
        </div>


        {#if showServiceSuccess}
            <CreationSuccess 
                action = {
                    ()=> {
                        currState = -1
                        showServiceSuccess = false
                        }
                    }
                successMessage = "Service Listed"
                createdName = " " /> 
        {/if}
    </div>
    {/each}
</div>

</form>