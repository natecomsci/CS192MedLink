<script lang="ts">
  import { enhance } from '$app/forms';
  import type { AdminDTO } from '$lib';
  import type { PageData, ActionData } from './$types';
  import ResetPWAdmin from "./ResetPWAdmin.svelte";

  let { data, form, adminID, currPopUp = $bindable(), admins = $bindable(),
    firstname, middlename, lastname, divisions
  }: { data: PageData, form: ActionData, adminID: String, currPopUp: String, admins:AdminDTO[],
  firstname:String, middlename:String, lastname:String, divisions:String 
  } = $props();

  let ResetPW = $state(false)
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

  let selectedDivisions:string[] = $state([]);

  function toggleDivision(division: string) {
    if (selectedDivisions.includes(division)) {
      selectedDivisions = selectedDivisions.filter(d => d !== division);
    } else {
      selectedDivisions = [...selectedDivisions, division];
    }
  }

    function isAccepted(division:string ): boolean {
      return false
        // return data.providers?.includes(p) ?? false
    }

  let showDropdown = $state(false);

  async function getNewAdmins() {
    const body = JSON.stringify({currPage: 1, change: 0});

    try {
      const response = await fetch("./manageAdmins/adminPagingHandler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      admins = await response.json();
      
    } catch (error) {
      throw new Error(`Response status: ${error}`);
    }
  }

</script>

{#if ResetPW}
  <ResetPWAdmin
    { firstname }
    { lastname }
    { form }
    bind:currPopUp={currPopUp}
    bind:ResetPW= {ResetPW}
    adminID={adminID}
  />
{/if}

<form
  id="editAdmin"
  method="POST" 
  action="?/editAdmin"
  use:enhance={() => {
    return async ({ update }) => {
      await update({invalidateAll:true});
      if (form?.success) {
          currPopUp = ''
          getNewAdmins()
      }
    };
  }}
>

<div class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
  <div class="min-h-[500px] max-w-3xl mx-auto p-10 bg-white rounded-[50px] shadow-md flex flex-col">
    <h3 class=" text-gray-800 text-[25px] font-black">{middlename ? firstname + ' ' + middlename + ' ' + lastname : firstname + ' ' + lastname}</h3>

    {#if form?.error}
      <p class="text-red-500 font-semibold">
      {form.error}
      </p>
    {/if}

    <!-- Profile Picture -->
    <div class="p-10 grid place-items-center">
      <!-- <img class="profile-pic border" src={ad.profilePicture} alt="" /> -->
      <input type="hidden" name="adminID" value="{adminID}" />
    </div>

    
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

        <!-- SELECT DIVISIONS Dropdown Menu -->
    <label>
        <span class= "text-label">Assign Divisions</span>
        <div class="relative w-full">
            <!-- Dropdown Button -->
            <button 
                class="input-box w-full border bg-white text-left p-2 rounded relative overflow-hidden pr-8" 
                onclick={() => showDropdown = !showDropdown}
                type="button" 
            >
                <span class="fade-mask">
                    {selectedDivisions.length > 0 ? selectedDivisions.join(", ") : "Select Divisions"}
                </span>
        
                <!-- Dropdown Icon -->
                <svg class="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 transition-transform pointer-events-none" 
                    style="transform: {showDropdown ? 'rotate(180deg)' : 'rotate(0deg)'}" 
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
            </button>
        
            <!-- Dropdown Content -->
            {#if showDropdown}
                <div class="absolute w-full bg-white border shadow-lg p-2 max-h-60 overflow-y-auto bottom-full mb-1 z-50">
                    {#each divisions as division}
                        <label class="flex items-center space-x-2">
                            <input 
                                name={division} 
                                type="checkbox" 
                                checked={isAccepted(division)}
                                onclick={() => toggleDivision(division)} 
                            />
                            <span>{division}</span>
                        </label>
                    {/each}
                </div>
            {/if}
        </div>                  
    </label>

    <!-- Selected Divisions -->
    <div class="mt-4 flex-1">
      <div class="flex flex-wrap gap-2 mb-4">
        {#each selectedDivisions as division}
          <span class="bg-purple-100 text-purple-500 px-3 py-1 rounded-lg flex items-center">
            {division} 
            <button onclick={() => selectedDivisions = selectedDivisions.filter(d => d !== division)} class="ml-2 text-xs text-red-500">✕</button>
          </span>
        {/each}
      </div>
    </div>

    <button type="button" class="text-purple-500 hover:underline" onclick={() => {ResetPW = true; }}>
      Reset Password
    </button>



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



<style>
  .profile-pic {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
    background: gray;
}
</style>