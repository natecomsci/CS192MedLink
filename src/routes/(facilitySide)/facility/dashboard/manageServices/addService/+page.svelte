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
    action="?/addService"
    use:enhance
    class="grid grid-cols-1 bg-gray-400 m-6 space-y-2 rounded-2xl p-2 shadow  drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
  >
  <div class=" h-[calc(100vh-100px)] flex bg-gray-100 border border-black">
    <!-- Left Panel (Static) -->
    <div class="w-1/3 bg-white p-6 flex flex-col shadow-md border border-purple-700">
        <div class= "flex items-center gap-5">
            <!-- <button class="text-2xl mb-4"><a href="../manageServices">⬅️</a></button> -->
            <a href="../manageServices" data-sveltekit-reload>
              <img src="/back_icon.svg" alt="Back" class="w-6 h-6 cursor-pointer transition-colors duration-200 hover:opacity-70 active:opacity-50"/>
            </a>
            <h1 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900">Add a Service</h1>
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

        <button type="submit" class="mt-auto bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700" data-sveltekit-reload>
            Add Service
        </button>
    </div>

    <!-- Vertical Divider -->
    <div class="w-[2px] bg-gray-300"></div>

    <!-- Right Panel (Scrollable) -->
    <div class="flex-1 p-6 overflow-y-auto border border-green-100">
        <h2 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900">{serviceType}</h2>
        <label
        class="grid grid-cols-1"
      >
        {#if form?.error}
            <p class="error">{form.error}</p>
        {/if}
        {#if serviceType == "Ambulance"}
          <AmbulanceService />
        {:else if serviceType == "Blood Bank"}
          <!-- <AmbulanceService/> -->
          <BloodBankService/>
        {:else if serviceType == "Emergency Room"}
          <ERService />
        {:else if serviceType == "Intensive Care Unit"}
          <ICUService />
        {:else if serviceType == "Outpatient"}
          <OutpatientService {data} {form}/>
        {/if}
      </label>
    </div>
  </div>
</form>
