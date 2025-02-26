<script lang="ts">

  import type { PageProps } from './$types';

  import AmbulanceService from './AmbulanceService.svelte';
  import BloodBankService from './BloodBankService.svelte';
  import ERService from './ERService.svelte';
  import ICUService from './ICUService.svelte';
  import OutpatientService from './OutpatientService.svelte';
  import { enhance } from '$app/forms';

  let { data, form }: PageProps = $props();
  let serviceType: String = $state('');
  let division: String = $state('');

</script>
 
 <form 
    method="POST" 
    action="?/create"
    use:enhance
    class="grid grid-cols-1 bg-gray-400 bg-white m-6 space-y-2 rounded-2xl p-2 shadow  drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
  >
  <div class=" h-[calc(100vh-100px)] flex bg-gray-100 border bg-black border-black">
    <!-- Left Panel (Static) -->
    <div class="w-1/3 bg-white p-6 flex flex-col shadow-md border border-purple-700">
        <div class= "flex items-center">
            <button class="text-2xl mb-4"><a href="../manageServices">⬅️</a></button>
            <h1 class="text-[30px] font-['DM_Sans'] text-[#3D1853] font-bold text-purple-900">Add a Service</h1>
        </div>

        <label class="mt-4 text-gray-700">
          Select a Service
          <select name="serviceType" bind:value={serviceType} required class="border p-2 rounded w-full">
            {#each (data.availableServices ?? []) as service}
              <option value={service} onclick={() => serviceType = service}>{service}</option>
            {/each}
          </select>
        </label>

        <!-- <label class="mt-4 text-gray-700">
          Division
          <select bind:value={division} class="border p-2 rounded w-full">
              <option>Division</option>
              <option>Division 1</option>
              <option>Division 2</option>
          </select>
        </label> -->

        <button class="mt-auto bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700">
            Add Service
        </button>
    </div>

    <!-- Vertical Divider -->
    <div class="w-[2px] bg-gray-300"></div>

    <!-- Right Panel (Scrollable) -->
    <div class="flex-1 p-6 overflow-y-auto border border-green-100">
        <h2 class="text-[30px] font-['DM_Sans'] text-[#3D1853] font-bold text-purple-900">{serviceType}</h2>
        <label
        class="grid grid-cols-1"
      >
        {#if serviceType == "Ambulance"}
          <AmbulanceService {data} {form}/>
        {:else if serviceType == "Blood Bank"}
          <!-- <AmbulanceService/> -->
          <BloodBankService {data} {form}/>
        {:else if serviceType == "Emergency Room"}
          <ERService {data} {form}/>
        {:else if serviceType == "ICU"}
          <ICUService {data} {form}/>
        {:else if serviceType == "Outpatient"}
          <OutpatientService {data} {form}/>
        {/if}
      </label>
    </div>
  </div>
</form>

