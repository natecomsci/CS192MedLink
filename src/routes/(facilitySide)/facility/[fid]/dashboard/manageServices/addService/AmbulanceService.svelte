<script>
    let opensAt = $state('');
    let closesAt = $state('');
    let phone = $state('');
    let price1 = $state('');
    let mileageRate = $state('');
</script>

<div class="flex-1 p-6 overflow-y-auto border border-green-100">
        <!-- Phone Number -->
        <div class="mt-4 bg-white p-4 rounded-lg shadow">
            <label class="block text-gray-700">Phone No.
                <input type="text" class="border p-2 rounded w-full" placeholder="Phone No." />
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
                    required 
                    />
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
                        required
                        >
                        km
                    </label>
                </div>
            </label>
        </div>

        <!-- Mileage Rate -->
        <div class="mt-4 bg-white p-4 rounded-lg shadow">
            <label class="block text-gray-700">Mileage Rate
            <input 
                type="number" 
                class="border p-2 rounded w-full" 
                placeholder="Mileage Rate" />
            </label>
        </div>

    </div>

