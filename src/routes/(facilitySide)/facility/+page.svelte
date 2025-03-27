<script lang="ts">
  import Logo from '$lib/images/Logo.png';
  import { enhance } from '$app/forms';

  import type { PageProps } from './$types';
  let { form }: PageProps = $props();

  let show = $state(false);

</script>

<div class="grid grid-cols-1 justify-items-center p-8">
  <div class="grid grid-cols-1 justify-items-center">
    <img src={Logo} alt="MedLink logo" width="120" height="120" />
    <h1 class="py-10 mb-5 font-['DM_Sans'] text-[80px] leading-[40px] tracking-[-0.03em] font-black text-[#3D1853] drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
      Med<span class="text-[#9044C4]">Link</span>
    </h1>
  </div>

  <form 
    method="POST"
    action="?/signIn"
    class="w-96 grid grid-cols-1 bg-white m-0 space-y-8 rounded-2xl p-8 drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
    use:enhance
  >
    <h3 class="text-[25px] font-black font-['DM_Sans'] mb-0">SIGN IN</h3>

    <div class="space-y-5 py-2">
      
      <input 
        name="employeeID"
        type="text"
        value=''
        placeholder="Employee ID" 
        class="w-full px-4 py-3 border-2 border-[#D9D9D9] rounded-md focus:ring-2 focus:ring-purple-400"
      >
      {#if form?.description === "ID"}
          <p class="text-red-500 text-sm font-semibold">{form?.error}</p>
      {/if}

      <div class="relative w-full">
        <input 
          name="password" 
          type={show ? "text" : "password"}
          value=''
          placeholder="Password" 
          autocomplete="new-password"
          class="w-full px-4 py-3 border-2 border-[#D9D9D9] rounded-md focus:ring-2 focus:ring-purple-400"
        >
        <button 
          type="button" 
          class="absolute inset-y-0 right-3 flex items-center text-[#9044C4] text-sm font-semibold"
          onclick={() => show = !show}
        >
          { show ? "Hide" : "Show" }
        </button>
      </div>
    </div>

    {#if form?.description === "pass"}
      <p class="text-red-500 text-sm font-semibold">{form?.error}</p>
    {/if}

    <button 
      type="submit" 
      class="font-['Inter'] w-full bg-[#9044C4] text-white py-3 rounded-md text-[15px] font-bold transition 
      hover:bg-purple-700 active:scale-95 active:bg-purple-800">
      Log in
    </button>
  </form>
</div>