<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageProps } from './$types';
    let { data, form }: PageProps = $props();
    import { load } from '$lib/projectArrays'
</script>


<form method="POST" 
action="?/updateService"
use:enhance
>
<div class=" h-[calc(100vh-100px)] flex bg-gray-100 border border-black">
  <!-- Left Panel (Static) -->
  <div class="w-1/3 bg-white p-6 flex flex-col shadow-md border border-purple-700">
      <!-- Back Button & Edit Service-->
      <div class= "flex items-center gap-5">
          <a href="/facility/dashboard/manageServices">
            <img src="/back_icon.svg" alt="Back" class="w-6 h-6 cursor-pointer transition-colors duration-200 hover:opacity-70 active:opacity-50"/>
          </a>

          <h1 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900">Edit Emergency Room Service</h1>
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
                        step=1
                        min=0
                        value={data.availableBeds}
                        required 
                    />
                    {#if form?.description === "availableBeds"}
                        <p class="error">{form.error}</p>
                    {/if}
                </label>
            </div>
    
            <div class="mt-4 bg-white p-4 rounded-lg shadow">
                <label class="block text-gray-700">
                    nonUrgentPatients
                    <input 
                        name="nonUrgentPatients"
                        type="number" 
                        class="border p-2 rounded w-full" 
                        placeholder="Price"
                        step=1
                        min=0
                        value={data.nonUrgentPatients}
                        required 
                    />
                    {#if form?.description === "nonUrgentPatients"}
                        <p class="error">{form.error}</p>
                    {/if}
                </label>
            </div>
    
            <div class="mt-4 bg-white p-4 rounded-lg shadow">
                <label class="block text-gray-700">
                    nonUrgentQueueLength
                    <input 
                        name="nonUrgentQueueLength"
                        type="number" 
                        class="border p-2 rounded w-full" 
                        placeholder="Price"
                        step=1
                        min=0
                        value={data.nonUrgentQueueLength}
                        required 
                    />
                    {#if form?.description === "nonUrgentQueueLength"}
                        <p class="error">{form.error}</p>
                    {/if}
                </label>
            </div>
    
            <div class="mt-4 bg-white p-4 rounded-lg shadow">
                <label class="block text-gray-700">
                    urgentPatients
                    <input 
                        name="urgentPatients"
                        type="number" 
                        class="border p-2 rounded w-full" 
                        placeholder="Price"
                        step=1
                        min=0
                        value={data.urgentPatients}
                        required 
                    />
                    {#if form?.description === "urgentPatients"}
                        <p class="error">{form.error}</p>
                    {/if}
                </label>
            </div>
    
            <div class="mt-4 bg-white p-4 rounded-lg shadow">
                <label class="block text-gray-700">
                    urgentQueueLength
                    <input 
                        name="urgentQueueLength"
                        type="number" 
                        class="border p-2 rounded w-full" 
                        placeholder="Price"
                        step=1
                        min=0
                        value={data.urgentQueueLength}
                        required 
                    />
                    {#if form?.description === "urgentQueueLength"}
                        <p class="error">{form.error}</p>
                    {/if}
                </label>
            </div>
    
            <div class="mt-4 bg-white p-4 rounded-lg shadow">
                <label class="block text-gray-700">
                    criticalPatients
                    <input 
                        name="criticalPatients"
                        type="number" 
                        class="border p-2 rounded w-full" 
                        placeholder="Price"
                        step=1
                        min=0
                        value={data.criticalPatients}
                        required 
                    />
                    {#if form?.description === "criticalPatients"}
                        <p class="error">{form.error}</p>
                    {/if}
                </label>
            </div>
    
            <div class="mt-4 bg-white p-4 rounded-lg shadow">
                <label class="block text-gray-700">
                    criticalQueueLength
                    <input 
                        name="criticalQueueLength"
                        type="number" 
                        class="border p-2 rounded w-full" 
                        placeholder="Price"
                        step=1
                        min=0
                        value={data.criticalQueueLength}
                        required 
                    />
                    {#if form?.description === "criticalQueueLength"}
                        <p class="error">{form.error}</p>
                    {/if}
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
