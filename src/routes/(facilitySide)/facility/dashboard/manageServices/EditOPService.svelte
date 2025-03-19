<script lang="ts">
  import type { ActionData } from './$types';
  import { enhance } from '$app/forms';

  let { form, serviceID }: { form: ActionData, serviceID: String } = $props();

  let price: Number = $state(0)
  let completionTimeD: Number = $state(0)
  let completionTimeH: Number = $state(0)
  let isAvailable: boolean = $state(false)
  let acceptsWalkIns: boolean = $state(false)

  async function getData() {
    const body = JSON.stringify({serviceID, serviceType:"Outpatient"});

    try {
      const response = await fetch("./manageServices/serviceInfoHandler", {
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
      console.log(rv)

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

</script>

<form method="POST" 
    id="editService"
    action="?/editOPService"
    use:enhance
>
<div class=" h-[calc(100vh-100px)] flex bg-gray-100 border border-black">

<!-- Vertical Divider -->
<div class="w-[2px] bg-gray-300"></div>

<!-- Right Panel (Scrollable) -->
  <div class="flex-1 p-6 overflow-y-auto border border-green-100">
    <label class="grid grid-cols-1" >
      {#if form?.error}
          <p class="error">{form.error}</p>
      {/if}
      <div class="flex-1 p-6 overflow-y-auto border border-green-100">
  
          <!-- Turnaround Time -->
          <div class="mt-4 bg-white p-4 rounded-lg shadow">
              <label class="block text-gray-700 ">Completion Time
                  <div class="flex items-center gap-2">
  
                      <input 
                          type="number" 
                          name="completionDays"
                          class="border p-2 rounded  w-30" 
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
          <div class="mt-4 bg-white p-4 rounded-lg shadow">
              <label class="block text-gray-700">Base Price
                  <input 
                      name="price"
                      type="number" 
                      class="border p-2 rounded w-full" 
                      placeholder="Price"
                      step=0.01
                      min=0
                      value={price}
                  />
                  
              </label>
          </div>
  
          <div class="mt-4 bg-white p-4 rounded-lg shadow">
            <label>
              Is Available
              <input 
                name="isAvailable" 
                type="checkbox"
                checked={isAvailable}
              >
            </label>
            <label>
              Accepts WalkIns
              <input 
                name="acceptsWalkIns" 
                type="checkbox"
                checked={acceptsWalkIns}
              >
            </label>
          </div>
        </div>  
      </label>
    </div>
  </div>
</form>
