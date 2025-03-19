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
          <!-- Turnaround Time -->
          <div class="card">
              <label><span class="text-label">Completion Time</span>
                  <div class="flex items-center gap-2">
  
                      <input 
                          type="number" 
                          name="completionDays"
                          class="input-box  w-30" 
                          placeholder="Days" 
                           />
                      Days
                  
                      <input 
                          type="number" 
                          name="completionHours"
                          class="input-box w-30" 
                          placeholder="Hours" 
                          
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
                       
                  />
                  
              </label>
          </div>
  
          <div class="card">
            <label>
                <span class="text-label">Is Available</span>
              
              <input 
                name="isAvailable" 
                type="checkbox"
              >
            </label>
            <label>
              
              <span class="text-label">Accepts WalkIns</span>
              <input 
                name="acceptsWalkIns" 
                type="checkbox"
              >
            </label>
          </div>
        </div>  
      </label>

</form>
