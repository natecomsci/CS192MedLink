<script>
    let opensAt = "";
    let closesAt = "";
    let phone = "";
    let turnaroundHours = "";
    let turnaroundDays = "";
    let price1 = "";
    let mileageRate = "";
</script>

<div class="flex-1 p-6 overflow-y-auto border border-green-100">
        <!-- Phone Number -->
        <div class="mt-4 bg-white p-4 rounded-lg shadow">
            <label class="block text-gray-700">Phone No.</label>
            <input type="text" bind:value={phone} class="border p-2 rounded w-full" placeholder="Phone No." />
        </div>

        <!-- Hours of Operation -->
        <div class="mt-4 bg-white p-4 rounded-lg shadow">
            <label class="block text-gray-700">Hours of Operation</label>
            <div class="flex gap-2">
                <select bind:value={opensAt} class="border p-2 rounded w-20">
                    <option>Opens at</option>
                    <option>08:00 AM</option>
                    <option>09:00 AM</option>
                </select>
                to
                <select bind:value={closesAt} class="border p-2 rounded w-20">
                    <option>Closes at</option>
                    <option>05:00 PM</option>
                    <option>06:00 PM</option>
                </select>
            </div>
        </div>

        <!-- Price Rate -->
        <div class="mt-4 bg-white p-4 rounded-lg shadow">
            <label class="block text-gray-700">Price Per Unit</label>
            <input type="text" bind:value={price1} class="border p-2 rounded w-full" placeholder="Price" />
        </div>

        <!-- Coverage Radius -->
        <div class="mt-4 bg-white p-4 rounded-lg shadow">
            <label class="block text-gray-700">Coverage Radius</label>
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
        </div>

        <!-- Mileage Rate -->
        <div class="mt-4 bg-white p-4 rounded-lg shadow">
            <label class="block text-gray-700">Mileage Rate</label>
            <input type="text" bind:value={mileageRate} class="border p-2 rounded w-full" placeholder="Mileage Rate" />
        </div>

    </div>

