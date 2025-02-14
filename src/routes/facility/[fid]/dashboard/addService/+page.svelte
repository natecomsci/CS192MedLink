<script lang="ts">
  // import { Dropdown, DropdownItem, DropdownDivider, DropdownHeader } from 'flowbite-svelte';
  import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
  import { ChevronDownOutline } from 'flowbite-svelte-icons';

  import type { PageProps } from './$types';

  import Ambulance from './Ambulance.svelte';
  import BloodBank from './BloodBank.svelte';
  import ER from './ER.svelte';
  import ICU from './ICU.svelte';
  import OutPatient from './OutPatient.svelte';



  let { data }: PageProps = $props();

  let serviceType: String = $state('Select Service')

  function changeServiceType (service: String) {
    serviceType = service;
    console.log(serviceType);
  }
</script>

<h1 class="text-3xl font-bold underline">
  Add Service
</h1>


<form 
    method="POST"
    class="grid grid-cols-1 bg-gray-400 m-6 space-y-2 rounded-2xl p-6"
  >
    <label>
      Service to Offer
      <Button>{serviceType}<ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white" /></Button>
      <Dropdown>
        <DropdownItem on:click={() => changeServiceType("Ambulance")}>Ambulance</DropdownItem>
        <DropdownItem on:click={() => changeServiceType("Blood Bank")}>Blood Bank</DropdownItem>
        <DropdownItem on:click={() => changeServiceType("Emergency Room")}>Emergency Room</DropdownItem>
        <DropdownItem on:click={() => changeServiceType("ICU")}>ICU</DropdownItem>
        <DropdownItem on:click={() => changeServiceType("Out Patient")}>Out Patient</DropdownItem>
      </Dropdown>
    </label>

    <label
      class="grid grid-cols-1"
    >
      {#if serviceType == "Ambulance"}
        <Ambulance {serviceType}/>
      {:else if serviceType == "Blood Bank"}
        <BloodBank {serviceType}/>
      {:else if serviceType == "Emergency Room"}
        <ER {serviceType}/>
      {:else if serviceType == "ICU"}
        <ICU {serviceType}/>
      {:else if serviceType == "Out Patient"}
        <OutPatient {serviceType}/>
      {/if}
    </label>

    <div class="flex justify-end p-2">
      <button type="submit" class="text-white bg-purple-700 rounded-2xl p-2 m-2">Add</button>
      <a href="../dashboard" class="text-black bg-gray-100 rounded-2xl p-2 m-2">Cancel</a>

    </div>
    
  </form>