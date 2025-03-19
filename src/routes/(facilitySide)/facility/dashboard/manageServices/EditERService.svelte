<script lang="ts">
  import type { ActionData } from './$types';
  import { enhance } from '$app/forms';
  
  import { load } from '$lib/projectArrays'
    import type { Load } from '@prisma/client';
  let { form, serviceID, currPopUp = $bindable()}: {form: ActionData, serviceID: String, currPopUp: String} = $props();
  
  let phoneNumber          : String = $state('')
  let loadVal              : Load   = $state("CLOSED" as Load)
  let availableBeds        : Number = $state(0)
  let nonUrgentPatients    : Number = $state(0)
  let nonUrgentQueueLength : Number = $state(0)
  let urgentPatients       : Number = $state(0)
  let urgentQueueLength    : Number = $state(0)
  let criticalPatients     : Number = $state(0)
  let criticalQueueLength  : Number = $state(0)

  async function getData() {
    const body = JSON.stringify({serviceID, serviceType:"Emergency Room"});

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

      phoneNumber = rv.phoneNumber
      loadVal = rv.load
      availableBeds = rv.availableBeds
      nonUrgentPatients = rv.nonUrgentPatients
      nonUrgentQueueLength = rv.nonUrgentQueueLength
      urgentPatients = rv.urgentPatients
      urgentQueueLength = rv.urgentQueueLength
      criticalPatients = rv.criticalPatients
      criticalQueueLength = rv.criticalQueueLength
      
    } catch (error) {
      throw new Error(`Response status: ${error}`);
    }
  }
  getData()


</script>


<form method="POST" 
    id="editService"
    action="?/editERService"
    use:enhance={() => {
        return async ({ update }) => {
            await update({invalidateAll:true});
            if (form?.success) {
                currPopUp = ''
            }
        };
    }}
>
    <label class="grid grid-cols-1" >
        {#if form?.error}
              <p class="error">{form.error}</p>
          {/if}
        <div class="container">
            <input 
                class="hidden" 
                name="serviceID"
                type="text"
                value={serviceID}
            />
            <!-- Phone Number -->
            <div class="card">
                <label><span class="text-label">Phone No.</span>
                    <input 
                        class="input-box" 
                        name="phoneNumber"
                        type="tel"
                        value={phoneNumber}
                    />
                </label>
            </div>
    
            <div class="card">
                <label>
                    <span class="text-label">Load</span>
                    <select 
                      name="load" 
                      class="input-box"
                      value={loadVal}
                    >
                        {#each load as a}
                            <option value={a}>{a}</option>
                        {/each}
                    </select>
    
                </label>
            </div>
    
            <div class="card">
                <label><span class="text-label">
                    Available Beds</span>
                    <input 
                        name="availableBeds"
                        type="number" 
                        class="input-box" 
                        placeholder="Available Beds"
                        step=1
                        min=0
                        value={availableBeds}
                    />
                </label>
            </div>
    
            <div class="card">
                <label><span class="text-label">
                    Non Urgent Patients</span>
                    <input 
                        name="nonUrgentPatients"
                        type="number" 
                        class="input-box" 
                        placeholder="Non Urgent Patients"
                        step=1
                        min=0
                        value={nonUrgentPatients}
                    />
                </label>
            </div>
    
            <div class="card">
                <label><span class="text-label">
                    Non Urgent Patients Queue Length</span>

                    <input 
                        name="nonUrgentQueueLength"
                        type="number" 
                        class="input-box" 
                        placeholder="Non Urgent Patients Queue Length"
                        step=1
                        min=0
                        value={nonUrgentQueueLength}
                    />
                </label>
            </div>
    
            <div class="card">
                <label><span class="text-label">
                    Urgent Patients</span>
                    <input 
                        name="urgentPatients"
                        type="number" 
                        class="input-box" 
                        placeholder="Urget Patients"
                        step=1
                        min=0
                        value={urgentPatients}
                    />
                </label>
            </div>
    
            <div class="card">
                <label><span class="text-label">
                    Urgent Patients Queue Length</span>
                    <input 
                        name="urgentQueueLength"
                        type="number" 
                        class="input-box" 
                        placeholder="Urgent Patients Queue Length"
                        step=1
                        min=0
                        value={urgentQueueLength}
                    />
                </label>
            </div>
    
            <div class="card">
                <label><span class="text-label">
                    Critical Patients</span>
                    <input 
                        name="criticalPatients"
                        type="number" 
                        class="input-box" 
                        placeholder="Critical Patients"
                        step=1
                        min=0
                        value={criticalPatients}
                    />
                </label>
            </div>
    
            <div class="card">
                <label><span class="text-label">
                    Critical Patients Queue Length</span>
                    <input 
                        name="criticalQueueLength"
                        type="number" 
                        class="input-box" 
                        placeholder="Critical Patients Queue Length"
                        step=1
                        min=0
                        value={criticalQueueLength}
                    />
                </label>
            </div>
        </div>
    </label>
</form>
