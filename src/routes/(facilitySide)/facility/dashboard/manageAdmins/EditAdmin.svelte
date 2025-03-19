<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData, ActionData } from './$types';

  let { firstname, middlename, lastname, form, adminID, currPopUp = $bindable()}: {firstname: String, middlename: String | null, lastname: String, form: ActionData, adminID: String, currPopUp: String} = $props();

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
                <h1 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900">Edit Admin</h1>
            </div>

            <div class=" py-10">
                <h1 class=" text-[25px] font-['DM_Sans'] font-bold text-black">{middlename ? firstname + ' ' + middlename + ' ' + lastname : firstname + ' ' + lastname}</h1>
                <!-- <h3 class="text-[20px] font-['DM_Sans'] font-bold text-purple-500">Division Name</h3> -->
            </div>

            <button form="editAdmin" type="submit" class="mt-auto bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700" data-sveltekit-reload>
                Edit Admin
            </button>
        </div>

        <!-- Vertical Divider -->
        <div class="w-[2px] bg-gray-300"></div>

        <!-- Right Panel -->
        <div class="flex-1 p-6 overflow-y-auto  "> 
          <h2 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900">{middlename ? firstname + ' ' + middlename + ' ' + lastname : firstname + ' ' + lastname}</h2>
          <div class="grid grid-cols-1">
            <form
              id="editAdmin"
              method="POST" 
              action="?/editAdmin"
              use:enhance={() => {
                return async ({ update }) => {
                  await update({invalidateAll:true});
                  if (form?.success) {
                      currPopUp = ''
                  }
                };
              }}
            >
              Edit Admin Page
              {#if form?.error}
                  <p class="text-red-500 text-sm font-semibold">{form?.error}</p>
              {/if}
              <input type="hidden" name="adminID" value="{adminID}" />
              <input type = "text" name = "fname" class="border-black border-2" value={firstname}>
              <input type = "text" name = "mname" class="border-black border-2" value={middlename}>
              <input type = "text" name = "lname" class="border-black border-2" value={lastname}>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
