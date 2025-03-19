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

    <!-- Turnaround Time -->
    <div class="card">
        <label>
            <span class="text-label">Turnaround Time</span>
            <div class="flex-container">
                <input 
                    type="number" 
                    name="turnaroundDays"
                    class="input-box w-30" 
                    placeholder="Days" 
                />
                Days
                <input 
                    type="number" 
                    name="turnaroundHours"
                    class="input-box w-30" 
                    placeholder="Hours" 
                />
                Hours
            </div>
        </label>
    </div>
</div>