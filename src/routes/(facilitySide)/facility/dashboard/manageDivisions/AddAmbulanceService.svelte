<script lang="ts">
    // let { i }: { i:number } = $props();
</script>

<div class="container">
    <!-- Phone Number -->
    <div class="card">
        <label>
            <span class="text-label">Phone No.</span>
            <input 
                class="input-box" 
                name="phoneNumber"
                type="tel"
                value="+63 9"
            />
        </label>
    </div>

    <!-- Hours of Operation -->
    <div class="card">
        <label>
            <span class="text-label">Hours of Operation</span>
            <div class="flex-container">
                <input 
                    class="input-box w-30"
                    name="opening"
                    type="time"
                    value="08:00"
                >
                <h1 class="text-label">to</h1>
                <input 
                    class="input-box w-30"
                    name="closing"
                    type="time"
                    value="16:00"
                >
            </div>
        </label>
    </div>

    <!-- Price Rate -->
    <div class="card">
        <label>
            <span class="text-label">Base Price</span>
            <input 
                name="price"
                type="number" 
                class="input-box" 
                placeholder="Price"
                step="0.01"
                min="0"
            />
        </label>
    </div>

    <!-- Coverage Radius -->
    <div class="card">
        <label>
            <span class="text-label">Coverage Radius</span>
            <div class="flex-container items-center">
                <label>
                    <span>Minimum</span>
                    <input 
                        name="minCoverageRadius" 
                        type="number"
                        placeholder="1"
                        class="input-box w-30"
                        step="0.01"
                        min="0"
                    >
                    km
                </label>

                <h1 class="text-label">to</h1>
                <label>
                    <span>Maximum</span>
                    <input 
                        name="maxCoverageRadius" 
                        type="number"
                        placeholder="1"
                        class="input-box w-30"
                        step="0.01"
                        min="0"
                    >
                    km
                </label>
            </div>
        </label>
    </div>

    <!-- Mileage Rate -->
    <div class="card">
        <label>
            <span class="text-label">Mileage Rate</span>
            <input 
                name="mileageRate" 
                type="number" 
                class="input-box" 
                placeholder="Mileage Rate" 
                step="0.01"
                min="0"
            />
        </label>
    </div>
</div>
