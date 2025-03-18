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
<div class=" h-[calc(100vh-100px)] flex bg-gray-100 border border-black">
<!-- Left Panel (Static) -->
<div class="w-1/3 bg-white p-6 flex flex-col shadow-md border border-purple-700">
    <!-- Back Button & Edit Ambulance Service-->
    <div class= "flex items-center gap-5">
        <a href="/facility/dashboard/manageServices" data-sveltekit-reload>
          <img src="/back_icon.svg" alt="Back" class="w-6 h-6 cursor-pointer transition-colors duration-200 hover:opacity-70 active:opacity-50"/>
        </a>

        <h1 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900">Edit INSERT NAME Service</h1>
    </div>

    <button class="mt-auto bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700">
        Edit Service
    </button>
</div>

<!-- Vertical Divider -->
<div class="w-[2px] bg-gray-300"></div>

<!-- Right Panel (Scrollable) -->
<div class="flex-1 p-6 overflow-y-auto border border-green-100">
    <h2 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900">Attributes</h2>
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
                          value={data.completionTimeD}
                           />
                      Days
                  
                      <input 
                          type="number" 
                          name="completionHours"
                          class="border p-2 rounded  w-30" 
                          placeholder="Hours" 
                          value={data.completionTimeH}
                          
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
                      value={data.price}
                       
                  />
                  
              </label>
          </div>
  
          <div class="mt-4 bg-white p-4 rounded-lg shadow">
            <label>
              Is Available
              <input 
                name="isAvailable" 
                type="checkbox"
                checked={data.isAvailable}
              >
            </label>
            <label>
              Accepts WalkIns
              <input 
                name="acceptsWalkIns" 
                type="checkbox"
                checked={data.acceptsWalkIns}
              >
            </label>
          </div>
        </div>  
      </label>
    </div>
  </div>
</form>
