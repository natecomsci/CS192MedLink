<script lang="ts">
  import type { PageProps } from "./$types";
  import { enhance } from '$app/forms';
    import { availability } from "$lib/projectArrays";

  let { data, form }: PageProps = $props();
</script>

<h1 class="text-3xl font-bold underline">
  Edit Service
</h1>

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
                  <p class="error">{form.error}</p>
              {/if}
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
                  value={data.openingTime}
                  required
                  >
                  to
                  <input 
                  class="border p-2 rounded w-30"
                  name="closing"
                  type="time"
                  value={data.closingTime}
                  required
                  >
                  {#if form?.description === "openClose"}
                      <p class="error">{form.error}</p>
                  {/if}
              </div>
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
                  <p class="error">{form.error}</p>
              {/if}
          </label>
      </div>

      <!-- Coverage Radius -->
      <div class="mt-4 bg-white p-4 rounded-lg shadow">
          <label class="block text-gray-700">Coverage Radius
              <div class="flex gap-2">
                  <label>
                      Minimum coverage radius
                      <input 
                      name="minCoverageRadius" 
                      type="number"
                      placeholder=1
                      class = "border p-2 rounded w-20"
                      step=0.01
                      min=0
                      value={data.minCoverageRadius}
                      required
                      >
                      km
                  </label>
                  
                  <label>
                      Maximum coverage radius
                      <input 
                      name="maxCoverageRadius" 
                      type="number"
                      placeholder=1
                      class = "border p-2 rounded w-20"
                      step=0.01
                      min=0
                      value={data.maxCoverageRadius}
                      required
                      >
                      km
                  </label>
                  {#if form?.description === "coverage"}
                      <p class="error">{form.error}</p>
                  {/if}
              </div>
          </label>
      </div>

      <!-- Mileage Rate -->
      <div class="mt-4 bg-white p-4 rounded-lg shadow">
          <label class="block text-gray-700">Mileage Rate
              <input 
                  name="mileageRate" 
                  type="number" 
                  class="border p-2 rounded w-full" 
                  placeholder="Mileage Rate" 
                  step=0.01
                  min=0
                  value={data.mileageRate}
                  required 
              />
              {#if form?.description === "mileRate"}
                  <p class="error">{form.error}</p>
              {/if}
          </label>
      </div>

      <div class="mt-4 bg-white p-4 rounded-lg shadow">
        <label>
            Availability

          <select name="availability" value={data.availability} required class="border p-2 rounded w-full">
            {#each (availability ?? []) as a}
              <option value={a}>{a}</option>
            {/each}
          </select>
        </label>
      </div>
      <button class="mt-auto bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700">
          Edit Service
      </button>
  </div>
</form>
