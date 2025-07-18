<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageProps } from './$types';

  let { data, form }: PageProps = $props();
  let photoUrl = data.photoUrl;

    import { writable } from 'svelte/store';
    
    let fileInput: HTMLInputElement | null = null;
    let imageSrc = writable<string | null>(photoUrl ?? null);
  
    function openFileDialog() {
      fileInput?.click();
    }
  
    function handleFileChange(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        imageSrc.set(URL.createObjectURL(file));
      }
    }
  
    function removeImage() {
      imageSrc.set(null);
      if (fileInput) fileInput.value = '';
    }
</script>


  
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="bg-background p-8 rounded-xl shadow-xl w-full max-w-md text-center space-y-6">
      <!-- Heading -->
      <h1 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900 mb-2">Settings</h1>
  
      <!-- 🖼️ Profile Photo Form -->
      <form
        method="POST"
        action="?/updatePhoto"
        enctype="multipart/form-data"
        use:enhance
        id="updatePhoto"
        class="space-y-4"
      >
        <!-- Image Container -->
        <div class="relative group w-40 h-40 mx-auto rounded-xl overflow-hidden bg-black shadow-md cursor-pointer">
          {#if $imageSrc}
            <img
              src={$imageSrc}
              alt="Profile"
              class="w-full h-full object-cover transition-opacity duration-300"
            />
          {:else}
            <div class="flex items-center justify-center w-full h-full text-white text-sm">No Image</div>
          {/if}
  
          <!-- Hover Overlay -->
          <button
            class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 text-white text-sm font-semibold"
            onclick={openFileDialog}
          >
            Change Image
          </button>
  
          <!-- Remove Button -->
          {#if $imageSrc}
            <button
              type="button"
              class="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-red-600 text-white rounded-full px-2 py-0.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              onclick={removeImage}
            >
              ✖
            </button>
          {/if}
  
          <!-- Hidden File Input -->
          <input
            type="file"
            name="employeeImage"
            accept="image/*"
            bind:this={fileInput}
            class="hidden"
            onchange={handleFileChange}
          />
        </div>
  
        {#if form?.error}
          <p class="text-sm {form?.success ? 'text-green-600' : 'text-red-600'}">{form.error}</p>
        {/if}
  
        <button
          type="submit"
          form="updatePhoto"
          class="w-full py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
        >
          Update Profile Picture
        </button>
      </form>
  
      <!--  Change Password -->
      <a
        href="/facility/dashboard/settings/changePassword"
        class="block w-full py-2 border text-purple-600 font-semibold rounded-lg hover:bg-purple-100 transition"
      >
        Change Password
      </a>
  
      <!-- Sign Out -->
      <form method="POST" action="?/signOut" use:enhance id="signOut">
        <button
          type="submit"
          form="signOut"
          class="w-full py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
        >
          Sign Out
        </button>
      </form>
    </div>
  </div>
  