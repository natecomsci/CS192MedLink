<script lang="ts">
  import type { PageProps } from './$types';
  import { load } from '$lib/projectArrays';
  import { enhance } from '$app/forms';

  let { data, form }: PageProps = $props();
</script>

<form method="POST" 
    action="?/updateService"
    use:enhance
  >
    <div class="flex-1 p-6 overflow-y-auto border border-green-100">
        <!-- Phone Number -->
        <div class="mt-4 bg-white p-4 rounded-lg shadow">
            <label class="block text-gray-700">Phone No.
                <input 
                    class="border p-2 rounded w-full" 
                    name="phoneNumber"
                    type="tel"
                    value={data.phoneNumber}
                    required 
                />
                {#if form?.description === "phoneNumber"}
                    <p class="error">{form?.error}</p>
                {/if}
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
                    value={data.baseRate}
                    required 
                />
                {#if form?.description === "price"}
                    <p class="error">{form?.error}</p>
                {/if}
            </label>
        </div>

        <div class="mt-4 bg-white p-4 rounded-lg shadow">
            <label>
                Load
                <select name="load" value={data.load} required class="border p-2 rounded w-full">
                    {#each load as a}
                        <option value={a}>{a}</option>
                    {/each}
                </select>

            </label>
        </div>

        <div class="mt-4 bg-white p-4 rounded-lg shadow">
            <label class="block text-gray-700">
              Available Beds
                <input 
                    name="availableBeds" 
                    type="number" 
                    class="border p-2 rounded w-full" 
                    placeholder="Price" 
                    step=0.01
                    min=0
                    value={data.availableBeds}
                    required 
                />
                {#if form?.description === "availableBeds"}
                    <p class="error">{form?.error}</p>
                {/if}
            </label>
        </div>


        <div class="mt-4 bg-white p-4 rounded-lg shadow">
            <label>
              Support
              <label>
                cardiacSupport
                <input 
                  name="cardiacSupport" 
                  type="checkbox"
                  checked={data.cardiacSupport}
                >
              </label>
              <label>
                neurologicalSupport
                <input 
                  name="neurologicalSupport" 
                  type="checkbox"
                  checked={data.neurologicalSupport}
                >
              </label>
              <label>
                renalSupport
                <input 
                  name="renalSupport" 
                  type="checkbox"
                  checked={data.renalSupport}
                >
              </label>
              <label>
                respiratorySupport
                <input 
                  name="respiratorySupport" 
                  type="checkbox"
                  checked={data.respiratorySupport}
                >
              </label>
            </label>
        </div>
        {#if form?.description === "button"}
            <p class="error">{form.error}</p>
        {/if}
        <button class="mt-auto bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700">
          Edit Service
        </button>
    </div>
</form>
