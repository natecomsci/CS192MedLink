<script lang="ts">

  import type { PageProps } from './$types';

  import Ambulance from './Ambulance.svelte';
  import AmbulanceService from './AmbulanceService.svelte';
  import BloodBank from './BloodBank.svelte';
  import ER from './ER.svelte';
  import ICU from './ICU.svelte';
  import Outpatient from './Outpatient.svelte';

  let { data }: PageProps = $props();

  let serviceType: String = $state('');
  let division: String = $state('');
</script>
<!-- 
<h1 class="text-3xl font-bold underline">
  Add Service
</h1>

<h3>{serviceType}</h3>
 -->
<form 
    method="POST"
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
            <option value="Ambulance" onclick={() => serviceType = "Ambulance"}>Ambulance</option>
            <option value="Blood Bank" onclick={() => serviceType = "Blood Bank"}>Blood Bank</option>
            <option value="Emergency Room" onclick={() => serviceType = "Emergency Room"}>Emergency Room</option>
            <option value="ICU" onclick={() => serviceType = "ICU"}>ICU</option>
            <option value="Outpatient" onclick={() => serviceType = "Outpatient"}>Outpatient</option>
          </select>
        </label>

        <label class="mt-4 text-gray-700">
          Division
          <select bind:value={division} required class="border p-2 rounded w-full">
              <option>Division</option>
              <option>Division 1</option>
              <option>Division 2</option>
          </select>
        </label>

        <button class="mt-auto bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700">
            Add Service
        </button>
    </div>

    <!-- Vertical Divider -->
    <div class="w-[2px] bg-gray-300"></div>

    <!-- Right Panel (Scrollable) -->
    <div class="flex-1 p-6 overflow-y-auto border border-green-100">
        <h2 class="text-[30px] font-['DM_Sans'] text-[#3D1853] font-bold text-purple-900">Service Name Attributes</h2>
        <label
        class="grid grid-cols-1"
      >
        {#if serviceType == "Ambulance"}
          <AmbulanceService/>
        {:else if serviceType == "Blood Bank"}
          <BloodBank/>
        {:else if serviceType == "Emergency Room"}
          <ER/>
        {:else if serviceType == "ICU"}
          <ICU/>
        {:else if serviceType == "Outpatient"}
          <Outpatient />
        {/if}
      </label>
    </div>
  </div>
</form>

