<script>
    export let divisionName = "Default Division";
</script>

<div class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

    <div class="relative flex flex-col rounded-2xl bg-background items-center justify-center w-100 h-100">
        <!-- Back Button -->
        <button class="absolute top-5 left-5 text-lg text-gray-600 hover:text-black">
            ← Back
        </button>

        <!-- Success Icon & Message -->
        <div class="text-green-500 text-6xl">✔</div>
        <p class="text-2xl font-semibold mt-3">Successfully Created</p>
        
        <!-- Dynamic Division Name -->
        <p class="text-xl text-purple-600 mt-1">{divisionName}</p>
    </div>

</div>