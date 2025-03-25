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

    <!-- Price Rate -->
    <div class="card">
        <label>
            <span class="text-label">Base Price</span>
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
</div>

