<script lang="ts">
  import type { ActionData, PageData } from './$types';
  import { enhance } from '$app/forms';

  let { form, currPopUp = $bindable() }: { form: ActionData, currPopUp: String } = $props();
</script>
 
<div class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
  <div class=" w-11/12 max-w-3/4 rounded-lg  overflow-hidden ">
    <form 
      method="POST" 
      action="?/addDivision"
      use:enhance={() => {
        return async ({ update }) => {
          await update({invalidateAll:true});
          if (form?.success) {
              currPopUp = ''
          }
        };
      }}
      class="grid grid-cols-1 bg-white m-6 space-y-2 rounded-2xl p-2 shadow drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
    >
      <div class="h-[calc(100vh-100px)] flex bg-gray-100 rounded-2xl">
        <!-- Left Panel -->
        <div class="w-3/5  bg-white p-6 flex flex-col gap-3 ">
          <!-- Back Button & Heading -->
          <div class="flex items-center gap-5">
              <button onclick={() => currPopUp = ''} data-sveltekit-reload type="button">
                <img src="/back_icon.svg" alt="Back" class="w-6 h-6 cursor-pointer transition-colors duration-200 hover:opacity-70 active:opacity-50"/>
              </button>
              <h1 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900">Create a Division</h1>
          </div>

          <!-- Division Name -->
          <label class="mt-5">
            <span class="text-label">Division Name</span>
            <input class = "input-box" type = "text" name = "name" placeholder="Divison Name">
          </label>

          
          <div class="grid grid-cols-2 gap-5 items-center">
              <!-- Contact Number -->
              <label class="flex flex-col">
                  <span class="text-label">Contact No.</span>
                  <input 
                      class="input-box w-full" 
                      type="text" 
                      name="phoneNumber" 
                      placeholder="Contact No."
                  >
              </label>

              <!-- Hours of Operation -->
              <label class="flex flex-col">
                  <span class="text-label">Hours of Operation</span>
                  <div class="flex items-center space-x-2">
                      <input 
                          class="input-box w-30"
                          name="opening"
                          type="time"
                          value="08:00"
                      >
                      <span class="text-label">to</span>
                      <input 
                          class="input-box w-30"
                          name="closing"
                          type="time"
                          value="16:00"
                      >
                  </div>
              </label>
          </div>

          <label class="">
            <span class="text-label">Link a Service</span>
            <select name="serviceType" class="input-box rounded w-full">
              {#each Array(5)}
                <option>Services</option>
              {/each}
            </select>

            <button type="submit" class="mt-2 font-semibold text-purple-500 rounded-lg hover:text-purple-200" data-sveltekit-reload>
            + Create New Service
            </button>
          </label>



          
          <!-- Add Division Button -->
          <button type="submit" class="mt-auto bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700" data-sveltekit-reload>
              Add Division
          </button>




        </div>

        <!-- Vertical Divider -->
        <div class="w-[2px] bg-gray-300"></div>

        <!-- Right Panel -->
        <div class="flex-1 p-6 overflow-y-auto  "> 
            <h2 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900">Division Services</h2>
            <label class="grid grid-cols-1">
              {#each Array(10)}
              <div class="card flex items-center justify-between">
                <h2 class="text-label">Service Name</h2>

                <button onclick={() => {}} class="inline-flex items-center" data-sveltekit-reload>
                  <img src="/x.svg" alt="Edit" class="w-4 h-4 cursor-pointer hover:opacity-80" />
                </button>

              </div>
              {/each}
            </label>
        </div>

      </div>
    </form>
  </div>
</div>
