<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageProps } from './$types';
    let { data, form }: PageProps = $props();
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
                <label><span class ="text-label">Phone No.</span>
                    <input 
                        class="input-box" 
                        name="phoneNumber"
                        type="tel"
                        
                        
                    />
                </label>
            </div>
    
            <!-- Hours of Operation -->
            <div class="card">
                <label><span class ="text-label">Hours of Operation</span>
                    <div class="flex items-center gap-2">
                        <input 
                        class="input-box w-30"
                        name="opening"
                        type="time"
                        
                        >
                        to
                        <input 
                        class="input-box w-30"
                        name="closing"
                        type="time"
                        
                        >
                    </div>
                </label>
            </div>
    
            <!-- Price Rate -->
            <div class="card">
                <label><span class ="text-label">Base Price</span>
                    <input 
                        name="price"
                        type="number" 
                        class="input-box" 
                        placeholder="Price"
                        step=0.01
                        min=0
                        
                    />
                </label>
            </div>

            <!-- Turnaround Time -->
            <div class="card">
                <label>
                    <span class="text-label">Turnaround Time</span>
                    <div class="flex items-center gap-2">
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
    

<div class="mt-4 bg-white p-4 rounded-lg shadow">
    <label class="block text-label mb-2">Blood Type Availability</label>
    <div class="grid grid-cols-2 gap-2">
        <label class="flex items-center space-x-2">
            <input name="ap" type="checkbox">
            <span>A+</span>
        </label>
        <label class="flex items-center space-x-2">
            <input name="an" type="checkbox">
            <span>A-</span>
        </label>
        <label class="flex items-center space-x-2">
            <input name="bp" type="checkbox">
            <span>B+</span>
        </label>
        <label class="flex items-center space-x-2">
            <input name="bn" type="checkbox">
            <span>B-</span>
        </label>
        <label class="flex items-center space-x-2">
            <input name="op" type="checkbox">
            <span>O+</span>
        </label>
        <label class="flex items-center space-x-2">
            <input name="on" type="checkbox">
            <span>O-</span>
        </label>
        <label class="flex items-center space-x-2">
            <input name="abp" type="checkbox">
            <span>AB+</span>
        </label>
        <label class="flex items-center space-x-2">
            <input name="abn" type="checkbox">
            <span>AB-</span>
        </label>
    </div>
</div>



    </label>
</form>
