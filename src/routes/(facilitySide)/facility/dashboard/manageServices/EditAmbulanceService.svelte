<script lang="ts">
  import type { ActionData, PageData } from "./$types";

  import { availability } from '$lib/projectArrays'
  
  let { data,
        form, 
        serviceID
      }:{ data: PageData,
          form: ActionData, 
          serviceID: String
        } = $props();

  let phoneNumber: string = $state('')
  let openingTime: Date = $state(new Date())
  let closingTime: Date = $state(new Date())
  let baseRate: number = $state(0)
  let minCoverageRadius: number = $state(0)
  let mileageRate: number = $state(0)
  let maxCoverageRadius: number = $state(0)

  async function getData() {
    const body = JSON.stringify({serviceID, serviceType:"Ambulance"});

    try {
      const response = await fetch("./manageServices/serviceInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const rv = await response.json();

      phoneNumber = rv.phoneNumber
      openingTime = rv.openingTime
      closingTime = rv.closingTime
      baseRate = rv.baseRate
      minCoverageRadius = rv.minCoverageRadius
      mileageRate = rv.mileageRate
      maxCoverageRadius = rv.maxCoverageRadius
      
    } catch (error) {
      throw new Error(`Response status: ${error}`);
    }
  }
  getData()
</script>

<label class="grid grid-cols-1" >
  {#if form?.error}
    <p class="error">{form.error}</p>
  {/if}

  <div class="container">
  <!-- Phone Number -->
    <input 
      class="hidden" 
      name="serviceID"
      type="text"
      value={serviceID}
    />
    <div class="card">
        <label><span class ="text-label">Phone No.</span>
            <input 
                class="input-box" 
                name="phoneNumber"
                type="tel"
                value={phoneNumber}
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
            value={openingTime}
          >
          to
          <input 
            class="input-box w-30"
            name="closing"
            type="time"
            value={closingTime}
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
          value={baseRate}
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
            value={minCoverageRadius}
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
            value={maxCoverageRadius}
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
          value={mileageRate}
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
