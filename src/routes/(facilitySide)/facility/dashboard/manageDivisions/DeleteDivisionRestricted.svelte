<script>
    let { currPopUp = $bindable() } = $props();
</script>
  
<!-- Modal Overlay -->
<div class="fixed inset-0 bg-black/30 bg-opacity-10 flex items-center justify-center z-50">
<div class="bg-background p-6 rounded shadow-lg w-80">
    <h2 class="text-lg font-bold">Cant Delete</h2>
    <p>Must have atleast one division</p>

    <!-- Buttons -->
    <div class="flex justify-end space-x-2 mt-4">
    <button class="px-4 py-2 bg-gray-300 rounded" onclick={() => {currPopUp = ''}}>Back</button>
    </div>
</div>
</div> 