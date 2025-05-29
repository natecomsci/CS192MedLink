<script lang="ts">
  import Logo from '$lib/images/Logo.png';
  export let manage:string;
</script>

<header class="flex items-center justify-between p-3 top-0 duration-200 sticky z-[10] px-6 bg-background shadow-sm ">
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
    <h2 class="font-bold text-[27px] text-[#3D1853]">Manage {manage}</h2>
  </div>

  <!-- Medlink Logo -->
  <div class="flex items-center">
      <img src={Logo} alt="MedLink logo" class="w-10 h-13" />
      <h1 class="px-3 font-['DM_Sans'] text-[30px] leading-[40px] tracking-[-0.03em] font-black text-[#3D1853] drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">Med<span class="text-[#9044C4]">Link</span></h1>
  </div>
</header>