<script lang="ts">
  import { Role } from '@prisma/client';
  import type { PageProps } from './$types';
  
  import Logo from '$lib/images/Logo.png';
  import type { ServiceDTO } from '$lib';

  import Admins from './Admins.svelte';
  import ControlHistory from './ControlHistory.svelte';
  import Services from './Services.svelte';
  import Divisions from './Divisions.svelte';

  // PopUps
  import Settings from './Settings.svelte';
  import UpdateFacilityInfo from './UpdateFacilityInfo.svelte';
  let currPopUp: String = $state("")

  let { data, form }: PageProps = $props();

  const mainServicesShown: ServiceDTO[] = data.mainServicesShown 

</script>

{#if currPopUp === 'UpdateFacilityInfo'}
  <UpdateFacilityInfo 
    bind:currPopUp={currPopUp}
  />
{:else if currPopUp === 'Settings'}
  <Settings 
    bind:currPopUp={currPopUp}
  />
{/if}


<!-- Medlink Logo, Facility Name, General Info and Settings Header -->
<header class="flex items-center justify-between p-3 border  border-transparent top-0 duration-200 sticky z-[10] px-6 bg-white ">
  <div class="flex items-center">
      <img src={Logo} alt="MedLink logo" class="w-10 h-13" />
      <h1 class="px-3 font-['DM_Sans'] text-[30px] leading-[40px] tracking-[-0.03em] font-black text-[#3D1853] drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">Med<span class="text-[#9044C4]">Link</span></h1>
  </div>

  <div class="flex gap-3">
      <h2 class="font-bold text-[27px] text-[#3D1853]">{data.facilityName}</h2>
      {#if data.role == Role.MANAGER}
        <div class="sm:flex items-center gap-4 hidden">
            <a href="./dashboard/updateFacilityInfo" class="duration-200 hover:text-violet-400" data-sveltekit-reload>
                <p>GenInfo</p>
            </a>
            <button type="button"
                    class="duration-200 hover:text-violet-400"
                    onclick={() => {currPopUp='UpdateFacilityInfo'}}>
                    GenInfoPopUp
            </button>
        </div>
      {/if}
      <div class="sm:flex items-center gap-4 hidden">
          <a href="./dashboard/settings" class="duration-200 hover:text-violet-400 " data-sveltekit-reload>
              <p>Settings</p>
          </a>
          <button type="button"
                  class="duration-200 hover:text-violet-400"
                  onclick={() => {currPopUp='Settings'}}>
                  SettingsPop
          </button>
      </div>
  </div>
</header>

<div class=" border-transparent flex h-[calc(100vh-75px)] p-10 bg-gray-100 overflow-hidden gap-5">
  <!-- Left Side: Control History -->
  <div class="w-1/2 bg-white shadow-lg rounded-lg ">
    <ControlHistory {data} {form}/>
  </div>

  <!-- Right Side: Admins, Services, Divisions -->
  <div class="w-1/2 flex flex-col gap-4 py-0">
    {#if data.role == Role.MANAGER}
      <Admins admins={data.admins} />
    {/if}

    <div class="flex gap-5 w-full  h-6/8 ">
      <Services {mainServicesShown}/>

      {#if data.hasDivisions && data.role === Role.MANAGER}
      <!-- <div class="bg-purple-100 flex-1">
        Divisions
      </div> -->
      <Divisions divisions={data.divisions}/>
      {/if}
    </div>
  </div>
</div>
