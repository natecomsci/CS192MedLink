<script lang="ts">
  import type { ActionData, PageData } from "./$types";
  
  let { data,
        form, 
        serviceType, 
        serviceID,
      }:{ data: PageData,
          form: ActionData, 
          serviceType: String,
          serviceID: String,
        } = $props();
  
  let price: Number = $state(0)
  let completionTimeD: Number = $state(0)
  let completionTimeH: Number = $state(0)
  let isAvailable: boolean = $state(false)
  let acceptsWalkIns: boolean = $state(false)

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
</script>



<!-- Right Panel (Scrollable) -->
<label class="grid grid-cols-1 " >
  <!-- {#if form?.error}
      <p class="error">{form.error}</p>
  {/if} -->
  <div class="flex-1 p-6 overflow-y-auto  ">
    <input type="text" class="hidden" name="OPserviceType" value={serviceType} />
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
            bind:value={completionTimeD}
          />
          Days
          <input 
            type="number" 
            name="completionHours"
            class="border p-2 rounded  w-30" 
            placeholder="Hours"
            bind:value={completionTimeH}
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
          bind:value={price}
        />
      </label>
    </div>

    <div class="card grid gap-2 p-4 bg-background rounded-lg shadow">
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
  </div>  
</label>
