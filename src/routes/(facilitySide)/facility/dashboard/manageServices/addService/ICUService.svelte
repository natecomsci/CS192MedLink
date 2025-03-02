<script lang="ts">
    import type { PageProps } from './$types';
    let { data, form }: PageProps = $props();
</script>

<div class="flex-1 p-6 overflow-y-auto border border-green-100">
    <!-- Phone Number -->
    <div class="mt-4 bg-white p-4 rounded-lg shadow">
        <label class="block text-gray-700">Phone No.
            <input 
                class="border p-2 rounded w-full" 
                name="phoneNumber"
                type="tel"
                value="+63 9"
                required 
            />
            {#if form?.description === "phoneNumber"}
                <p class="error">{form.error}</p>
            {/if}
        </label>
    </div>

    <!-- Price Rate -->
    <div class="mt-4 bg-white p-4 rounded-lg shadow">
        <label class="block text-gray-700">Base Price
            <input 
                name="price" 
                type="number" 
                class="border p-2 rounded w-full" 
                placeholder="Price" 
                step=0.01
                min=0
                required 
            />
            {#if form?.description === "price"}
                <p class="error">{form.error}</p>
            {/if}
        </label>
    </div>
</div>

