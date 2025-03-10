<script lang="ts">
  import type { PageProps } from './$types';
  import { load } from '$lib/projectArrays';
  import { enhance } from '$app/forms';

  let { data, form }: PageProps = $props();
</script>

<div class=" h-[calc(100vh-100px)] flex bg-gray-100 border border-black">
<!-- Left Panel (Static) -->
<div class="w-1/3 bg-white p-6 flex flex-col shadow-md border border-purple-700">
    <!-- Back Button & Edit Ambulance Service-->
    <div class= "flex items-center gap-5">
        <a href="/facility/dashboard/manageServices">
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


   


      <form method="POST" 
      action="?/updateService"
      use:enhance
    >
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
                          required />
                      Days
                  
                      <input 
                          type="number" 
                          name="completionHours"
                          class="border p-2 rounded  w-30" 
                          placeholder="Hours" 
                          value={data.completionTimeH}
                          required
                      />
                      Hours
                  </div>
                  {#if form?.description === "completion"}
                      <p class="error">{form.error}</p>
                  {/if}
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
                      required 
                  />
                  {#if form?.description === "price"}
                      <p class="error">{form.error}</p>
                  {/if}
              </label>
          </div>
  
          <div class="mt-4 bg-white p-4 rounded-lg shadow">
            <label>
              isAvailable
              <input 
                name="isAvailable" 
                type="checkbox"
                checked={data.isAvailable}
              >
            </label>
            <label>
              acceptsWalkIns
              <input 
                name="acceptsWalkIns" 
                type="checkbox"
                checked={data.acceptsWalkIns}
              >
            </label>
          </div>
          {#if form?.description === "button"}
              <p class="error">{form.error}</p>
          {/if}
      </div>
  </form>
  


  </label>
</div>
</div>

