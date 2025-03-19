<script lang="ts">
  import type { ActionData } from './$types';
  import { enhance } from '$app/forms';

  import { load } from '$lib/projectArrays';
    import type { Load } from '@prisma/client';
  let { form, serviceID, currPopUp = $bindable()}: {form: ActionData, serviceID: String, currPopUp: String} = $props();

  let phoneNumber: String = $state('')
  let baseRate: Number = $state(0)
  let loadVal: Load = $state("CLOSED" as Load)
  let availableBeds: Number = $state(0)
  let cardiacSupport: boolean = $state(false)
  let neurologicalSupport: boolean = $state(false)
  let renalSupport: boolean = $state(false)
  let respiratorySupport: boolean = $state(false)

  async function getData() {
    const body = JSON.stringify({serviceID, serviceType:"Intensive Care Unit"});

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
      baseRate = rv.baseRate
      loadVal = rv.load
      availableBeds = rv.availableBeds
      cardiacSupport = rv.cardiacSupport
      neurologicalSupport = rv.neurologicalSupport
      renalSupport = rv.renalSupport
      respiratorySupport = rv.respiratorySupport

      
    } catch (error) {
      throw new Error(`Response status: ${error}`);
    }
  }
  getData()
</script>

<form method="POST" 
    id="editService"
    action="?/editICUService"
    use:enhance={() => {
        return async ({ update }) => {
            await update();
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
                      value={baseRate}
                  />
              </label>
          </div>
  
          <div class="card">
              <label><span class="text-label">
                  Load</span>
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
                      step=0.01
                      min=0
                      value={availableBeds}
                  />
              </label>
          </div>
            <div class="card p-4 bg-white rounded-lg shadow">
              <span class="block text-label mb-2">Support</span>
              <div class="grid grid-cols-1 gap-2">
                  <label class="flex items-center space-x-2">
                      <input name="cardiacSupport" type="checkbox" checked={cardiacSupport}
                      >
                      <span>Cardiac Support</span>
                  </label>
                  <label class="flex items-center space-x-2">
                      <input name="neurologicalSupport" type="checkbox" checked={neurologicalSupport}>
                      <span>Neurological Support</span>
                  </label>
                  <label class="flex items-center space-x-2">
                      <input name="renalSupport" type="checkbox" checked={renalSupport}>
                      <span>Renal Support</span>
                  </label>
                  <label class="flex items-center space-x-2">
                      <input name="respiratorySupport" type="checkbox" checked={respiratorySupport}>
                      <span>Respiratory Support</span>
                  </label>
              </div>
          </div>
        </div>
    </label>
</form>


