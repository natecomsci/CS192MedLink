<script>
    import { createEventDispatcher } from "svelte";
  
    export let serviceID;
    export let serviceType;
    const dispatch = createEventDispatcher();
  
    function closeModal() {
      console.log("trying to close")
      dispatch("close");
    }
  
    function confirmDelete() {
      document.getElementById("deleteForm").submit();
      closeModal();
    }
</script>
  
<!-- Modal Overlay -->
<div class="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
<div class="bg-white p-6 rounded shadow-lg w-80">
    <h2 class="text-lg font-bold">Confirm Deletion</h2>
    <p>Are you sure you want to delete this service?</p>

    <!-- Hidden Form for Deletion -->
    <form id="deleteForm" method="POST" action="?/deleteService">
    <input type="hidden" name="serviceID" value="{serviceID}" />
    <input type="hidden" name="serviceType" value="{serviceType}" />
    </form>

    <!-- Buttons -->
    <div class="flex justify-end space-x-2 mt-4">
    <button class="px-4 py-2 bg-gray-300 rounded" onclick={closeModal}>Cancel</button>
    <button class="px-4 py-2 bg-red-600 text-white rounded" onclick={confirmDelete}>Confirm</button>
    </div>
</div>
</div> 