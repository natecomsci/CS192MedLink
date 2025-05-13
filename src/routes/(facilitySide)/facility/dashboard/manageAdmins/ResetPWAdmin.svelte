<script lang="ts">
  import { resetAdminPassword } from "$lib/postHandlers"

  let { adminID, currPopUp = $bindable(), ResetPW = $bindable() }: {adminID: String, currPopUp: String, ResetPW: Boolean} = $props();

  let showNewPassword = $state(false)
  let newPassword = $state('')
  let passwordConfirmation = $state('')

  let errorShown = $state('')

  async function resetPassword() {
    const rv = await resetAdminPassword(adminID, passwordConfirmation)
    if (rv.success) {
      showNewPassword = true
      newPassword = rv.value
    } else {
      showNewPassword = false
      errorShown = rv.value
    }
  }

</script>

<div class="fixed inset-0 bg-black/50 flex items-center z-51">
  <div class="min-h-[500px] max-w-3xl mx-auto p-10 bg-background rounded-[50px] shadow-md flex flex-col">
    <div class="flex items-center gap-5">
        <button onclick={() => ResetPW = false} data-sveltekit-reload type="button">
            <img src="/back_icon.svg" alt="Back" class="w-6 h-6 cursor-pointer transition-colors duration-200 hover:opacity-70 active:opacity-50"/>
        </button>
        <h3 class=" text-gray-800 text-[25px] font-black">Reset Password</h3>
    </div>

    <label class="mt-5">
        <span class = "text-label">Confirm Password to Reset</span>
        <input type = "text" name = "passwordConfirmation" class="input-box" bind:value={passwordConfirmation} placeholder="Confirm Password">
    </label>


    <div class="flex flex-col mt-5">
        {#if showNewPassword}
          <span class = "text-label">Generated Password:</span>
          <p  class="text-[20px] font-semibold font-t">
            {newPassword}
          </p>
          <!-- <button type="button" class="text-purple-500 hover:underline" onclick={() => {ResetPW = true; }}>
          Copy Button
          </button> -->
        {/if}
    </div>

    <p class="text-red-500 font-semibold">
      {errorShown}
    </p>

    <!-- Buttons (Sticks to the Bottom) -->
    <div class="flex justify-between mt-auto">
      <button type="submit" class="mt-auto bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700" onclick={() => resetPassword()} data-sveltekit-reload>
          Update Password
      </button>

    </div>
</div>
</div>



<style>
  /*.profile-pic {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
    background: gray;
  }*/
</style>