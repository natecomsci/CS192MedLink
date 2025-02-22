<script lang="ts">

  import type { PageProps } from './$types';

  import Ambulance from './Ambulance.svelte';
  import BloodBank from './BloodBank.svelte';
  import ER from './ER.svelte';
  import ICU from './ICU.svelte';
  import Outpatient from './Outpatient.svelte';

  let { data }: PageProps = $props();

  let serviceType: String = $state('');

</script>

<h1 class="text-3xl font-bold underline">
  Add Service
</h1>

<h3>{serviceType}</h3>

<form 
    method="POST"
    class="grid grid-cols-1 bg-gray-400 m-6 space-y-2 rounded-2xl p-6"
  >
    <label>
      Service Type to Offer: 
      <select name="serviceType" bind:value={serviceType} required>
        <option value="Ambulance" onclick={() => serviceType = "Ambulance"}>Ambulance</option>
        <option value="Blood Bank" onclick={() => serviceType = "Blood Bank"}>Blood Bank</option>
        <option value="Emergency Room" onclick={() => serviceType = "Emergency Room"}>Emergency Room</option>
        <option value="ICU" onclick={() => serviceType = "ICU"}>ICU</option>
        <option value="Outpatient" onclick={() => serviceType = "Outpatient"}>Outpatient</option>
      </select>
    </label>

    <label
      class="grid grid-cols-1"
    >
      {#if serviceType == "Ambulance"}
        <Ambulance/>
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

    <div class="flex justify-end p-2">
      <button type="submit" class="text-white bg-purple-700 rounded-2xl p-2 m-2">Add</button>
      <a href="../../dashboard" class="text-black bg-gray-100 rounded-2xl p-2 m-2">Cancel</a>

    </div>
    
  </form>