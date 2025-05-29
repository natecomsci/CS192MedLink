<script lang="ts">
    export let action: () => void;
    export let successMessage = "Successfully Created";
    export let createdName = "Default Division";
</script>

<div class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

    <div class="relative flex flex-col rounded-2xl bg-background items-center justify-center w-100 h-80">
        <!-- Back Button -->
        <button type="button" class="absolute top-5 left-5" onclick={action}>
            <img src="/back_icon.svg" alt="Back" class="w-6 h-6 cursor-pointer transition-colors duration-200 hover:opacity-70 active:opacity-50"/>
        </button>

        <!-- Success Icon & Message -->
        <img src="/success_icon.svg" alt="Success" class="w-25 h-25 mt-4"/>
        <p class="text-2xl font-semibold mt-3">{successMessage}</p>
        
        <!-- Dynamic Division Name -->
        <p class="text-xl text-primary-500 mt-1 font-semibold">{createdName}</p>
    </div>

</div>