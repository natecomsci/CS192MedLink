<script lang="ts">
    export let onClose: () => void = () => {};
  </script>
  
  <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div class="bg-white w-full max-w-sm mx-4 p-6 rounded-xl shadow-xl text-center space-y-4">
      <h2 class="text-xl font-semibold text-red-600">No Database Connection</h2>
      <button
        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        on:click={onClose}
      >
        Close
      </button>
    </div>
  </div>
  