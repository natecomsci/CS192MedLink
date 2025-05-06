<script lang="ts">
    let {currPopUp = $bindable()}:{currPopUp: String;} = $props();

      // Function to open the file manager

  // For Image Uploading and Previewing
  import { writable } from "svelte/store";

  let fileInput: HTMLInputElement | null = null;
  let imageSrc = writable<string | null>(null);

  // Function to open the file manager
  function openFileDialog() {
    fileInput?.click();
  }

  function removeImage() {
    return ; // Clear the image source
  }

  // Function to update the image preview
  function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      imageSrc.set(URL.createObjectURL(file)); // Generate temporary preview
    }
  }
</script>

<div class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
  <div class="w-3/10 bg-white max-w-3/4 rounded-lg overflow-hidden pb-10">
    <!-- Label & Icon -->
    <div class="flex items-center gap-5 pl-6 pr-6 pt-3 pb-3">
        <button onclick={() => currPopUp = ''} type="button">
          <img src="/cuteX_icon.svg" alt="Back" class="w-6 h-6 cursor-pointer transition-colors duration-200 hover:opacity-70 active:opacity-50"/>
        </button>
        <h1 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900 ">Settings</h1>
    </div>

    <div class=" items-center justify-center gap-4 flex flex-col ">
      
          <!-- Profile Image Upload Form -->
          <form
              method="POST"
              id="updatePhoto"
              action="?/updatePhoto"
              class="text-left"
              enctype="multipart/form-data"
          >
          
              <!-- Image Container -->
              <div class="relative group h-70 w-70 overflow-hidden rounded-xl cursor-pointer bg-black">
                {#if imageSrc}
                  <img src={$imageSrc} alt="Facility" class="h-50 w-50 object-cover transition-opacity duration-300" />
                {/if}

                <!-- Hover Overlay (Opens File Manager) -->
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 text-white text-lg font-semibold"
                    onclick={openFileDialog}
                >
                    Change Image
                </div>

                <!-- Remove Image Button (Visible on Hover) -->
                {#if imageSrc}
                <button class="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-red-600 text-white rounded-full p-1 text-xs opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        onclick={()=> {removeImage();}}
                    >
                    ✖
                  </button>
                {/if}

                <!-- Hidden File Input -->
                <input type="file" name="employeeImage" accept="image/*" bind:this={fileInput} class="hidden" onchange={handleFileChange} />
              </div>
              
              <!-- {#if form?.error}
                  <p class="text-sm {form?.success ? 'text-green-600' : 'text-red-600'} mb-4">{form?.error}</p>
              {/if} -->
    
          </form>

          <!-- Update Button -->
          <span class="p-3 border w-70 text-center text-primary-500 font-regular rounded-lg hover:bg-primary-400 hover:underline">
            <a
              href="/facility/dashboard/settings/changePassword"
              >
              Change Password
            </a>
          </span>
      
      
          <!-- Sign Out Form -->
          <form method="POST" 
                action="?/signOut"
                class = "w-70" >
              <button
                  type="submit"
                  form="signOut"
                  class="w-full p-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
              >
                  Sign Out
              </button>
          </form>
    </div>
  </div>
</div>
