<script lang="ts">
  import type { PageProps } from './$types';
  import { load } from '$lib/projectArrays';
  import { enhance } from '$app/forms';

  import { OPServiceTypes } from '$lib/projectArrays';

  let { data, form }: PageProps = $props();
</script>

<form method="POST" 
    action="?/updateService"
    use:enhance
  >
    <div class="flex-1 p-6 overflow-y-auto border border-green-100">

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

        <div class="mt-4 bg-white p-4 rounded-lg shadow">
          <label>
            isAvailable
            <input 
              name="isAvailable" 
              type="checkbox"
            >
          </label>
          <label>
            acceptsWalkIns
            <input 
              name="acceptsWalkIns" 
              type="checkbox"
            >
          </label>
        </div>
    </div>
</form>
