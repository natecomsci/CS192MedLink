<script lang="ts">
  import type { PageProps } from './$types';
  import { load } from '$lib/projectArrays';
  import { enhance } from '$app/forms';

  let { data, form }: PageProps = $props();
</script>

<form method="POST" 
action="?/updateService"
use:enhance
>
    <label class="grid grid-cols-1" >
      {#if form?.error}
          <p class="error">{form.error}</p>
      {/if}
      <div class="container">
          <!-- Phone Number -->
          <div class="card">
              <label><span class="text-label">Phone No.</span>
                  <input 
                      class="input-box" 
                      name="phoneNumber"
                      type="tel"
                       
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
                       
                  />
              </label>
          </div>
  
          <div class="card">
              <label><span class="text-label">
                  Load</span>
                  <select name="load" class="input-box">
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
                      placeholder="Price" 
                      step=0.01
                      min=0
                       
                  />
              </label>
          </div>
  
  
          <div class="card p-4 bg-white rounded-lg shadow">
            <span class="block text-label mb-2">Support</span>
            <div class="grid grid-cols-1 gap-2">
                <label class="flex items-center space-x-2">
                    <input name="cardiacSupport" type="checkbox">
                    <span>Cardiac Support</span>
                </label>
                <label class="flex items-center space-x-2">
                    <input name="neurologicalSupport" type="checkbox">
                    <span>Neurological Support</span>
                </label>
                <label class="flex items-center space-x-2">
                    <input name="renalSupport" type="checkbox">
                    <span>Renal Support</span>
                </label>
                <label class="flex items-center space-x-2">
                    <input name="respiratorySupport" type="checkbox">
                    <span>Respiratory Support</span>
                </label>
            </div>
        </div>

          
        </div>
    </label>

</form>


