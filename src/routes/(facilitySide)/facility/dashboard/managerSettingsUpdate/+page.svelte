<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageProps } from './$types';

  let { data, form }: PageProps = $props();

  // Fetch the photo URL from data
  let photoUrl = data.photoUrl;

</script>

<div class="flex justify-center items-center min-h-screen bg-gray-100">
  <div class="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
      <!-- Profile Image Upload Form -->
      <form
          method="POST"
          id="updatePhoto"
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
              <p class="text-sm {form?.success ? 'text-green-600' : 'text-red-600'} mb-4">{form?.error}</p>
          {/if}

          <button
              type="submit"
              form="updatePhoto"
              class="w-full py-2 bg-purple-600 text-white font-semibold rounded-lg mb-3 hover:bg-purple-700"
              onclick={() => window.location.reload()}
          >
              Update Profile Picture
          </button>
      </form>

      <!-- Remove Photo Form -->
      <form method="POST" action="?/removePhoto" use:enhance id="removePhoto">
          <button
              type="submit"
              form="removePhoto"
              class="w-full py-2 bg-gray-500 text-white font-semibold rounded-lg mb-3 hover:bg-gray-600"
              onclick={() => window.location.reload()}
          >
              Remove Photo
          </button>
      </form>

      <form></form>


          <!-- Update Button -->
<a
  href="/facility/dashboard/managerSettingsUpdate/changePassword"
  class="w-full py-2 bg-purple-600 text-white font-semibold rounded-lg mb-3 hover:bg-purple-700"
>
  Change Password
</a>


      <!-- Sign Out Form -->
      <form method="POST" action="?/signOut" use:enhance id="signOut">
          <button
              type="submit"
              form="signOut"
              class="w-full py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
          >
              Sign Out
          </button>
      </form>
  </div>
</div>
