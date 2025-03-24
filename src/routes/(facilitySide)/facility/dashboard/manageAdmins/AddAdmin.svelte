<script lang="ts">
  import type { ActionData, PageData } from './$types';
  import { enhance } from '$app/forms';
  import { redirect } from '@sveltejs/kit';
  import type { AdminDTO } from '$lib';

  let { data = $bindable(), form = $bindable(), currPopUp = $bindable(), admins = $bindable()}: { data: PageData, form: ActionData, currPopUp: String, admins: AdminDTO[] } = $props();

  let firstName = $state("");
  let middleName =$state("") ;
  let lastName = $state("");

  let allDivisions = ["Division 1", "Division 2", "Division 3", "Division 4", "Division 5", "Division 6", "Division 7", "Division 8","ahahahhahahahaha"];
  let selectedDivisions:string[] = $state([]);

  function red() {
    throw redirect(300, '/facility/dashboard/manageAdmins')
  }

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

<form 
      method="POST" 
      action="?/addAdmin"
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
    <h3 class="mb-10 text-gray-800 text-[25px] font-black">Add Admin</h3>

    {#if form?.error}
      <p class="text-red-500 font-semibold">
      {form.error}
      </p>
    {/if}

    <!-- Name Fields -->
    <div class="grid grid-cols-3 gap-4 mb-4">
      <label>
        <span class ="text-label">First Name</span>
        <input class="input-box" placeholder="First Name" bind:value={firstName} name="fname"/>
      </label>
      <label>
        <span class ="text-label">Middle Name</span>
        <input class="input-box" placeholder="Middle Name" bind:value={middleName} name="mname" />
      </label>
      <label>
        <span class ="text-label">Last Name</span>
        <input class="input-box" placeholder="Last Name" bind:value={lastName} name = "lname"/>
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
                    {#each allDivisions as t}
                        <label class="flex items-center space-x-2">
                            <input 
                                name={t} 
                                type="checkbox" 
                                checked={isAccepted(t)}
                                onclick={() => toggleDivision(t)} 
                            />
                            <span>{t}</span>
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

    <!-- Buttons (Sticks to the Bottom) -->
    <div class="flex justify-between mt-auto">
      <button class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg" onclick={() => currPopUp = ''} data-sveltekit-reload type="button">
        Cancel
      </button>

      <button type="submit" class="mt-auto bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700" data-sveltekit-reload>
          Create Admin
      </button>

    </div>
</div>
</div>
</form>

<style>
  .selected {
      background-color: #9044C4;
      color: white;
  }


  .fade-mask {
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: clip;
      position: relative;
      max-width: 100%;
      
      /* Fading effect using mask */
      -webkit-mask-image: linear-gradient(to right, black 80%, rgba(0, 0, 0, 0));
      mask-image: linear-gradient(to right, black 80%, rgba(0, 0, 0, 0));
  }

</style>