<script lang="ts">
    import { enhance } from "$app/forms";
    import type { ServiceDTO } from "$lib/server/DTOs";
    import type { ActionData } from "./$types";

    let { form, serviceType, serviceID, currPopUp = $bindable(), services = $bindable()}: {form: ActionData, serviceType: String, serviceID: String, currPopUp: String, services: ServiceDTO[]} = $props();

    async function getNewServicePage() {
   
    const body = JSON.stringify({currPage: 1, change: 0});

    try {
      const response = await fetch("./manageServices/servicePagingHandler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      services = await response.json();
      
    } catch (error) {
      throw new Error(`Response status: ${error}`);
    }
  }
  
</script>

<!-- Modal Overlay -->
<div class="fixed inset-0 bg-black/30 bg-opacity-10 flex items-center justify-center z-50">
  <div class="bg-white p-6 rounded shadow-lg w-80">
      <h2 class="text-lg font-bold">Confirm Deletion</h2>
      <p>Are you sure you want to delete this service?</p>

      <!-- Hidden Form for Deletion -->
      <form id="deleteForm" method="POST" action="?/deleteService" 
        use:enhance={() => {
          return async ({ update }) => {
            await update({invalidateAll:true});
            if (form?.success) {
                currPopUp = ''
                getNewServicePage()
            }
          };
        }}
      >
            {#if form?.error}
              <p class="text-red-500 text-sm font-semibold">{form.error}</p>
            {/if}
          <input type="hidden" name="serviceID" value="{serviceID}" />
          <input type="hidden" name="serviceType" value="{serviceType}" />

          <!-- Password Field -->
          <div class="mt-4">
              <label for="password" class="block text-sm font-medium text-gray-700">Enter Password:</label>
              <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  class="mt-1 block w-full p-2 border rounded border-gray-300 focus:outline-none focus:ring focus:border-blue-500" 
                  required 
              />
          </div>
        <div class="flex justify-end space-x-2 mt-4">
            <button class="px-4 py-2 bg-gray-300 rounded" onclick={() => {currPopUp = ''}} type="button">Cancel</button>
            <button class="px-4 py-2 bg-red-600 text-white rounded" type="submit">Confirm</button>
        </div>
      </form>
  </div>
</div>
