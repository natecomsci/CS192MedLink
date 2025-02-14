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
    <img 
      src={Logo} 
      alt="MedLink logo" 
      width="100" 
      height="100"/>

    <h1 class="text-3xl font-bold underline">
      MedLink
    </h1>
  </div>

  <form 
    method="POST"
    class="grid grid-cols-1 bg-gray-400 m-6 space-y-2 rounded-2xl p-6"
  >
    <h2>SIGN IN</h2>
    <input 
      name="fid"
      type="text"
      bind:value={fid}
      placeholder="Employee ID" 
      class="bg-white rounded-md"
      required
    >

    <div
      class="bg-white rounded-md"
    >
      <input 
        name="password" 
        type={show ? "text" : "password"}
        bind:value={password}
        placeholder="Password" 
        required
      >
      <label
        class="text-purple-500 pr-2"
      >
        {show ? "hide" : "show"}
        <input type="button" onclick={() => show = !show}>
      </label>

    </div>
      

    <button type="submit" class="text-white bg-purple-700 rounded-2xl">Log in</button>
  </form>
</div>


{console.log(data.feed)}
