<script lang="ts">
    import { enhance } from '$app/forms';
    import { page } from '$app/stores';
    import Placeholder from '$lib/images/TempMan.jpg';

    let currentPassword = "";
    let newPassword = "";

    // Reactive form data from the server response
    $: message = $page.form?.message ?? null;
    $: success = $page.form?.success ?? false;
</script>

<div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
        <!-- Profile Image -->
        <img src={Placeholder} alt="Profile" class="w-32 h-32 mx-auto rounded-full mb-4">

        <!-- Password Update Form -->
        <form 
            method="POST"
            action="?/updatePassword"
            class="text-left"
            use:enhance
        >
            <label class="block font-semibold mb-1">
                Current Password
                <input 
                    type="password" 
                    name="currentPassword" 
                    bind:value={currentPassword} 
                    class="w-full p-2 border rounded mb-2 {message && !success ? 'border-red-500' : ''}" 
                    required
                >
            </label>

            <label class="block font-semibold mb-1">
                New Password
                <input 
                    type="password" 
                    name="newPassword" 
                    bind:value={newPassword} 
                    class="w-full p-2 border rounded mb-4 {message && !success ? 'border-red-500' : ''}" 
                    required
                >
            </label>

            <!-- Feedback Messages -->
            {#if message}
                <p class="text-sm {success ? 'text-green-600' : 'text-red-600'} mb-4">{message}</p>
            {/if}

            <!-- Update Button -->
            <button 
                type="submit"
                class="w-full py-2 bg-purple-600 text-white font-semibold rounded-lg mb-3 hover:bg-purple-700"
            >
                Update Password
            </button>
        </form>
        

    </div>
</div>
