<script lang="ts">
  import type { PageProps } from "./$types";
  import { enhance } from '$app/forms';
    import { availability } from "$lib/projectArrays";

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
            <a href="/facility/dashboard/manageServices">
              <img src="/back_icon.svg" alt="Back" class="w-6 h-6 cursor-pointer transition-colors duration-200 hover:opacity-70 active:opacity-50"/>
            </a>

            <h1 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900">Edit Ambulance Service</h1>
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



          <div class="flex-1 p-6 overflow-y-auto border border-green-100">
              <!-- Phone Number -->
              <div class="mt-4 bg-white p-4 rounded-lg shadow">
                  <label class="block text-gray-700">Phone No.
                      <input 
                          class="border p-2 rounded w-full" 
                          name="phoneNumber"
                          type="tel"
                          value={data.phoneNumber}
                          required 
                      />
                      {#if form?.description === "phoneNumber"}
                          <p class="error">{form.error}</p>
                      {/if}
                  </label>
              </div>
        
              <!-- Hours of Operation -->
              <div class="mt-4 bg-white p-4 rounded-lg shadow">
                  <label class="block text-gray-700">Hours of Operation
                      <div class="flex items-center gap-2">
                          <input 
                          class="border p-2 rounded w-30"
                          name="opening"
                          type="time"
                          value={data.openingTime}
                          required
                          >
                          to
                          <input 
                          class="border p-2 rounded w-30"
                          name="closing"
                          type="time"
                          value={data.closingTime}
                          required
                          >
                          {#if form?.description === "openClose"}
                              <p class="error">{form.error}</p>
                          {/if}
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
                          value={data.baseRate}
                          required 
                      />
                      {#if form?.description === "price"}
                          <p class="error">{form.error}</p>
                      {/if}
                  </label>
              </div>
        
              <!-- Coverage Radius -->
              <div class="mt-4 bg-white p-4 rounded-lg shadow">
                  <label class="block text-gray-700">Coverage Radius
                      <div class="flex gap-2">
                          <label>
                              Minimum coverage radius
                              <input 
                              name="minCoverageRadius" 
                              type="number"
                              placeholder=1
                              class = "border p-2 rounded w-20"
                              step=0.01
                              min=0
                              value={data.minCoverageRadius}
                              required
                              >
                              km
                          </label>
                          
                          <label>
                              Maximum coverage radius
                              <input 
                              name="maxCoverageRadius" 
                              type="number"
                              placeholder=1
                              class = "border p-2 rounded w-20"
                              step=0.01
                              min=0
                              value={data.maxCoverageRadius}
                              required
                              >
                              km
                          </label>
                          {#if form?.description === "coverage"}
                              <p class="error">{form.error}</p>
                          {/if}
                      </div>
                  </label>
              </div>
        
              <!-- Mileage Rate -->
              <div class="mt-4 bg-white p-4 rounded-lg shadow">
                  <label class="block text-gray-700">Mileage Rate
                      <input 
                          name="mileageRate" 
                          type="number" 
                          class="border p-2 rounded w-full" 
                          placeholder="Mileage Rate" 
                          step=0.01
                          min=0
                          value={data.mileageRate}
                          required 
                      />
                      {#if form?.description === "mileRate"}
                          <p class="error">{form.error}</p>
                      {/if}
                  </label>
              </div>
        
              <div class="mt-4 bg-white p-4 rounded-lg shadow">
                <label>
                    Availability
        
                  <select name="availability" value={data.availability} required class="border p-2 rounded w-full">
                    {#each availability as a}
                      <option value={a}>{a}</option>
                    {/each}
                  </select>
                </label>
              </div>
              {#if form?.description === "button"}
                    <p class="error">{form.error}</p>
                {/if}
          </div>
        
    

      </label>
    </div>
  </div>
</form>
