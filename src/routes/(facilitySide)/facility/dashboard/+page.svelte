<script>
  import Admins from './Admins.svelte';
  import ControlHistory from './ControlHistory.svelte';
  import Divisions from './Divisions.svelte';
  import Services from './Services.svelte';
  import Logo from '$lib/images/Logo.png';
  let hospitalName = 'Allied Care Experts Medical Center–Baypointe, Inc.';

  // import type { PageProps } from './$types';

  let { data } = $props();

  console.log(data.facilityID)

</script>

<header class="flex items-center justify-between p-3 border  border-transparent top-0 duration-200 sticky z-[10] px-6 bg-white ">
  <div class="flex items-center">
      <img src={Logo} alt="MedLink logo" class="w-10 h-13" />
      <h1 class="px-3 font-['DM_Sans'] text-[30px] leading-[40px] tracking-[-0.03em] font-black text-[#3D1853] drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">Med<span class="text-[#9044C4]">Link</span></h1>
  </div>

  <div class="flex gap-3">
      <h2 class="font-bold text-[27px] text-[#3D1853]">{hospitalName}</h2>
      <div class="sm:flex items-center gap-4 hidden">
          <a href="./dashboard/updateFacilityInfo"class="duration-200 hover:text-violet-400">
              <p>GenInfo</p>
          </a>
      </div>
      <div class="sm:flex items-center gap-4 hidden">
          <a href="/none"class="duration-200 hover:text-violet-400">
              <p>Settings</p>
          </a>
      </div>
  </div>
</header>


<div class="border border-transparent flex h-screen p-10 bg-gray-100">
  <!-- Left Side: Control History -->
  <!-- <div class="border w-1/2 py-5"> -->
    <div class="w-1/2 p-5 bg-white shadow-lg rounded-lg">
      <ControlHistory />
    </div>
  <!-- </div> -->

  <!-- Right Side: Admins, Services, Divisions -->
  <div class="border  border-transparent h-full w-1/2 flex flex-col gap-4 pl-5 py-0">
    <Admins />
    <div class="grid grid-cols-1 gap-4 h-full">
      <Services/>
      <!-- <Divisions/> -->
    </div>
  </div>
</div>
