<script lang="ts">
  import type { ActionData } from './$types';
  import { enhance } from '$app/forms';

  let { form, serviceID, currPopUp = $bindable()}: {form: ActionData, serviceID: String, currPopUp: String} = $props();
  
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
  {#if form?.success}
    {currPopUp = ""}
  {/if}
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
  
          <div class="card">
            <label>
                <span class="text-label">Is Available</span>
              
              <input 
                name="isAvailable" 
                type="checkbox"
                checked={isAvailable}
              >
            </label>
            <label>
              
              <span class="text-label">Accepts WalkIns</span>
              <input 
                name="acceptsWalkIns" 
                type="checkbox"
                checked={acceptsWalkIns}
              >
            </label>
          </div>
        </div>  
      </label>

</form>
