<script>

</script>

<div class="flex-1 p-6 overflow-y-auto border border-green-100">
        <!-- OPServicetype -->
        <div class="mt-4 bg-white p-4 rounded-lg shadow">
            <label class="block text-gray-700">OP Service Type
                <select
                class="border p-2 rounded w-full"
                name="OPserviceType"
                >
                <option>sample</option>
              </select>
            </label>
        </div>

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

        <!-- Turnaround Time -->
        <div class="mt-4 bg-white p-4 rounded-lg shadow">
            <label class="block text-gray-700 ">Turnaround Time
                <div class="flex items-center gap-2">

                    <input 
                        type="number" 
                        name="turnaroundDays"
                        class="border p-2 rounded  w-30" 
                        placeholder="Days" 
                        required />
                    Days
                
                    <input 
                    type="number" 
                    name="turnaroundHours"
                    class="border p-2 rounded  w-30" 
                    placeholder="Hours" 
                    required
                    />
                    Hours
                </div>
            </label>
        </div>



        <!-- Walkins -->
        <div class="mt-4 bg-white p-4 rounded-lg shadow">
            <label>
                Accepts Walk-ins
                <input 
                  name="acceptWalkins" 
                  type="checkbox"
                >
              </label>
        </div>
    
    </div>

