<script lang="ts">
  import Logo from '$lib/images/Logo.png';
  import type { PageProps } from "./$types";

  import type { AdminDTO } from '$lib';
  import { pagingQueryHandler } from '$lib/postHandlers';

  // PopUps
  import DeleteAdminConfirm from "./DeleteAdminConfirm.svelte";
  import AddAdmin from './AddAdmin.svelte';
  import EditAdmin from './EditAdmin.svelte';


  import PageBar from "$lib/facilityComponents/PageBar.svelte";

  
  let { data, form }: PageProps = $props();

  let admins: AdminDTO[] = $state(data.admins ?? [])
  let currentPage: number = $state(data.currentPage)
  let totalPages = $state(data.totalPages)

  let currPopUp: String = $state("")

  let selectedAdminID: String = $state('');

  let query = $state('')
  let error = $state('')
  let errorLoc = $state('')
  let isInQueryMode = $state(false)

  let viewedDivisionID = $state("Default")

  // ===================================
  let perPage = $state(10);
  let options = [10, 20, 50];

  async function getPage(change: number) {
    try {
      const rv = await pagingQueryHandler({page: "admins", query, isInQueryMode, currentPage, change, totalPages, perPage, viewedDivisionID});
      error =  rv.error
      errorLoc =  rv.errorLoc

      if (errorLoc !== "query") {
        admins =  rv.list
        totalPages =  rv.totalPages
        currentPage =  rv.currentPage
        
      }
    } catch (error) {
      console.log(error)
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter")
    {
      isInQueryMode = true
      currentPage = 1
      getPage(0)
    }
  }

  
</script>

{#if currPopUp === "delete"}
  <DeleteAdminConfirm
    {data}
    {form}
    {perPage}
    {viewedDivisionID}
    adminID={selectedAdminID}
    bind:admins={admins}
    bind:currPopUp={currPopUp}
    bind:currentPage={currentPage}
    bind:totalPages={totalPages}
  />

{:else if currPopUp === "addAdmin"}
  <AddAdmin 
    {data}
    {form}
    {perPage}
    {viewedDivisionID}
    bind:admins={admins}
    bind:currPopUp={currPopUp}
    bind:currentPage={currentPage}
    bind:totalPages={totalPages}
  />
{:else if currPopUp === "editAdmin"}
  <EditAdmin
    {data}
    {form}
    {perPage}
    {viewedDivisionID}
    adminID={selectedAdminID}
    bind:admins={admins}
    bind:currPopUp={currPopUp}
    bind:currentPage={currentPage}
    bind:totalPages={totalPages}
  />
{/if}

<!-- Header -->
<header class="flex items-center justify-between p-3 shadow-sm border-transparent top-0 duration-200 sticky z-[10] px-6 bg-white ">
    <!-- Back Icon -->
  <div class="items-center flex gap-5">
    <a href="/facility/dashboard" data-sveltekit-reload>
      <img
        src="/back_icon.svg"
        alt="Back"
        class="w-6 h-6 cursor-pointer transition-colors duration-200 hover:opacity-70 active:opacity-50"
      />
    </a>

    <!-- Manage Services -->
    <h2 class="font-bold text-[27px] text-[#3D1853]">Manage Admins</h2>
  </div>

  <!-- Medlink Logo -->
  <div class="flex items-center">
      <img src={Logo} alt="MedLink logo" class="w-10 h-13" />
      <h1 class="px-3 font-['DM_Sans'] text-[30px] leading-[40px] tracking-[-0.03em] font-black text-[#3D1853] drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">Med<span class="text-[#9044C4]">Link</span></h1>
  </div>
</header>

<div class="p-6 bg-gray-50 max-h-screen h-[calc(100vh-50px)]">
    <!-- View and Search -->
    <div class="w-2/3 flex items-center gap-10">
      <input
        type="text"
        placeholder="search"
        bind:value={query}
        onkeydown={handleKeydown}
        class="px-4 py-0 border-2 border-gray-500 rounded-3xl h-10 w-full max-w-[500px]"
      />
      {#if query.length > 0 || isInQueryMode}
        <button onclick={() => {
            query = ""
            error = ""
            errorLoc = ""
            isInQueryMode = false
            currentPage = 1
            getPage(0)
        }}>
          Clear
        </button>
      {/if}
      <button onclick={() => {
        isInQueryMode = true
        currentPage = 1
        getPage(0)
      }}>
        Search
      </button>
      {#if errorLoc == "query"}
        {error}
      {/if}
      {#if data.hasDivisions && data.divisions.length > 1}
        <h1>View By:</h1>
        <select 
          bind:value={viewedDivisionID} 
          class="px-4 py-0 border-2 border-gray-500 rounded-2xl h-10"
          onchange={()=>{
            console.log(viewedDivisionID)
            query = ""
            error = ""
            errorLoc = ""
            getPage(0)
          }}
        >
          <option
            value="Default"
          >Default</option>
          {#each data.divisions as {name, divisionID}}
            <option
              value={divisionID}
            >{name}</option>
          {/each}
        </select>
      {/if}
    </div>

    <hr class="mt-4 border-gray-300 w-2/3">
    <!-- Scrollable List Container -->
    <div class="space-y-3 mt-4 w-2/3 pl-4 h-[calc(100vh-250px)] overflow-y-auto pr-8 pt-5">
      {#if errorLoc == "admins"}
        {error}
      {/if}
      {#each admins as  admin}
        <div class="admin-card shadow-[0px_4px_10px_rgba(0,0,0,0.3)]  ">
            <!-- Profile Picture -->
            <!-- <img class="profile-pic" src={ad.profilePicture} alt="" /> -->

            <!-- Admin Info -->
            <div class="info">
                <h3 class="name">{admin.mname ? admin.fname + ' ' + admin.mname + ' ' + admin.lname : admin.fname + ' ' + admin.lname}</h3>
                <!-- <p class="id">{admin.employeeID}</p> -->
                {#if data.hasDivisions}
                  <p class="departments">
                    {#each (admin.divisions ?? []) as division, i}
                      <span class="dept">
                        {division.name}
                        {#if i < (admin.divisions ?? []).length - 1} | {/if}
                      </span>
                    {/each}
                  </p>
                {/if}
            </div>

            <!-- Actions (Edit & Delete) -->
            <div class="flex items-center space-x-3 pr-4">
            <button onclick={() => {
                currPopUp='editAdmin', 
                selectedAdminID=admin.employeeID
              }} 
              class="inline-flex items-center" data-sveltekit-reload
            >
              <img src="/edit_icon.svg" alt="Edit" class="w-6 h-6 cursor-pointer hover:opacity-80" />
            </button>

            <!-- Delete Button (Opens Modal) -->
            <button 
              type="button" 
              class="inline-flex items-center" 
              onclick={() => {
                selectedAdminID = admin.employeeID
                currPopUp = admins.length > 1 ? 'delete' : 'deleteRestricted'}
                              } 
                data-sveltekit-reload
            >
              <img src="/trash_icon.svg" alt="Delete" class="w-6 h-6 cursor-pointer hover:opacity-80" />
            </button>

          </div>
        </div>
      {/each}
    </div>

  <PageBar
    {currentPage} 
    {totalPages} 
    {perPage} 
    {options} 
    {getPage}
  />


  <button type="button" class="fixed bottom-6 right-6 bg-purple-500 text-white px-6 py-3 rounded-full flex items-center space-x-2 shadow-lg" onclick={() => {currPopUp='addAdmin'}}>
    <span class="text-xl">+</span>
    Add Admin
  </button>
</div>

<!-- Styles -->
<style>
    .admin-card {
        display: flex;
        align-items: center;
        background: white;
        padding: 15px;
        border-radius: 25px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        max-width: full;
        gap: 15px;
    }

/*    .profile-pic {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
        background: gray;
    }*/

    .info {
        flex-grow: 1;
    }

    .name {
        font-size: 1.1rem;
        font-weight: bold;
        color: #4a148c;
    }

/*    .id {
        font-size: 0.9rem;
        color: #7b1fa2;
    }*/

    .departments {
        font-size: 0.9rem;
        color: #8e8e8e;
        font-style: italic;
    }

/*    .actions {
        display: flex;
        gap: 10px;
    }

    .edit, .delete {
        border: none;
        background: none;
        cursor: pointer;
        font-size: 1.2rem;
    }

    .edit {
        color: #a855f7;
    }

    .delete {
        color: #dc2626;
    }

    .edit:hover {
        opacity: 0.7;
    }

    .delete:hover {
        opacity: 0.7;
    }*/
</style>
