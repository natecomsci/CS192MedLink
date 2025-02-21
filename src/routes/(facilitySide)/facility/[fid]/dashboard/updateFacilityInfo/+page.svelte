<script lang="ts">
  import type { RegionDTO, POrCDTO, COrMDTO, BrgyDTO } from '$lib/server/dtos';
  import type { PageProps } from './$types';
  

  let region: String = $state('Region');
  let province: String = $state('Province');
  let city: String = $state('City');
  let barangay: String = $state('Barangay');
  let street: String = $state('Street');

  let provinceList: POrCDTO[] = $state([]);
  let cityList: COrMDTO[] = $state([]);
  let barangayList: BrgyDTO[] = $state([]);

  let enableProvinces = $state(false);
  let enableCities = $state(false);
  let enableBarangays = $state(false);
  let enableStreet = $state(false);


  let { data }: PageProps = $props();

  const getProvinces = async () => {
    try {
      const response = await fetch("./updateFacilityInfo", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({regionID: Number(region)}),
      });

      if (response.ok) {
        const data = await response.json();
        provinceList = data;
        enableProvinces = true;
      } else {
        throw new Error(`Response status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Response status: ${error}`);
    }
  };

  const getCities = async () => {
    try {
      const response = await fetch("./updateFacilityInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({pOrCID: Number(province)}),
      });

      if (response.ok) {
        const data = await response.json();
        cityList = data;
        enableCities = true;
      } else {
        throw new Error(`Response status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Response status: ${error}`);
    }
  };

  const getBrgys = async () => {
    try {
      const response = await fetch("./updateFacilityInfo", {
        method: "POST", // Method
        headers: {
          "Content-Type": "application/json", // Set Content-Type to JSON
        },
        body: JSON.stringify({cOrMID: Number(city)}), // Convert JavaScript object to JSON string
      });

      if (response.ok) {
        const data = await response.json();
        barangayList = data;
        enableBarangays = true;
      } else {
        throw new Error(`Response status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Response status: ${error}`);
    }
  };

</script>

<h1 class="text-3xl font-bold underline">
  Edit General Info
</h1>


<form
  class="grid grid-cols-1 bg-gray-400 m-6 space-y-2 rounded-2xl p-6"
  method="POST" 
>
  <!-- onchange={(e) => {e.currentTarget.requestSubmit()}} -->
  
  <label>
    Facility Photo
    <input type="file" class="text-white bg-purple-700 rounded-2xl p-2 m-2">
  </label>

  <label>
    Location
    <div class="grid grid-cols-1">
      <select name="region" bind:value={region} required onchange={() => getProvinces()}>
        {#each data.regions as { regionID, name }}
          <option value={regionID}>{name}</option>
        {/each}
      </select>

      <select 
        name="province" 
        bind:value={province} 
        required 
        onchange={() => getCities()}
        disabled={!enableProvinces}
      >
        {#each provinceList as { pOrCID, name }}
          <option value={pOrCID}>{name}</option>
        {/each}
      </select>

      <select 
        name="city" 
        bind:value={city} 
        required 
        onchange={() => getBrgys()}
        disabled={!enableCities}
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
      >
        {#each barangayList as { brgyID, name }}
          <option value={brgyID}>{name}</option>
        {/each}
      </select>

      {#if barangay != "Barangay"}
        <input 
          name="street"
          type="text"
          required
        >
      {/if}

    </div>
    
  </label>

</form>

