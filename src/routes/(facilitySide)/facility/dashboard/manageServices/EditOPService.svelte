<script lang="ts">
  import type { ActionData, PageData } from "./$types";
  import { enhance } from '$app/forms';

  import type { ServiceDTO } from '$lib';
  import { pagingQueryHandler } from '$lib/postHandlers';

  let { data,
        form, 
        serviceID, 
        currPopUp = $bindable(), 
        services = $bindable(),
        perPage,
        viewedDivisionID,
        serviceDivisionName,
        serviceDivisionID,
      }:{ data: PageData,
          form: ActionData, 
          serviceID: String, 
          currPopUp: String, 
          services: ServiceDTO[],
          perPage:number,
          viewedDivisionID:string,
          serviceDivisionName: String,
          serviceDivisionID: String,
        } = $props();
  
  let price: Number = $state(0)
  let completionTimeD: Number = $state(0)
  let completionTimeH: Number = $state(0)
  let isAvailable: boolean = $state(false)
  let acceptsWalkIns: boolean = $state(false)

  let selectedDivisionID = $state(serviceDivisionID)
  let selectedDivisionName = $state(serviceDivisionName)

  async function getData() {
    const body = JSON.stringify({serviceID, serviceType:"Outpatient"});

    try {
      const response = await fetch("./manageServices/serviceInfo", {
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

      price = rv.price
      completionTimeD = rv.completionTimeD
      completionTimeH = rv.completionTimeH
      isAvailable = rv.isAvailable
      acceptsWalkIns = rv.acceptsWalkIns
      
    } catch (error) {
      throw new Error(`Response status: ${error}`);
    }
  }
  getData()

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

<form method="POST" 
    id="editService"
    action="?/editOPService"
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

<!-- Right Panel (Scrollable) -->
        <label class="grid grid-cols-1" >
          {#if form?.error}
              <p class="error">{form.error}</p>
          {/if}
            <div class="flex-1 p-6 overflow-y-auto border border-green-100">
              <input 
                  class="hidden" 
                  name="serviceID"
                  type="text"
                  value={serviceID}
              />
          <!-- Turnaround Time -->
          <div class="card">
              <label><span class="text-label">Completion Time</span>
                  <div class="flex items-center gap-2">
  
                      <input 
                          type="number" 
                          name="completionDays"
                          class="input-box  w-30" 
                          placeholder="Days"
                          value={completionTimeD}
                      />
                      Days
                  
                      <input 
                          type="number" 
                          name="completionHours"
                          class="border p-2 rounded  w-30" 
                          placeholder="Hours"
                          value={completionTimeH}
                      />
                      Hours
                  </div>
                </label>
              </div>
  
  
          <!-- Price Rate -->
          <div class="card">
              <label><span class="text-label">Base Price</span>
                  <input 
                      name="price"
                      type="number" 
                      class="input-box" 
                      placeholder="Price"
                      step=0.01
                      min=0
                      value={price}
                  />
                  
              </label>
          </div>
  
        <div class="card grid gap-2 p-4 bg-white rounded-lg shadow">
            <label class="flex items-center space-x-2">
                
                <input 
                    name="isAvailable" 
                    type="checkbox"
                    class="accent-purple-600" 
                    checked={isAvailable}
                >
                <span class="text-label">Is Available</span>
            </label>

            <label class="flex items-center space-x-2">
                
                <input 
                    name="acceptsWalkIns" 
                    type="checkbox"
                    class="accent-purple-600" 
                    checked={acceptsWalkIns}
                >
                <span class="text-label">Accepts WalkIns</span>
            </label>
        </div>

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
                checked={serviceDivisionID == division.divisionID}
                class="input-box w-30"
              >
            {/each}
          </label>
        {/if}
      </div>  
  </label>
</form>
