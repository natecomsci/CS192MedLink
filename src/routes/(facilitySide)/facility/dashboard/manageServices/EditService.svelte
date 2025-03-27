<script lang="ts">
    import type { ServiceDTO } from '$lib';
  import type { PageData, ActionData } from './$types';

  import EditAmbulanceService from './EditAmbulanceService.svelte';
  import EditBloodBankService from './EditBloodBankService.svelte';
  import EditERService from './EditERService.svelte';
  import EditICUService from './EditICUService.svelte';
  import EditOPService from './EditOPService.svelte';

  let { data, form, serviceType, serviceID, currPopUp = $bindable(), services = $bindable() }: {data: PageData, form: ActionData, serviceType: String, serviceID: String, currPopUp: String, services: ServiceDTO[]} = $props();

</script>
<div class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
  <div class=" w-11/12 max-w-3/4 rounded-lg  overflow-hidden ">
    <div class="grid grid-cols-1 bg-white m-6 space-y-2 rounded-2xl p-2 shadow drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
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
                <h1 class=" text-[25px] font-['DM_Sans'] font-bold text-black">{serviceType}</h1>
                <!-- <h3 class="text-[20px] font-['DM_Sans'] font-bold text-purple-500">Division Name</h3> -->
            </div>

            <button form="editService" type="submit" class="mt-auto bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700" data-sveltekit-reload>
                Edit Service
            </button>
        </div>

        <!-- Vertical Divider -->
        <div class="w-[2px] bg-gray-300"></div>

        <!-- Right Panel -->
        <div class="flex-1 p-6 overflow-y-auto  "> 
          <h2 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900">{serviceType}</h2>
          <label class="grid grid-cols-1">
              {#if serviceType == "Ambulance"}
                <EditAmbulanceService 
                  { form }
                  { serviceID }
                  bind:currPopUp={currPopUp}
                  bind:services={services}
                />
              {:else if serviceType == "Blood Bank"}
                <EditBloodBankService
                  { form }
                  { serviceID }
                  bind:currPopUp={currPopUp}
                  bind:services={services}
                />
              {:else if serviceType == "Emergency Room"}
                <EditERService
                  { form }
                  { serviceID }
                  bind:currPopUp={currPopUp}
                  bind:services={services}
                />
              {:else if serviceType == "Intensive Care Unit"}
                <EditICUService
                  { form }
                  { serviceID }
                  bind:currPopUp={currPopUp}
                  bind:services={services}
                />
              {:else}
                <EditOPService
                  { form }
                  { serviceID }
                  bind:currPopUp={currPopUp}
                  bind:services={services}
                />
              {/if}
          </label>
        </div>
      </div>
    </div>
  </div>
</div>
