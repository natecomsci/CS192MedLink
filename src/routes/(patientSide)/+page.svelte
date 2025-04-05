<script lang="ts">
  import Logo from '$lib/images/Logo.png';
  import type { PageProps } from './$types';
  import { enhance } from '$app/forms';

  let showFilter = $state(false);
  let { data, form }: PageProps = $props();
</script>

<form 
  class="" 
  method="POST"
  action="?/search"
  use:enhance
>

<div class="min-h-screen bg-[#AE72DA] flex flex-col items-center justify-start relative">
  <div class="absolute top-20 left-1/2 transform -translate-x-1/2 justify-items-center">
    <img src={Logo} alt="MedLink logo" width="150" height="150" />
  </div>

  <div class="w-full bg-white rounded-t-3xl shadow-lg mt-50 p-6 flex flex-col items-center flex-grow">
    <h1 class="mt-15 mb-5 font-['DM_Sans'] text-[60px] leading-[40px] tracking-[-0.03em] font-black text-[#3D1853] drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
      Med<span class="text-[#9044C4]">Link</span>
    </h1>
    <p class="text-gray-500 text-center mt-2">Connecting you to healthcare,<br>One search at a time...</p>

    <!-- <div> -->
      <div class="relative mt-4 flex items-center gap-2 pl-2 rounded-full border border-gray-300 bg-white shadow-sm xl:w-3/4 sm:w-full md:w-full">
        <input
          type="text"
          name="query"
          value=""
          placeholder="Search services..."
          class="flex-1 p-2 text-gray-700 bg-transparent outline-none"
        />
        <button type="submit" class="p-2 text-gray-500">
          <img src="/search_icon.svg" alt="Search" class="w-6 h-6" />
        </button>
      </div>
    <!-- </div> -->
    {#if form?.error}
      <p class="text-red-600 mt-2">{form.error}</p>
    {/if}

    <div class="grid grid-cols-2 gap-4 p-6 w-full max-w-md">
      <a href="/search/Ambulance" class="flex flex-col items-center justify-center bg-white border border-[#9E8BA9] rounded-xl shadow-md p-4 hover:shadow-lg transition">
        <img src="/ambulance_icon.svg" alt="Ambulance Icon" class="w-8 h-8 mb-2" />
        <span class="text-sm font-medium text-[#5B2F74]">Ambulance</span>
      </a>

      <a href="/search/Blood%20Bank" class="flex flex-col items-center justify-center bg-white border border-[#9E8BA9] rounded-xl shadow-md p-4 hover:shadow-lg transition">
        <img src="bloodbank_icon.svg" alt="Blood Bank Icon" class="w-8 h-8 mb-2" />
        <span class="text-sm font-medium text-[#5B2F74]">Blood Bank</span>
      </a>

      <a href="/search/Intensive%20Care%20Unit" class="flex flex-col items-center justify-center bg-white border border-[#9E8BA9] rounded-xl shadow-md p-4 hover:shadow-lg transition">
        <img src="ICU_icon.svg" alt="ICU Icon" class="w-8 h-8 mb-2" />
        <span class="text-sm font-medium text-[#5B2F74]">ICU</span>
      </a>

      <a href="/search/Emergency%20Room" class="flex flex-col items-center justify-center bg-white border border-[#9E8BA9] rounded-xl shadow-md p-4 hover:shadow-lg transition">
        <img src="ER_icon.svg" alt="ER Icon" class="w-8 h-8 mb-2" />
        <span class="text-sm font-medium text-[#5B2F74]">ER</span>
      </a>
    </div>


    {#if showFilter}
      <p>filters here</p>
    {/if}
  </div>
</div>
</form>



