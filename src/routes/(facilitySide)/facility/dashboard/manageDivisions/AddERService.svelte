<script lang="ts">
    let { i }: { i:number } = $props();
</script>

<div class="container">
    <!-- Phone Number -->
    <div class="card">
        <label>
            <span class="text-label">Phone No.</span>
            <input 
                class="input-box" 
                name="phoneNumber{i}"
                type="tel"
                value="+63 9"
                 
            />
        </label>
    </div>
</div>