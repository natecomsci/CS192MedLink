<script lang="ts">
  import type { RegionDTO, POrCDTO, COrMDTO, BrgyDTO } from '$lib/server/dtos';
  import type { PageProps } from './$types';
  

  let region: String = $state('Region');
  let province: String = $state('Province');
  let city: String = $state('City');
  let barangay: String = $state('Barangay');
  let street: String = $state('Street');

  let provinceList: POrCDTO[] = [];
  let cityList: COrMDTO[] = [];
  let barangayList: BrgyDTO[] = [];

  let { data }: PageProps = $props();

  let form;

  const getProvinces = async () => {
    let responseMessage = '';

    try {
      const response = await fetch("./updateFacilityInfo", {
        method: "POST", // Method
        headers: {
          "Content-Type": "application/json", // Set Content-Type to JSON
        },
        body: JSON.stringify({regionID: Number(region)}), // Convert JavaScript object to JSON string
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        responseMessage = data.message; 
      } else {
        responseMessage = "Error: Unable to send data.";
      }
    } catch (error) {
      console.error(error);
      responseMessage = "Network error occurred.";
    }

    console.log(responseMessage)
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
    {console.log(data.regions)}
      <select name="region" bind:value={region} required onchange={() => getProvinces()}>
        {#each data.regions as { regionID, name }}
          <option value={regionID}>{name}</option>
        {/each}
      </select>

      <p>{region}</p>
    </div>
    
  </label>

</form>

