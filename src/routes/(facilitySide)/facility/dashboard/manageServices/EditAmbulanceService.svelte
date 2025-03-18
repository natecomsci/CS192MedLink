<script lang="ts">
  import type { PageProps } from "./$types";
  import { enhance } from '$app/forms';
    import { availability } from "$lib/projectArrays";

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
    
            <!-- Coverage Radius -->
            <div class="card">
                <label><span class ="text-label">Coverage Radius</span>
                    <div class="flex gap-2">
                        <label>
                            Minimum coverage radius
                            <input 
                            name="minCoverageRadius" 
                            type="number"
                            placeholder=1
                            class = "input-box w-30"
                            step=0.01
                            min=0
                            
                            >
                            km
                        </label>
                        
                        <label>
                            Maximum coverage radius
                            <input 
                            name="maxCoverageRadius" 
                            type="number"
                            placeholder=1
                            class = "input-box w-30"
                            step=0.01
                            min=0
                            
                            >
                            km
                        </label>
                    </div>
                </label>
            </div>
    
            <!-- Mileage Rate -->
            <div class="card">
                <label><span class ="text-label">Mileage Rate</span>
                    <input 
                        name="mileageRate" 
                        type="number" 
                        class="input-box" 
                        placeholder="Mileage Rate" 
                        step=0.01
                        min=0
                        
                    />
                </label>
            </div>
    
            <div class="card">
            <label>
                <span class="text-label">Availability</span>
                <select name="availability"  class="input-box">
                {#each availability as a}
                    <option value={a}>{a}</option>
                {/each}
                </select>
            </label>
            </div>
        </div>
    


    </label>
</form>
