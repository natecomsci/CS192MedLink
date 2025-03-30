<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData, ActionData } from './$types';

  let {firstname, lastname, form, adminID, currPopUp = $bindable(), ResetPW = $bindable()}: {firstname: String, lastname: String, form: ActionData, adminID: String, currPopUp: String, ResetPW: Boolean} = $props();

  let middlename = $state('')
  let divisions = $state([])

  async function getData() {
    const body = JSON.stringify({adminID});

    try {
      const response = await fetch("./manageAdmins/adminInfoHandler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const rv = await response.json();
      console.log(rv)

      middlename = rv.mname
      divisions = rv.divisions
      
    } catch (error) {
      throw new Error(`Response status: ${error}`);
    }
  }
  getData()

  let showNewPassword = $state(false)
  let newPassword = $state('')
  let passwordConfirmation = $state('')

  let errorShown = $state('')

  async function resetPassword() {
    const body = JSON.stringify({adminID, passwordConfirmation});

    try {
      const response = await fetch("./manageAdmins/resetPasswordHandler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const rv = await response.json();

      if (typeof rv === 'string') {
        newPassword = rv
        showNewPassword = true
      } else {
        errorShown = rv.error
      }
      
    } catch (error) {
      throw new Error(`Response status: ${error}`);
    }
  }

  const { ad } = ({
      ad: {
          name: "Admin 1",
          id: "1234567891011",
          profilePicture: "https://via.placeholder.com/50", // Replace with actual image
          departments: ["Department 1", "Department 1", "Department 1", "Department 1", "Department 1"]
      }
  });
</script>


<div class="fixed inset-0 bg-black/50 flex items-center z-51">
  <div class="min-h-[500px] max-w-3xl mx-auto p-10 bg-white rounded-[50px] shadow-md flex flex-col">
    <div class="flex items-center gap-5">
        <button onclick={() => ResetPW = false} data-sveltekit-reload type="button">
            <img src="/back_icon.svg" alt="Back" class="w-6 h-6 cursor-pointer transition-colors duration-200 hover:opacity-70 active:opacity-50"/>
        </button>
        <h3 class=" text-gray-800 text-[25px] font-black">Reset Password</h3>
    </div>

    <label class="mt-5">
        <span class = "text-label">Confirm Password to Reset</span>
        <input type = "text" name = "passwordConfirmation" class="input-box" bind:value={passwordConfirmation} placeholder="Confirm Password">
    </label>


    <div class="flex flex-col mt-5">
        <span class = "text-label">Generated Password:</span>

        {#if showNewPassword}
        <p  class="text-[20px] font-semibold font-t">
        {newPassword}
        </p>
        {/if}
        <!-- <h1 class="text-[20px] font-semibold font-t">InsertPWHere</h1> -->
        <button type="button" class="text-purple-500 hover:underline" onclick={() => {ResetPW = true; }}>
        Copy Button
        </button>
    </div>


    
    <p class="text-red-500 font-semibold">
      {errorShown}
    </p>

    <!-- Buttons (Sticks to the Bottom) -->
    <div class="flex justify-between mt-auto">
      <button type="submit" class="mt-auto bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700" onclick={() => resetPassword()} data-sveltekit-reload>
          Update Password
      </button>

    </div>
</div>
</div>



<style>
  /*.profile-pic {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
    background: gray;
  }*/
</style>