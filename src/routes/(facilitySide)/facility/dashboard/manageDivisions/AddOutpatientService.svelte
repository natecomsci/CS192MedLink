<script lang="ts">
    import type { PageData } from './$types';
    let { i, data }: { i: number, data: PageData} = $props();
    const OPServices: String[] = data.availableOPServices ?? [];
</script>

<div class="container">
    <!-- OPServicetype -->
    <div class="card">
        <label>
            <span class="text-label">OP Service Type</span>
            <select 
                name="OPserviceType{i}"
                class="input-box"
                 
              >
                {#each OPServices as t}
                  <option value={t}>{t}</option>
                {/each}
            </select>
        </label>
    </div>


    <!-- Turnaround Time -->
    <div class="card">
        <label >
            <span class="text-label">Completion Time</span>
            <div class="flex items-center gap-2">

                <input 
                    type="number" 
                    name="completionDays{i}"
                    class="input-box w-30"
                    placeholder="Days" 
                     />
                Days
            
                <input 
                type="number" 
                name="completionHours{i}"
                class="input-box w-30"
                placeholder="Hours" 
                
                />
                Hours
            </div>
        </label>
    </div>



    <!-- Walkins -->
    <div class="card">
        <label class="flex items-center gap-2">
            <span class="text-label">Accepts Walk-ins</span>
            <input 
                name="acceptWalkins{i}" 
                type="checkbox"
                class="w-5 h-5 rounded border-2 border-gray-400 
                    accent-purple-500 cursor-pointer"
            >
        </label>
    </div>



    <!-- Price Rate -->
    <div class="card">
        <label >
            <span class="text-label">Base Price</span>
            <input 
                name="price{i}"
                type="number" 
                class="input-box"
                placeholder="Price"
                step=0.01
                min=0
                 
            />
        </label>
    </div>

</div>

