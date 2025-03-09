<script lang="ts">
    import { enhance } from '$app/forms';
  </script>
  
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
  