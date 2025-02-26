<script lang="ts">
  import type { POrCDTO, COrMDTO, BrgyDTO } from '$lib/server/dtos';
  import type { PageProps } from './$types';
  import { enhance } from '$app/forms';
  

  let region: String = $state('Region');
  let province: String = $state('Province');
  let city: String = $state('City');
  let barangay: String = $state('Barangay');
  let street: String = $state('');

  let provinceList: POrCDTO[] = $state([]);
  let cityList: COrMDTO[] = $state([]);
  let barangayList: BrgyDTO[] = $state([]);

  let enableProvinces = $state(false);
  let enableCities = $state(false);
  let enableBarangays = $state(false);
  let enableStreet = $state(false);

  let { data, form }: PageProps = $props();

  const get_ = async (scope: String) => {
    let body = JSON.stringify({})

    if (scope === "province") {
      body = JSON.stringify({regionID: Number(region)});
    } else if (scope === "city") {
      body = JSON.stringify({pOrCID: Number(province)});
    } else if (scope === "brgy") {
      body = JSON.stringify({cOrMID: Number(city)});
    }

    try {
      const response = await fetch("./updateFacilityInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();

      if (scope === "province") {
        provinceList = data;
        enableProvinces = true;
        enableCities = false;
        enableBarangays = false;
        enableStreet = false;
      } else if (scope === "city") {
        cityList = data;
        enableCities = true;
        enableBarangays = false;
        enableStreet = false;
      } else if (scope === "brgy") {
        barangayList = data;
        enableBarangays = true;
        enableStreet = true;
      }

      if (!enableCities) {
        city = "City";
      }
      if (!enableBarangays) {
        barangay = "Barangay";
      }
      if (!enableStreet) {
        street = "";
      }
      
    } catch (error) {
      throw new Error(`Response status: ${error}`);
    }
  }

</script>

<h1 class="text-3xl font-bold underline">
  Edit General Info
</h1>


<form
  class="grid grid-cols-1 bg-gray-400 m-6 space-y-2 rounded-2xl p-6"
  method="POST" 
  use:enhance
>
  <!-- onchange={(e) => {e.currentTarget.requestSubmit()}} -->
  
  <label>
    Facility Photo
    <input 
      name="facilityImage"
      type="file" 
      placeholder="insert link to image..." 
      class="text-white bg-purple-700 rounded-2xl p-2 m-2"
    >
  </label>

  <label>
    Location
    <div class="grid grid-cols-1">
      <select 
        name="region" 
        bind:value={region} 
        onchange={() => get_("province")}
        required 
        class="bg-gray-100"
      >
        {#each data.regions as { regionID, name }}
          <option value={regionID}>{name}</option>
        {/each}
      </select>

      <select 
        name="province" 
        bind:value={province} 
        required 
        onchange={() => get_("city")}
        disabled={!enableProvinces}
        class="bg-gray-200"
      >
        {#each provinceList as { pOrCID, name }}
          <option value={pOrCID}>{name}</option>
        {/each}
      </select>

      <select 
        name="city" 
        bind:value={city} 
        required 
        onchange={() => get_("brgy")}
        disabled={!enableCities}
        class="bg-gray-300"
      >
        {#each cityList as { cOrMID, name }}
          <option value={cOrMID}>{name}</option>
        {/each}
      </select>

      <select 
        name="brgy" 
        bind:value={barangay} 
        required 
        onchange={() => enableStreet ? "" : enableStreet = !enableStreet}
        disabled={!enableBarangays}
        class="bg-gray-400"
      >
        {#each barangayList as { brgyID, name }}
          <option value={brgyID}>{name}</option>
        {/each}
      </select>

      <input 
        name="street"
        type="text"
        required
        disabled={!enableStreet}
        bind:value={street}
        class="bg-gray-500 text-white"
      >

      {#if form?.description === "street"}
          <p class="error">{form.error}</p>
      {/if}
    </div>
    <button type="submit">Submit</button>
    <a href="../dashboard">Cancel</a>

  </label>

</form>

