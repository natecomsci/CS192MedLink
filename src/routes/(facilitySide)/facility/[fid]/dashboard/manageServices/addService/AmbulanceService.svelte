<script lang='ts'>
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

        <!-- Hours of Operation -->
        <div class="mt-4 bg-white p-4 rounded-lg shadow">
            <label class="block text-gray-700">Hours of Operation
                <div class="flex items-center gap-2">
                    <input 
                    class="border p-2 rounded w-30"
                    name="opening"
                    type="time"
                    value="08:00" 
                    required
                    >
                    to
                    <input 
                    class="border p-2 rounded w-30"
                    name="closing"
                    type="time"
                    value="16:00" 
                    required
                    >
                    {#if form?.description === "openClose"}
                        <p class="error">{form.error}</p>
                    {/if}
                </div>
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

        <!-- Coverage Radius -->
        <div class="mt-4 bg-white p-4 rounded-lg shadow">
            <label class="block text-gray-700">Coverage Radius
                <div class="flex gap-2">
                    <label>
                        Minimum coverage radius
                        <input 
                        name="minCoverageRadius" 
                        type="number"
                        placeholder=1
                        class = "border p-2 rounded w-20"
                        step=0.01
                        min=0
                        required
                        >
                        km
                    </label>
                    
                    <label>
                        Maximum coverage radius
                        <input 
                        name="maxCoverageRadius" 
                        type="number"
                        placeholder=1
                        class = "border p-2 rounded w-20"
                        step=0.01
                        min=0
                        required
                        >
                        km
                    </label>
                    {#if form?.description === "coverage"}
                        <p class="error">{form.error}</p>
                    {/if}
                </div>
            </label>
        </div>

        <!-- Mileage Rate -->
        <div class="mt-4 bg-white p-4 rounded-lg shadow">
            <label class="block text-gray-700">Mileage Rate
                <input 
                    name="mileageRate" 
                    type="number" 
                    class="border p-2 rounded w-full" 
                    placeholder="Mileage Rate" 
                    step=0.01
                    min=0
                    required 
                />
                {#if form?.description === "mileRate"}
                    <p class="error">{form.error}</p>
                {/if}
            </label>
        </div>

    </div>

