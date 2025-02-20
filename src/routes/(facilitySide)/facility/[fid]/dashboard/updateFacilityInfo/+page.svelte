<script lang="ts">
  import type { PageProps } from './$types';
  import type { Region } from "@prisma/client"


  let region: String = $state('1');
  let province: String = $state('Province');
  let barangay: String = $state('Barangay');
  let street: String = $state('Street');

  let provinceList: Region[] = [];
  let barangayList: Region[] = [];
  let streetList: Region[] = [];

  let { data }: PageProps = $props();

  async function getProvinces(regionID: Number) {
    const response = await fetch('./updateFacilityInfo', {
      method: 'POST',
      body: JSON.stringify({ regionID }),
      headers: {
        'content-type': 'application/json'
      }

    });

    provinceList = await response.json();
  }

</script>

<h1 class="text-3xl font-bold underline">
  Edit General Info
</h1>


<form
  class="grid grid-cols-1 bg-gray-400 m-6 space-y-2 rounded-2xl p-6"
>
  
  <label>
    Facility Photo
    <input type="file" class="text-white bg-purple-700 rounded-2xl p-2 m-2">
  </label>

  <label>
    Location
    <div class="grid grid-cols-1">
    
      <select bind:value={region} required onchange={() => getProvinces(Number(region))}>
        {#each data.regions as { regionID, name }}
          <option value={regionID}>{name}</option>
        {/each}
      </select>

      <p>{region}</p>
    </div>
    
  </label>

</form>

