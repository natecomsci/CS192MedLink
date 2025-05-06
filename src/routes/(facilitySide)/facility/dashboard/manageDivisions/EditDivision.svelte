<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData, ActionData } from './$types';
  import { pagingQueryHandler } from '$lib/postHandlers';
    import type { DivisionDTO } from '$lib';

  let { form, 
        divisionID, 
        currPopUp = $bindable(),
        divisions = $bindable(), 
        currentPage = $bindable(),
        totalPages = $bindable(),
        perPage
        }: { 
          form: ActionData, 
          divisionID: String, 
          currPopUp: String,
          divisions:DivisionDTO[], 
          currentPage: number, 
          totalPages: number, 
          perPage:number
        } = $props();

  let divisionName = $state('')
  let divisionEmail = $state('')
  let phoneNumber = $state('')
  let openingTime = $state('')
  let closingTime = $state('')

  async function getData() {
    const body = JSON.stringify({divisionID});

    try {
      const response = await fetch("./manageDivisions/divisionInfo", {
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

      divisionName = rv.name
      divisionEmail = rv.email ?? ''
      phoneNumber = rv.phoneNumber
      openingTime = rv.openingTime
      closingTime = rv.closingTime

      console.log(openingTime)
      console.log(closingTime)
      
    } catch (error) {
      throw new Error(`Response status: ${error}`);
    }
  }
  getData()

  async function getNewDivisions() {
    try {
      const rv = await pagingQueryHandler({
        page: 'divisions',
        query: '',
        isInQueryMode:false,
        currentPage:1,
        change:0,
        totalPages:1,
        perPage,
        viewedDivisionID: "Default"
      });
      divisions =  rv.list
      currentPage = 1
      totalPages = rv.totalPages
    } catch (error) {
      console.log((error as Error).message)
    }
  }

</script>

<div class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
  <div class=" w-11/12 max-w-3/4 rounded-lg  overflow-hidden ">
    <div class="grid grid-cols-1 bg-white m-6 space-y-2 rounded-2xl shadow drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
      <div class="h-[calc(100vh-100px)] flex bg-gray-100 rounded-2xl">
        <!-- Left Panel -->
          <div class="w-1/3 bg-white p-6 flex flex-col rounded-l-2xl">
            <div class="flex items-center gap-5">
                <button onclick={() => currPopUp = ''} data-sveltekit-reload>
                  <img src="/back_icon.svg" alt="Back" class="w-6 h-6 cursor-pointer transition-colors duration-200 hover:opacity-70 active:opacity-50"/>
                </button>
                <h1 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900">Edit Division</h1>
            </div>

            <div class=" py-10">
                <h1 class=" text-[25px] font-['DM_Sans'] font-bold text-black">{divisionName}</h1>
                <!-- <h3 class="text-[20px] font-['DM_Sans'] font-bold text-purple-500">Division Name</h3> -->
            </div>

            <button form="editDivision" type="submit" class="mt-auto bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700" data-sveltekit-reload>
                Edit Division
            </button>
        </div>

        <!-- Vertical Divider -->
        <div class="w-[2px] bg-gray-300"></div>

        <!-- Right Panel -->
        <div class="flex-1 p-6 overflow-y-auto  "> 
          <h2 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900">{divisionName}</h2>
          <div class="grid grid-cols-1">
            <form
              class = "grid grid-cols-1"
              id="editDivision"
              method="POST" 
              action="?/editDivision"
              use:enhance={() => {
                return async ({ update }) => {
                  await update({invalidateAll:true});
                  if (form?.success) {
                      currPopUp = ''
                      getNewDivisions()
                  }
                };
              }}
            >
              Edit Division Page
              {#if form?.error}
                  <p class="text-red-500 text-sm font-semibold">{form?.error}</p>
              {/if}
              <input type="hidden" name="divisionID" value="{divisionID}" class=" card" />
              <input type="text" name="name" value={divisionName} class=" card"/>
              <input type="text" name="email" value={divisionEmail} class=" card"/>
              <input type="text" name="phoneNumber" value={phoneNumber} class=" card"/>
              <div class="card">
                <input 
                  class="input-box w-30"
                  name="opening"
                  type="time"
                  value={openingTime}
                >
                  to
                <input 
                  class="input-box w-30"
                  name="closing"
                  type="time"
                  value={closingTime}
                >
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
