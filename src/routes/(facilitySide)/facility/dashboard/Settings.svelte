<script lang="ts">

    let {currPopUp = $bindable()}:{currPopUp: String;} = $props();
</script>

<div class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
  <div class=" w-11/12 max-w-3/4 rounded-lg  overflow-hidden ">
    <div 
      class="grid grid-cols-1 bg-white m-6 space-y-2 rounded-2xl shadow drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
    >
      <div class="h-[calc(100vh-100px)] flex bg-gray-100 rounded-2xl">

        <!-- Left Panel -->
          <div class="w-1/3 bg-white p-6 flex flex-col rounded-l-2xl">
            <div class="flex items-center gap-5">
                <button onclick={() => currPopUp = ''} type="button">
                  <img src="/back_icon.svg" alt="Back" class="w-6 h-6 cursor-pointer transition-colors duration-200 hover:opacity-70 active:opacity-50"/>
                </button>
                <h1 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900">Add a Service</h1>
            </div>

            <label class="mt-5">
              <span class="text-label">Select a Service</span>
     
            </label>



          <button type="submit" class="mt-auto bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700" data-sveltekit-reload>
              Add Service
          </button>
        </div>


      </div>
    </div>
  </div>
</div>
