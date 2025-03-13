<script lang="ts">
    import type { PageProps } from './$types';
    let { data, form }: PageProps = $props();
    const OPServices: String[] = data.availableOPServices ?? [];
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
                {#each OPServices as t}
                  <option value={t}>{t}</option>
                {/each}
            </select>
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

