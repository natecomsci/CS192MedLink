<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageProps } from './$types';
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

          <h1 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900">Edit Blood Bank Service</h1>
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
                    value={data.pricePerUnit}
                    required
                />
                {#if form?.description === "price"}
                    <p class="error">{form.error}</p>
                {/if}
            </label>
        </div>

        <!-- Turnaround Time -->
        <div class="mt-4 bg-white p-4 rounded-lg shadow">
            <label class="block text-gray-700 ">Turnaround Time
                <div class="flex items-center gap-2">

                    <input 
                        type="number" 
                        name="turnaroundDays"
                        class="border p-2 rounded  w-30" 
                        placeholder="Days" 
                        value={data.turnaroundTimeD} 
                        required 
                    />
                    Days
                
                    <input 
                        type="number" 
                        name="turnaroundHours"
                        class="border p-2 rounded  w-30" 
                        placeholder="Hours" 
                        value={data.turnaroundTimeH}
                        required
                    />
                    Hours
                </div>
                {#if form?.description === "turnaround"}
                    <p class="error">{form.error}</p>
                {/if}
            </label>
        </div>

        <div class="mt-4 bg-white p-4 rounded-lg shadow">
            <label>
                Blood Type Availability
                <label>
                  A+
                  <input 
                    name="ap" 
                    type="checkbox"
                    checked={data.bloodTypeAvailability?.A_P}
                  >
                </label>
                <label>
                  A-
                  <input 
                    name="an" 
                    type="checkbox"
                    checked={data.bloodTypeAvailability?.A_N}
                  >
                </label>
                <label>
                  B+
                  <input 
                    name="bp" 
                    type="checkbox"
                    checked={data.bloodTypeAvailability?.B_P}
                  >
                </label>
                <label>
                  B-
                  <input 
                    name="bn" 
                    type="checkbox"
                    checked={data.bloodTypeAvailability?.B_N}
                  >
                </label>
                <label>
                  O+
                  <input 
                    name="op" 
                    type="checkbox"
                    checked={data.bloodTypeAvailability?.O_P}
                  >
                </label>
                <label>
                  O-
                  <input 
                    name="on" 
                    type="checkbox"
                    checked={data.bloodTypeAvailability?.O_N}
                  >
                </label>
                <label>
                  AB+
                  <input 
                    name="abp" 
                    type="checkbox"
                    checked={data.bloodTypeAvailability?.AB_P}
                  >
                </label>
                <label>
                  AB-
                  <input 
                    name="abn" 
                    type="checkbox"
                    checked={data.bloodTypeAvailability?.AB_N}
                  >
                </label>
                
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
