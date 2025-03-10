<script lang="ts">
  import type { PageProps } from './$types';
  import { load } from '$lib/projectArrays';
  import { enhance } from '$app/forms';

  let { data, form }: PageProps = $props();
</script>

<div class=" h-[calc(100vh-100px)] flex bg-gray-100 border border-black">
<!-- Left Panel (Static) -->
<div class="w-1/3 bg-white p-6 flex flex-col shadow-md border border-purple-700">
    <!-- Back Button & Edit Service-->
    <div class= "flex items-center gap-5">
        <a href="/facility/dashboard/manageServices">
          <img src="/back_icon.svg" alt="Back" class="w-6 h-6 cursor-pointer transition-colors duration-200 hover:opacity-70 active:opacity-50"/>
        </a>

        <h1 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900">Edit ICU Service</h1>
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
                      <p class="error">{form?.error}</p>
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
                      value={data.baseRate}
                      required 
                  />
                  {#if form?.description === "price"}
                      <p class="error">{form?.error}</p>
                  {/if}
              </label>
          </div>
  
          <div class="mt-4 bg-white p-4 rounded-lg shadow">
              <label>
                  Load
                  <select name="load" value={data.load} required class="border p-2 rounded w-full">
                      {#each load as a}
                          <option value={a}>{a}</option>
                      {/each}
                  </select>
  
              </label>
          </div>
  
          <div class="mt-4 bg-white p-4 rounded-lg shadow">
              <label class="block text-gray-700">
                Available Beds
                  <input 
                      name="availableBeds" 
                      type="number" 
                      class="border p-2 rounded w-full" 
                      placeholder="Price" 
                      step=0.01
                      min=0
                      value={data.availableBeds}
                      required 
                  />
                  {#if form?.description === "availableBeds"}
                      <p class="error">{form?.error}</p>
                  {/if}
              </label>
          </div>
  
  
          <div class="mt-4 bg-white p-4 rounded-lg shadow">
              <label>
                Support
                <label>
                  cardiacSupport
                  <input 
                    name="cardiacSupport" 
                    type="checkbox"
                    checked={data.cardiacSupport}
                  >
                </label>
                <label>
                  neurologicalSupport
                  <input 
                    name="neurologicalSupport" 
                    type="checkbox"
                    checked={data.neurologicalSupport}
                  >
                </label>
                <label>
                  renalSupport
                  <input 
                    name="renalSupport" 
                    type="checkbox"
                    checked={data.renalSupport}
                  >
                </label>
                <label>
                  respiratorySupport
                  <input 
                    name="respiratorySupport" 
                    type="checkbox"
                    checked={data.respiratorySupport}
                  >
                </label>
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

