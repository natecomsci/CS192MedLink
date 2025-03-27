<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import type { PageProps } from './$types';

  let { data, form }: PageProps = $props();

  // Fetch the photo URL from data
  let photoUrl = data.photoUrl;

  let message = form?.message ?? null;
  let success = form?.success ?? false;
</script>

<div class="flex justify-center items-center min-h-screen bg-gray-100">
  <div class="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
      <!-- Profile Image Upload Form -->
      <form
          method="POST"
          action="?/updatePhoto"
          class="text-left"
          use:enhance
          enctype="multipart/form-data"
      >
          <!-- Image Container -->
          <div class="relative group w-full h-32 overflow-hidden rounded-full border cursor-pointer mb-4">
              <img
                  src={photoUrl || "/default-avatar.png"}
                  alt="Profile"
                  class="w-full h-full object-cover transition-opacity duration-300"
              />
          </div>

          <!-- File Input -->
          <input
              type="file"
              name="employeeImage"
              accept="image/*"
              class="w-full p-2 border rounded mb-4"
          />
          {#if form?.error}
              <p class="error text-red-600">{form.error}</p>
          {/if}

          <!-- Feedback Messages -->
          {#if message}
              <p class="text-sm {success ? 'text-green-600' : 'text-red-600'} mb-4">{message}</p>
          {/if}

          <!-- Update Button -->
          <button
              type="submit"
              class="w-full py-2 bg-purple-600 text-white font-semibold rounded-lg mb-3 hover:bg-purple-700"
              onclick={() => window.location.reload()}
          >
              Update Profile Picture
          </button>
      </form>

      <!-- Remove Photo Form -->
      <form method="POST" action="?/removePhoto" use:enhance>
          <button
              type="submit"
              class="w-full py-2 bg-gray-500 text-white font-semibold rounded-lg mb-3 hover:bg-gray-600"
              onclick={() => window.location.reload()}
          >
              Remove Photo
          </button>
      </form>

      <form></form>


          <!-- Update Button -->
<!-- Update Password Button (Redirect Only) -->
<button
    type="button"
    class="w-full py-2 bg-purple-600 text-white font-semibold rounded-lg mb-3 hover:bg-purple-700"
    onclick={() => window.location.href = '/facility/dashboard/managerSettingsUpdate/changePassword'}
>
    Change Password
</button>


      <!-- Sign Out Form -->
      <form method="POST" action="?/signOut" use:enhance>
          <button
              type="submit"
              class="w-full py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
          >
              Sign Out
          </button>
      </form>
  </div>
</div>
