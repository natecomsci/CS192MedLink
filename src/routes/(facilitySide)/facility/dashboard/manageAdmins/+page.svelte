<script lang="ts">
  import Logo from '$lib/images/Logo.png';
  import type { PageProps } from "./$types";

  import type { AdminDTO } from '$lib';
  
  let { data, form }: PageProps = $props();

  let admins: AdminDTO[] = $state(data.admins ?? [])
  let currentPage: number = $state(data.currentPage)
  let totalPages = data.totalPages

  // PopUps
  import DeleteAdminConfirm from "./DeleteAdminConfirm.svelte";
  import AddAdmin from './AddAdmin.svelte';
  import EditAdmin from './EditAdmin.svelte';

  let selectedAdminID: String = $state('');

  let currPopUp: String = $state("")

  let query = $state('')
  let error = $state('')
  let errorLoc = $state('')
  async function searchAdmins() {

      const body = JSON.stringify({query});

      try {
        const response = await fetch("./manageAdmins/searchAdminsHandler", {
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
        if (rv.success) {
          error = ''
          admins = rv.admins
        } else if (rv.description === "admins"){
          errorLoc = "admins"
          error = rv.error
          admins = []
        } else {
          errorLoc = "query"
          error = rv.error
        }
        
      } catch (error) {
        throw new Error(`Response status: ${error}`);
      }
    }

  async function getPage(currPage: number, change: number, maxPages: number) {
    if ((currPage === 1 && change === -1) || (currPage === maxPages && change === 1)) {
      return
    } 

    const body = JSON.stringify({currPage, change});

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
      currentPage = (currentPage + change)
      
    } catch (error) {
      throw new Error(`Response status: ${error}`);
    }
  }
</script>

{#if currPopUp === "delete"}
  <DeleteAdminConfirm
    {data}
    {form}
    bind:admins={admins}
    bind:currPopUp={currPopUp}
    adminID={selectedAdminID}
  />

{:else if currPopUp === "addAdmin"}
  <AddAdmin 
    {data}
    {form}
    bind:admins={admins}
    bind:currPopUp={currPopUp}
  />
{:else if currPopUp === "editAdmin"}
  <EditAdmin
    {data}
    {form}
    bind:admins={admins}
    bind:currPopUp={currPopUp}
    adminID={selectedAdminID}
  />
{/if}

<!-- Header -->
<header class="flex items-center justify-between p-3 border  border-transparent top-0 duration-200 sticky z-[10] px-6 bg-white ">
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

<div class="p-6 bg-gray-50 max-h-screen border">
    <!-- View and Search -->
    <div class="w-2/3 flex items-center gap-10">
      <input
        type="text"
        placeholder="search"
        bind:value={query}
        class="px-4 py-0 border-2 border-gray-500 rounded-3xl h-10 w-full max-w-[500px]"
      />
      {#if query.length > 0}
        <button onclick={() => {
            getPage(1, 0, totalPages)
            query = ""
        }}>
          x
        </button>
      {/if}
      <button onclick={() => searchAdmins()}>
        Search
      </button>
      {#if errorLoc == "query"}
        {error}
      {/if}
      <h1>View By:</h1>

      <select class="px-4 py-0 border-2 border-gray-500 rounded-2xl h-10">
        <option>Default</option>
      </select>
    </div>

    <!-- Scrollable List Container -->
    <div class="space-y-3 mt-4 w-2/3 border  h-[calc(100vh-300px)] overflow-y-auto pr-8 pt-5">
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
                <p class="departments">
                    {#each (admin.divisions ?? []) as division, i}
                        <span class="dept">{division}</span>
                        {#if i < (admin.divisions ?? []).length - 1}|{/if}
                    {/each}
                </p>
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
              onclick={() => {selectedAdminID = admin.employeeID,
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
    <div class="flex items-center justify-center gap-4 mt-4 w-2/3">
      <button type="button" class="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300" onclick={() => currentPage > 1 ? getPage(currentPage, -1, totalPages) : ''}>⟨ Previous</button>
      <span class="font-medium">Page {currentPage} of {totalPages}</span>
      <button type="button" class="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300" onclick={() => currentPage < totalPages ? getPage(currentPage, 1, totalPages): ''}>Next ⟩</button>
    </div>

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

    .profile-pic {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
        background: gray;
    }

    .info {
        flex-grow: 1;
    }

    .name {
        font-size: 1.1rem;
        font-weight: bold;
        color: #4a148c;
    }

    .id {
        font-size: 0.9rem;
        color: #7b1fa2;
    }

    .departments {
        font-size: 0.9rem;
        color: #8e8e8e;
        font-style: italic;
    }

    .actions {
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
    }
</style>
