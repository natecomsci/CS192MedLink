<script lang="ts">
  // import { Dropdown, DropdownItem, DropdownDivider, DropdownHeader } from 'flowbite-svelte';
  import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
  import { ChevronDownOutline } from 'flowbite-svelte-icons';

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




    <label>
      Service Title
      {#if serviceType == "Ambulance"}
        <p>ambulance init fields</p>
        <label>
          Availability
          <input 
            type="text"
            placeholder="value" 
          >
        </label>
        
      {:else if serviceType == "Blood Bank"}
        <p>bloodBank init fields</p>
      {:else if serviceType == "Emergency Room"}
        <p>er init fields</p>
      {:else if serviceType == "ICU"}
        <p>icu init fields</p>
      {:else if serviceType == "Out Patient"}
        <p>outPatient init fields</p>
      {/if}
    </label>
    <!-- <div
      class="bg-white rounded-md"
    >
      <input 
        name="password" 
        type={show ? "text" : "password"}
        bind:value={password}
        placeholder="Password" 
        required
      >
      <label
        class="text-purple-500 pr-2"
      >
        {show ? "hide" : "show"}
        <input type="button" onclick={() => show = !show}>
      </label>

    </div> -->
      
    <div>
      <button type="submit" class="text-white bg-purple-700 rounded-2xl">Add</button>
      
    </div>
    
  </form>