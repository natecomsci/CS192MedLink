<script lang="ts">
    import { enhance } from '$app/forms';
    import Placeholder from '$lib/images/catle.jpg';
    let currentPassword = "";
    let newPassword = "";

    function updatePassword() {
        console.log("Updating password... CHECK");
    }

</script>
<!--   
  <div class="grid grid-cols-1 justify-items-center p-8">
    <form 
      method="POST"
      action="?/signOut"
      class="w-96 grid grid-cols-1 bg-white m-0 space-y-8 rounded-2xl p-8 drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
      use:enhance
    >
      <h3 class="text-[25px] font-black font-['DM_Sans'] mb-0">SIGN OUT</h3>
  
      <button 
        type="submit" 
        class="font-['Inter'] w-full bg-red-500 text-white py-3 rounded-md text-[15px] font-bold transition 
        hover:bg-red-600 active:scale-95 active:bg-red-700">
        Log out
      </button>
    </form>
  </div>
   -->
  
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
        <!-- Profile Image -->
        <img src={Placeholder} alt="Profile" class="w-32 h-32 mx-auto rounded-full mb-4">

        <!-- Password Fields -->
        <div class="text-left">
            <label class="block font-semibold mb-1">Current Password
              <input type="password" bind:value={currentPassword} class="w-full p-2 border rounded mb-4" placeholder="Password">

            </label>

            <label class="block font-semibold mb-1">New Password
              <input type="password" bind:value={newPassword} class="w-full p-2 border rounded mb-4" placeholder="Password">
            </label>
        </div>

        <!-- Buttons Update  -->
        <button class="w-full py-2 bg-purple-600 text-white font-semibold rounded-lg mb-3 hover:bg-purple-700" on:click={updatePassword}>
            Update
        </button>
        
        <!-- Sign oUT -->
        <form 
          method="POST"
          action="?/signOut"
          use:enhance
        >    
          <button 
            type="submit" 
            class="w-full py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
            >
            Sign out
          </button>
        </form>
    </div>
</div>