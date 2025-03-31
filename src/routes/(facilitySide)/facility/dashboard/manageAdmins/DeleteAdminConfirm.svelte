<script lang="ts">
  import type { ActionData, PageData } from "./$types";
  import { enhance } from "$app/forms";

  import type { AdminDTO } from "$lib";
  import { adminPagingHandler } from '$lib/postHandlers';

  let { data, 
        form, 
        adminID, 
        currPopUp = $bindable(), 
        admins = $bindable(),
        currentPage = $bindable(),
        totalPages = $bindable(),
      }:{ data: PageData, 
          form: ActionData, 
          adminID: String, 
          currPopUp: String, 
          admins: AdminDTO[],
          currentPage: number,
          totalPages: number,
        } = $props();

  async function getNewAdmins() {
    try {
      const rv = await adminPagingHandler({
        query: '',
        isInQueryMode:false,
        currentPage:1,
        change:0,
        totalPages:1,
      });
      admins =  rv.admins
      currentPage = 1
      totalPages = rv.totalPages
    } catch (error) {
      console.log((error as Error).message)
    }
  }
</script>

<!-- Modal Overlay -->
<div class="fixed inset-0 bg-black/30 bg-opacity-10 flex items-center justify-center z-50">
  <div class="bg-white p-6 rounded shadow-lg w-80">
    <h2 class="text-lg font-bold">Confirm Deletion</h2>
    <p>Are you sure you want to delete this admin?</p>

    <form id="deleteForm" method="POST" action="?/deleteAdmin" 
      use:enhance={() => {
        return async ({ update }) => {
          await update({invalidateAll:true});
          if (form?.success) {
              currPopUp = ''
              getNewAdmins()
          }
        };
      }}
    >
        {#if form?.error}
          <p class="text-red-500 text-sm font-semibold">{form.error}</p>
        {/if}
        <input type="hidden" name="adminID" value="{adminID}" />

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
