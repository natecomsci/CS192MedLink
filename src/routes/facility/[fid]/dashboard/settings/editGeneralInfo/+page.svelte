<script lang="ts">
  import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
  import { ChevronDownOutline } from 'flowbite-svelte-icons';

  let region: String = $state('Select Region')

</script>

<h1 class="text-3xl font-bold underline">
  Edit General Info
</h1>


<form
  class="grid grid-cols-1 bg-gray-400 m-6 space-y-2 rounded-2xl p-6"
>
  
  <label>
    Facility Photo
    <input type="file" class="text-white bg-purple-700 rounded-2xl p-2 m-2">
  </label>

  <label>
    Location
    <div class="grid grid-cols-1">

      <Button>{region}<ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white" /></Button>
      <Dropdown>
          <DropdownItem on:click={() => region = "NCR"}>NCR</DropdownItem>
        
      </Dropdown>
    </div>
    
  </label>

</form>