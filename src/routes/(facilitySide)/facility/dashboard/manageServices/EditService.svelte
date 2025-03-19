<script lang="ts">

  import type { PageProps } from './$types';

  import EditAmbulanceService from './EditAmbulanceService.svelte';
  import EditBloodBankService from './EditBloodBankService.svelte';
  import EditERService from './EditERService.svelte';
  import EditICUService from './EditICUService.svelte';
  import EditOPService from './EditOPService.svelte';
  import { enhance } from '$app/forms';

  let { data, form, currPopUp = $bindable(), currService = $bindable()} = $props();
  let serviceType: String = $state('');
  let division: String = $state('');

//   let serviceType: "Hello";

  import { load } from '$lib/projectArrays';

</script>
 
<div class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
  <div class=" w-11/12 max-w-3/4 rounded-lg  overflow-hidden ">
    <form 
      method="POST" 
      action="?/addService"
      use:enhance
      class="grid grid-cols-1 bg-white m-6 space-y-2 rounded-2xl p-2 shadow drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
    >
      <div class="h-[calc(100vh-100px)] flex bg-gray-100 rounded-2xl">
        <!-- Left Panel -->
        <div class="w-1/3 bg-white p-6 flex flex-col ">
            <div class="flex items-center gap-5">
                <button onclick={() => currPopUp = ''} data-sveltekit-reload>
                  <img src="/back_icon.svg" alt="Back" class="w-6 h-6 cursor-pointer transition-colors duration-200 hover:opacity-70 active:opacity-50"/>
                </button>
                <h1 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900">Edit Service</h1>
            </div>

            <div class=" py-10">
                <h1 class=" text-[25px] font-['DM_Sans'] font-bold text-black">{currService}</h1>
                <h3 class="text-[20px] font-['DM_Sans'] font-bold text-purple-500">Division Name</h3>
            </div>

            <button type="submit" class="mt-auto bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700" data-sveltekit-reload>
                Edit Service
            </button>
        </div>

        <!-- Vertical Divider -->
        <div class="w-[2px] bg-gray-300"></div>

        <!-- Right Panel -->
        <div class="flex-1 p-6 overflow-y-auto  "> 
            <h2 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900">{currService}</h2>
            <label class="grid grid-cols-1">
                {#if form?.error}
                    <p class="error">{form.error}</p>
                {/if}
                {#if currService == "Ambulance"}
                  <EditAmbulanceService {data} {form}/>
                {:else if currService == "Blood Bank"}
                  <EditBloodBankService {data} {form}/>
                {:else if currService == "Emergency Room"}
                  <EditERService {data} {form} />
                {:else if currService == "Intensive Care Unit"}
                  <EditICUService {data} {form}/>
                {:else if currService == "Outpatient"}
                  <EditOPService {data} {form}/>
                {/if}
            </label>
        </div>
      </div>
    </form>
  </div>
</div>
