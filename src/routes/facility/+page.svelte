<script lang="ts">
  import type { PageData } from './$types';

  import Logo from '$lib/images/Logo.png';

  let fid = $state('');
  let password = $state('');
  let show = $state(false);

  let { data }: PageData = $props();

</script>

<!-- @elle, @paul: padesign -->
<div class="grid grid-cols-1 justify-items-center p-8">
  <div class="grid grid-cols-1 justify-items-center">
    <!-- Logo -->
    <img 
      src={Logo} 
      alt="MedLink logo" 
      width="70" 
      height="70"/>
    <!-- MedLink -->
    <h1 class="font-['DM_Sans'] text-[40px] leading-[40px] tracking-[-0.03em] font-black text-[#3D1853] drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
      Med<span class="text-[#9044C4]">Link</span>
    </h1>
  </div>
  
  <!-- sign in -->
  <form 
    method="POST"
    class="w-66 grid grid-cols-1 bg-white m-6 space-y-5 rounded-2xl p-5 drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
    >
    <h2 class="text-xl font-bold mb-4">SIGN IN</h2>

    <!-- Employee -->
    <input 
      name="fid"
      type="text"
      bind:value={fid}
      placeholder="Employee ID" 
      class=" px-4 py-2 border-2 border-[#D9D9D9] rounded-md focus:ring-2 focus:ring-purple-400"
      required
    >
    <!-- Password -->
    <div class="relative w-full">
      <input 
        name="password" 
        type={show ? "text" : "password"}
        bind:value={password}
        placeholder="Password" 
        autocomplete="new-password"
        class="w-full px-4 py-2 border-2 border-[#D9D9D9] rounded-md focus:ring-2 focus:ring-purple-400"
        required
      >
      <button 
        type="button" 
        class="absolute inset-y-0 right-3 flex items-center text-[#9044C4] text-sm font-semibold font-['DM_Sans']"
        onclick={() => show = !show}
      >
        { show ? "hide" : "show" }
      </button>
    </div>
    <button 
      type="submit" 
      class="font-['Inter'] w-full bg-[#9044C4] text-white py-1 rounded-md text-[15px] font-bold transition 
      hover:bg-purple-700 active:scale-95 active:bg-purple-800">
      Log in
    </button>
  </form>
</div>


{console.log(data.feed)}


