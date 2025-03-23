<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData, ActionData } from './$types';

  let { firstname, lastname, form, adminID, currPopUp = $bindable()}: {firstname: String, lastname: String, form: ActionData, adminID: String, currPopUp: String} = $props();

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

</script>


<form
  id="editAdmin"
  method="POST" 
  action="?/editAdmin"
  use:enhance={() => {
    return async ({ update }) => {
      await update({invalidateAll:true});
      if (form?.success) {
          currPopUp = ''
      }
    };
  }}
>

<div class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
  <div class="min-h-[500px] max-w-3xl mx-auto p-10 bg-white rounded-[50px] shadow-md flex flex-col">
    <h3 class="mb-10 text-gray-800 text-[25px] font-black">{middlename ? firstname + ' ' + middlename + ' ' + lastname : firstname + ' ' + lastname}</h3>

    {#if form?.error}
      <p class="text-red-500 font-semibold">
      {form.error}
      </p>
    {/if}



    
    <input type="hidden" name="adminID" value="{adminID}" />
    <!-- Name Fields -->
    <div class="grid grid-cols-3 gap-4 mb-4">
      <label>
        <span class ="text-label">First Name</span>
        <input class="input-box" placeholder="First Name" value={firstname} name="fname"/>
      </label>
      <label>
        <span class ="text-label">Middle Name</span>
        <input class="input-box" placeholder="Middle Name" value={middlename ?? ''} name="mname" />
      </label>
      <label>
        <span class ="text-label">Last Name</span>
        <input class="input-box" placeholder="Last Name" value={lastname} name = "lname"/>
      </label>
    </div>

    <button type="button" class="text-label" onclick={() => resetPassword()}>
      Reset Password
    </button>
    
    <input type = "text" name = "passwordConfirmation" class="input-box" bind:value={passwordConfirmation} placeholder="Confirm Password">
    {#if showNewPassword}
      <p>
        {newPassword}
      </p>
    {/if}

    <p>
      {errorShown}
    </p>
    <!-- Buttons (Sticks to the Bottom) -->
    <div class="flex justify-between mt-auto">
      <button class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg" onclick={() => currPopUp = ''} data-sveltekit-reload type="button">
        Cancel
      </button>

      <button type="submit" class="mt-auto bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700" data-sveltekit-reload>
          Edit Admin
      </button>

    </div>
</div>
</div>
</form>

