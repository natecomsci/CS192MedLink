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
  import SearchViewBar from "$lib/facilityComponents/SearchViewBar.svelte";
  import ManageHeader from '$lib/facilityComponents/ManageHeader.svelte';
  
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
<ManageHeader manage ="Admins" />


<div class="p-6 bg-gray-50 max-h-screen h-[calc(100vh-50px)]">


    <SearchViewBar
      bind:query
      bind:viewedDivisionID
      bind:error
      bind:errorLoc
      bind:isInQueryMode
      bind:currentPage
      {data}
      {getPage}
    />

    <hr class="mt-4 border-gray-300 w-2/3">
    <!-- Scrollable List Container -->
    <div class="space-y-3 mt-4 w-2/3 p-4 h-[calc(100vh-250px)] overflow-y-auto pr-8 pt-5">
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
                      <span class="dept mr-1">
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
  
  <div class="w-2/3">
    <PageBar
      bind:currentPage={currentPage} 
      bind:totalPages={totalPages} 
      bind:perPage={perPage} 
      getPage={getPage}
    />
  </div>


  <button type="button" class="fixed bottom-6 right-6 bg-purple-500 text-white px-6 py-3 rounded-full flex items-center space-x-2 shadow-lg" onclick={() => {currPopUp='addAdmin'}}>
    <span class="text-xl">+ Add Admin</span>
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
