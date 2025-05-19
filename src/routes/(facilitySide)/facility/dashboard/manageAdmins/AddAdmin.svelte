<script lang="ts">
  import type { ActionData, PageData } from './$types';
  import { enhance } from '$app/forms';

  import type { AdminDTO } from '$lib';
  import { pagingQueryHandler } from '$lib/postHandlers';

  let { data, 
        form, 
        currPopUp = $bindable(), 
        admins = $bindable(),
        currentPage = $bindable(),
        totalPages = $bindable(),
        perPage,
        viewedDivisionID
      }:{ data: PageData, 
          form: ActionData, 
          currPopUp: String, 
          admins: AdminDTO[],
          currentPage: number, 
          totalPages: number,
          perPage:number,
          viewedDivisionID:string
        } = $props();

  let firstName = $state("");
  let middleName =$state("") ;
  let lastName = $state("");

  let selectedDivisionsNames:string[] = $state([]);
  let selectedDivisionsIDs:string[] = $state([]);

  function toggleDivision(name: string, divisionID: string) {
    if (selectedDivisionsNames.includes(name)) {
      selectedDivisionsNames = selectedDivisionsNames.filter(d => d !== name);
      selectedDivisionsIDs = selectedDivisionsIDs.filter(d => d !== divisionID);
    } else {
      selectedDivisionsNames = [...selectedDivisionsNames, name];
      selectedDivisionsIDs = [...selectedDivisionsIDs, divisionID];
    }
  }

  function isAccepted( division:string ): boolean {
    return selectedDivisionsIDs.includes(division) ?? false
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
        perPage,
        viewedDivisionID
      });
      admins =  rv.list
      currentPage = 1
      totalPages = rv.totalPages
    } catch (error) {
      console.log((error as Error).message)
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
    <div class="min-h-[500px] max-w-3xl mx-auto p-10 bg-background rounded-[50px] shadow-md flex flex-col">
      <h3 class="mb-10 text-gray-800 text-[25px] font-black">Add Admin</h3>

      {#if form?.error}
        <p class="text-red-500 font-semibold">
        {form.error}
        </p>
      {/if}

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
    
      {#if data.hasDivisions}
        <label>
          <span class= "text-label">Assign Divisions</span>
          <div class="relative w-full">
            <button 
              class="input-box w-full border bg-background text-left p-2 rounded relative overflow-hidden pr-8" 
              onclick={() => showDropdown = !showDropdown}
              type="button" 
            >
              <span class="fade-mask">
                {selectedDivisionsNames.length > 0 ? selectedDivisionsNames.join(", ") : "Select Divisions"}
              </span>
      
              <svg class="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 transition-transform pointer-events-none" 
                style="transform: {showDropdown ? 'rotate(180deg)' : 'rotate(0deg)'}" 
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>

            <input name="selectedDivisions" class="hidden" type="text" bind:value={selectedDivisionsIDs}>
          
            {#if showDropdown}
              <div class="absolute w-full bg-background border shadow-lg p-2 max-h-60 overflow-y-auto bottom-full mb-1 z-50">
                {#each (data.divisions ?? []) as { divisionID, name }}
                  <label class="flex items-center space-x-2">
                    <input 
                      name={divisionID} 
                      type="checkbox"
                      checked={isAccepted(divisionID)}
                      onclick={() => toggleDivision(name, divisionID)} 
                    />
                    <span>{name}</span>
                  </label>
                {/each}
              </div>
            {/if}
          </div>                  
        </label>
      {/if}

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