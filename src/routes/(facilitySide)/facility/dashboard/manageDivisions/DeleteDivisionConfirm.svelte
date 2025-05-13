<script lang="ts">
  import { enhance } from "$app/forms";
  import type { AdminDTO, DivisionDTO, ServiceDTO } from "$lib";
    import { pagingQueryHandler } from "$lib/postHandlers";
  import type { ActionData, PageData } from "./$types";

  let { data, 
        form, 
        currPopUp = $bindable(),
        divisions = $bindable(),
        divisionID,
        currentPage = $bindable(),
        totalPages = $bindable(),
        perPage
        }:{ data:PageData, 
            form: ActionData, 
            currPopUp: String, 
            divisions:DivisionDTO[], 
            divisionID: String,
            currentPage: number, 
            totalPages: number, 
            perPage: number
          } = $props();

  let admins: AdminDTO[] = $state([])
  let facilityDivisions: DivisionDTO[] = $state([])
  let services: ServiceDTO[] = $state([])

  let selectedServiceDivisionsID:Record<string, string> = $state({});
  let selectedAdminDivisionsIDs:Record<string, string[]> = $state({});

  async function getData() {
    const body = JSON.stringify({divisionID});

    try {
      const response = await fetch("./manageDivisions/", {
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

      admins = rv.admins
      facilityDivisions = rv.divisions
      services = rv.services

      for (var service of services) {
        selectedServiceDivisionsID[service.serviceID] = ''
      }

      for (var admin of admins) {
        selectedAdminDivisionsIDs[admin.employeeID] = []
      }

      return {admins, services}
      
    } catch (error) {
      throw new Error(`Response status: ${error}`);
    }
  }
  let promise = getData()

  let password = $state('')

  //= =========================================================
  let currentStep = $state(1); // Tracks the current step (1 or 2)

  

  function toggleAdminDivision(employeeID: string, divisionID: string) {
    if (selectedAdminDivisionsIDs[employeeID].includes(divisionID)) {
      selectedAdminDivisionsIDs[employeeID] = selectedAdminDivisionsIDs[employeeID].filter(d => d !== divisionID);
    } else {
      selectedAdminDivisionsIDs[employeeID] = [...selectedAdminDivisionsIDs[employeeID], divisionID];
    }
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

</script>
<form
  method="POST"
  id="deleteDivisionForm"
  action="?/deleteDivision"
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
  {#if form?.error}
    {form.error}
  {/if}
  <input type="hidden" name="divisionID" value="{divisionID}" />
  <input type="hidden" name="password" bind:value={password} />
  {#each services as service}
    <input name={service.serviceID} class="hidden" type="text" bind:value={selectedServiceDivisionsID[service.serviceID]}>
  {/each}
  {#each admins as admin}
    <input name={admin.employeeID} class="hidden" type="text" bind:value={selectedAdminDivisionsIDs[admin.employeeID]}>
  {/each}
</form>


{#if currentStep === 1}
  <div class="fixed inset-0 bg-black/30 bg-opacity-10 flex justify-center items-center z-50">
    <div class="bg-background w-1/2 h-200 max-w-full rounded-xl p-6 shadow-lg flex flex-col">

      <div class="flex items-center mb-4">
        <h2 class="text-2xl font-bold text-purple-800">Manage Services in Division Name</h2>
      </div>

      <div class="overflow-y-auto flex-1 p-4 ">
        {#await promise then {services}}
        {#each services as service}
          <div class="card2 mb-4 flex items-center justify-between rounded-lg bg-gray-50 shadow-sm">
            <div class="flex items-center gap-4">
              <div>
                <p class="font-bold text-lg text-gray-800">{service.type}</p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <div class="relative">
                <div class="border rounded px-3 py-2 text-sm focus:outline-none">
                  {#each (facilityDivisions ?? []) as { divisionID, name }}
                    <input 
                      name={service.serviceID} 
                      type="radio"
                      onclick={() => {
                        selectedServiceDivisionsID[service.serviceID] = divisionID
                        {console.log(selectedServiceDivisionsID)}
                      }} 
                    />
                    {name}
                  {/each}
                </div>
              </div>

              <button class="text-red-600 hover:text-red-800" aria-label="Delete">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        {/each}
        {/await}
      </div>

      <div class="flex justify-between mt-4 pt-4 border-t border-gray-300">
        <button class="px-4 py-2 bg-gray-300 rounded" type="button" onclick={() => currPopUp = ''}>Cancel</button>
        <button class="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700" type="button" onclick={() => currentStep = admins.length > 0 ? 2 : 3}>Next</button>
      </div>
    </div>
  </div>

{:else if currentStep === 2}
  <div class="fixed inset-0 bg-black/30 bg-opacity-10 flex justify-center items-center z-50">
    <div class="bg-background w-1/2 h-200 max-w-full rounded-xl p-6 shadow-lg flex flex-col">

      <div class="flex items-center mb-4">
        <button class="mr-3" onclick={() => currentStep = 1} aria-label="Back">
          <svg class="w-6 h-6 text-purple-800" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 class="text-2xl font-bold text-purple-800">Manage Admins in Division</h2>
      </div>

      <div class="overflow-y-auto flex-1 p-4">
        {#await promise then {admins}}
        {#each admins as admin}
          <div class="card2 mb-4 flex items-center justify-between rounded-lg bg-gray-50 shadow-sm">
            <div class="flex items-center gap-4">
              <div>
                <p class="font-bold text-lg text-gray-800">{admin.fname} {admin.lname}</p>
                <p class="text-purple-600">{admin.employeeID}</p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <div class="relative">
                <label class="flex items-center space-x-2">
                  <div class="border rounded px-3 py-2 text-sm focus:outline-none">
                    {#each (facilityDivisions ?? []) as { divisionID, name }}
                      <input 
                        type="checkbox"
                        checked={selectedAdminDivisionsIDs[admin.employeeID]?.includes(divisionID)}
                        onclick={() => {
                          toggleAdminDivision(admin.employeeID, divisionID)
                          {console.log(selectedAdminDivisionsIDs)}
                        }} 
                      />
                      {name}
                    {/each}
                  </div>
                </label>
              </div>

              <button class="text-red-600 hover:text-red-800" aria-label="Delete">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        {/each}
        {/await}
      </div>

      <div class="flex justify-between mt-4 pt-4 border-t border-gray-300">
        <button class="px-4 py-2 bg-gray-300 rounded" type="button" onclick={() => currPopUp = ''}>Cancel</button>
        <button class="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700" type="button" onclick={() => currentStep = 3}>Next</button>
      </div>
    </div>
  </div>

{:else if currentStep === 3}
  <div class="fixed inset-0 bg-black/30 bg-opacity-10 flex items-center justify-center z-50">
    <div class="bg-background p-6 rounded shadow-lg w-80">
      <h2 class="text-lg font-bold">Confirm Deletion</h2>
      <button class="mr-3" onclick={() => currentStep = admins.length > 0 ? 2 : 1} aria-label="Back">
        <svg class="w-6 h-6 text-purple-800" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <p>Are you sure you want to delete this division?</p>
        {#if form?.error}
          <p class="text-red-500 text-sm font-semibold">{form.error}</p>
        {/if}
        <!-- Password Field -->
        <div class="mt-4">
          <label for="password" class="block text-sm font-medium text-gray-700">Enter Password:</label>
          <input 
            type="password"
            bind:value={password}
            class="mt-1 block w-full p-2 border rounded border-gray-300 focus:outline-none focus:ring focus:border-blue-500" 
            required 
          />
        </div>

        <button class="px-4 py-2 bg-gray-300 rounded" type="button" onclick={() => currPopUp = ''}>Cancel</button>
        <button 
          class="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          type="submit" 
          form="deleteDivisionForm"
        >Confirm</button>
    </div>
  </div>
{/if}