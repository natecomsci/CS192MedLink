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
          <a href="/facility/dashboard/manageServices" data-sveltekit-reload>
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
        {#if form?.error}
              <p class="error">{form.error}</p>
          {/if}
        <div class="flex-1 p-6 overflow-y-auto border border-green-100">
            <!-- Phone Number -->
            <div class="mt-4 bg-white p-4 rounded-lg shadow">
                <label class="block text-gray-700">Phone No.
                    <input 
                        class="border p-2 rounded w-full" 
                        name="phoneNumber"
                        type="tel"
                        value={data.phoneNumber}
                         
                    />
                </label>
            </div>
    
            <div class="mt-4 bg-white p-4 rounded-lg shadow">
                <label>
                    Load
                    <select name="load" value={data.load}  class="border p-2 rounded w-full">
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
                         
                    />
                </label>
            </div>
    
            <div class="mt-4 bg-white p-4 rounded-lg shadow">
                <label class="block text-gray-700">
                    Non Urgent Patients
                    <input 
                        name="nonUrgentPatients"
                        type="number" 
                        class="border p-2 rounded w-full" 
                        placeholder="Price"
                        step=1
                        min=0
                        value={data.nonUrgentPatients}
                         
                    />
                </label>
            </div>
    
            <div class="mt-4 bg-white p-4 rounded-lg shadow">
                <label class="block text-gray-700">
                    Non Urgent Patients Queue Length
                    <input 
                        name="nonUrgentQueueLength"
                        type="number" 
                        class="border p-2 rounded w-full" 
                        placeholder="Price"
                        step=1
                        min=0
                        value={data.nonUrgentQueueLength}
                         
                    />
                </label>
            </div>
    
            <div class="mt-4 bg-white p-4 rounded-lg shadow">
                <label class="block text-gray-700">
                    Urgent Patients
                    <input 
                        name="urgentPatients"
                        type="number" 
                        class="border p-2 rounded w-full" 
                        placeholder="Price"
                        step=1
                        min=0
                        value={data.urgentPatients}
                         
                    />
                </label>
            </div>
    
            <div class="mt-4 bg-white p-4 rounded-lg shadow">
                <label class="block text-gray-700">
                    Urgent Patients Queue Length
                    <input 
                        name="urgentQueueLength"
                        type="number" 
                        class="border p-2 rounded w-full" 
                        placeholder="Price"
                        step=1
                        min=0
                        value={data.urgentQueueLength}
                         
                    />
                </label>
            </div>
    
            <div class="mt-4 bg-white p-4 rounded-lg shadow">
                <label class="block text-gray-700">
                    Critical Patients
                    <input 
                        name="criticalPatients"
                        type="number" 
                        class="border p-2 rounded w-full" 
                        placeholder="Price"
                        step=1
                        min=0
                        value={data.criticalPatients}
                         
                    />
                </label>
            </div>
    
            <div class="mt-4 bg-white p-4 rounded-lg shadow">
                <label class="block text-gray-700">
                    Critical Patients Queue Length
                    <input 
                        name="criticalQueueLength"
                        type="number" 
                        class="border p-2 rounded w-full" 
                        placeholder="Price"
                        step=1
                        min=0
                        value={data.criticalQueueLength}
                         
                    />
                </label>
            </div>
        </div>


    </label>
  </div>
</div>

</form>
