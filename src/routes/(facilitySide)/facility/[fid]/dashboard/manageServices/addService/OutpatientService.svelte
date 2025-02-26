<script lang="ts">
    import type { PageProps } from './$types';
    let { data, form }: PageProps = $props();
</script>

<div class="flex-1 p-6 overflow-y-auto border border-green-100">
        <!-- OPServicetype -->
        <div class="mt-4 bg-white p-4 rounded-lg shadow">
            <label class="block text-gray-700">OP Service Type
                <select 
                    name="OPserviceType" 
                    class="border p-2 rounded w-full"
                    required 
                  >
                    {#each (data.availableOPServices ?? []) as t}
                      <option value={t}>{t}</option>
                    {/each}
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
            <label class="block text-gray-700 ">Completion Time
                <div class="flex items-center gap-2">

                    <input 
                        type="number" 
                        name="completionDays"
                        class="border p-2 rounded  w-30" 
                        placeholder="Days" 
                        required />
                    Days
                
                    <input 
                    type="number" 
                    name="completionHours"
                    class="border p-2 rounded  w-30" 
                    placeholder="Hours" 
                    required
                    />
                    Hours
                </div>
                {#if form?.description === "completion"}
                    <p class="error">{form.error}</p>
                {/if}
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

