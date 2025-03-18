<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageProps } from './$types';
    let { data, form }: PageProps = $props();
    import { load } from '$lib/projectArrays'
</script>


<form method="POST" 
action="?/updateService"
use:enhance
>

    <label class="grid grid-cols-1" >
        {#if form?.error}
              <p class="error">{form.error}</p>
          {/if}
        <div class="container">
            <!-- Phone Number -->
            <div class="card">
                <label><span class="text-label">Phone No.</span>
                    <input 
                        class="input-box" 
                        name="phoneNumber"
                        type="tel"
                         
                    />
                </label>
            </div>
    
            <div class="card">
                <label>
                    <span class="text-label">Load</span>
                    <select name="load" 
                    class="input-box">
                        {#each load as a}
                            <option value={a}>{a}</option>
                        {/each}
                    </select>
    
                </label>
            </div>
    
            <div class="card">
                <label><span class="text-label">
                    Available Beds</span>
                    <input 
                        name="availableBeds"
                        type="number" 
                        class="input-box" 
                        placeholder="Price"
                        step=1
                        min=0
                         
                    />
                </label>
            </div>
    
            <div class="card">
                <label><span class="text-label">
                    Non Urgent Patients</span>
                    <input 
                        name="nonUrgentPatients"
                        type="number" 
                        class="input-box" 
                        placeholder="Price"
                        step=1
                        min=0
                         
                    />
                </label>
            </div>
    
            <div class="card">
                <label><span class="text-label">
                    Non Urgent Patients Queue Length</span>

                    <input 
                        name="nonUrgentQueueLength"
                        type="number" 
                        class="input-box" 
                        placeholder="Price"
                        step=1
                        min=0
                         
                    />
                </label>
            </div>
    
            <div class="card">
                <label><span class="text-label">
                    Urgent Patients</span>
                    <input 
                        name="urgentPatients"
                        type="number" 
                        class="input-box" 
                        placeholder="Price"
                        step=1
                        min=0
                         
                    />
                </label>
            </div>
    
            <div class="card">
                <label><span class="text-label">
                    Urgent Patients Queue Length</span>
                    <input 
                        name="urgentQueueLength"
                        type="number" 
                        class="input-box" 
                        placeholder="Price"
                        step=1
                        min=0
                         
                    />
                </label>
            </div>
    
            <div class="card">
                <label><span class="text-label">
                    Critical Patients</span>
                    <input 
                        name="criticalPatients"
                        type="number" 
                        class="input-box" 
                        placeholder="Price"
                        step=1
                        min=0
                         
                    />
                </label>
            </div>
    
            <div class="card">
                <label><span class="text-label">
                    Critical Patients Queue Length</span>
                    <input 
                        name="criticalQueueLength"
                        type="number" 
                        class="input-box" 
                        placeholder="Price"
                        step=1
                        min=0
                         
                    />
                </label>
            </div>
        </div>
    </label>
</form>
