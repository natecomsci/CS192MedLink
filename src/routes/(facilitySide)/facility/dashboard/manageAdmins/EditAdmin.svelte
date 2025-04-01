<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData, ActionData } from './$types';

  import ResetPWAdmin from "./ResetPWAdmin.svelte";

  import { pagingQueryHandler, getAdminData } from '$lib/postHandlers';
  import type { AdminDTO } from '$lib';

  let { data, 
        form, 
        adminID,
        currPopUp = $bindable(), 
        admins = $bindable(),
        currentPage = $bindable(),
        totalPages = $bindable(),
      }:{ data: PageData, 
          form: ActionData, 
          adminID: String,
          currPopUp: String, 
          admins: AdminDTO[],
          currentPage: number, 
          totalPages: number,
        } = $props();

  let firstname = $state('')
  let middlename = $state('')
  let lastname = $state('')
  let divisions: string[] = $state([])

  let ResetPW = $state(false)

  async function getData() {
    const rv = await getAdminData(adminID);
    firstname = rv.firstname
    middlename = rv.middlename
    lastname = rv.lastname
    divisions = rv.divisions

    for (var div of (data.divisions ?? [])) {
      if (divisions?.includes(div.divisionID)) {
        toggleDivision(div.name)
      }
    }
  }
  getData()

  let selectedDivisions:string[] = $state([]);

  function toggleDivision( name: string ) {
    if (selectedDivisions.includes(name)) {
      selectedDivisions = selectedDivisions.filter(d => d !== name);
    } else {
      selectedDivisions = [...selectedDivisions, name];
    }
  }

  function isAccepted( division:string ): boolean {
    return divisions?.includes(division) ?? false
  }

  let showDropdown = $state(false);

  async function getNewAdmins() {
    try {
      const rv = await pagingQueryHandler({
        page: 'admins',
        query: '',
        isInQueryMode:false,
        currentPage:1,
        change:0,
        totalPages:1,
      });
      admins =  rv.list
      currentPage = 1
      totalPages = rv.totalPages
    } catch (error) {
      console.log((error as Error).message)
    }
  }

</script>

{#if ResetPW}
  <ResetPWAdmin
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

    <div class="p-10 grid place-items-center">
      <!-- <img class="profile-pic border" src={ad.profilePicture} alt="" /> -->
      <input type="hidden" name="adminID" value="{adminID}" />
    </div>

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

      <label>
        <span class= "text-label">Assign Divisions</span>
        <div class="relative w-full">
          <button 
            class="input-box w-full border bg-white text-left p-2 rounded relative overflow-hidden pr-8" 
            onclick={() => showDropdown = !showDropdown}
            type="button" 
          >
            <span class="fade-mask">
              {selectedDivisions.length > 0 ? selectedDivisions.join(", ") : "Select Divisions"}
            </span>
    
            <svg class="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 transition-transform pointer-events-none" 
              style="transform: {showDropdown ? 'rotate(180deg)' : 'rotate(0deg)'}" 
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        
          {#if showDropdown}
            <div class="absolute w-full bg-white border shadow-lg p-2 max-h-60 overflow-y-auto bottom-full mb-1 z-50">
              {#each (data.divisions ?? []) as { divisionID, name }}
                <label class="flex items-center space-x-2">
                  <input 
                    name={divisionID} 
                    type="checkbox"
                    checked={isAccepted(divisionID)}
                    onclick={() => toggleDivision(name)} 
                  />
                  <span>{name}</span>
                </label>
              {/each}
            </div>
          {/if}
        </div>                  
      </label>

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