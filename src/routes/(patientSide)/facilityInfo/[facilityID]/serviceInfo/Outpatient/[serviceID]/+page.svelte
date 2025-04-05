<script lang="ts">
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();

  let facilityName        = $state(data.facilityName);
  let facilityAddress     = $state(data.facilityAddress) ;
  let price               = $state(data.price);
  let completionTimeD     = $state(data.completionTimeD);
  let completionTimeH     = $state(data.completionTimeH);
  let isAvailable         = $state(data.isAvailable);
  let acceptsWalkIns      = $state(data.acceptsWalkIns);
  let divisionID          = $state(data.divisionID);
  let updatedAt           = $state(data.updatedAt);

  // Rereplace ito? Dagdag ni elle
  let service = "Outpatient Service Details"
  let addressParts = facilityAddress?.split(",").map(part => part.trim());
  let street            = addressParts ? addressParts[0] : "N/A";
  let barangay          = addressParts ? addressParts[1] : "N/A";
  let cityMunicipality  = addressParts ? addressParts[2] : "N/A";
  let province          = addressParts ? addressParts[3] : "N/A";
  let region            = addressParts ? addressParts[4] : "N/A";
</script>

<div class="max-w-md mx-auto bg-[#FDFCFD] shadow-lg ">
  <div class=" bg-gray-100 p-5 border-b border-gray-300 flex justify-between items-center">
    <button class="text-gray-600 hover:text-gray-900">✖</button>
    <h2 class="text-xl font-bold text-center flex-1 -ml-4"><strong>{facilityName}</strong></h2>
  </div>

  <!-- Service and Info!!!-->
  <div class="p-5 max-h-[calc(100vh-100px)] overflow-y-auto">
    <!-- Facility Type  Service Details-->
    <p class="text-[#6F3990] text-center font-bold text-l">{service}</p>
    <hr class="my-2 border-gray-300">

    <!-- Availability Status -->
    <div class="text-center my-4">
      <p class="text-[#9044C4] font-semibold">Availability Status</p>
      <div class="flex justify-center mt-2">
        {#if isAvailable}
          <span class="bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2">
            ✔ Available
          </span>
        {:else}
          <span class="bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2">
            ✖ Unavailable
          </span>
        {/if}
      </div>
    </div>
    {#if data.fromSearch}
    <hr class="my-4 border-gray-300"> <!-- Line -->
    <!-- Location -->
    <div class="mt-4">
      <p class="text-[#9044C4] font-semibold flex items-center gap-2">
        📍 Location
      </p>
      <p class="text-gray-600 text-sm">
        {street}<br>
        {barangay}, {cityMunicipality}<br>
        {province}, {region}
      </p>
    </div>
    {/if}

  

    <hr class="my-4 border-gray-300">

    <!-- Contact Information -->
    <div>
      <p class="text-[#9044C4] font-semibold flex items-center gap-2">
        ☎ Contact Information and Hours
      </p>
      <p class="text-gray-700 text-sm">
        <strong>Phone Number:</strong> 0900 000 0000
      </p>
      <p class="text-gray-700 text-sm">
        <strong>Hours:</strong> 00:00 AM – 00:00 PM
      </p>
    </div>

    <hr class="my-4 border-gray-300">

    <!-- Details -->
    <div>
      <p class="text-[#9044C4] font-semibold flex items-center gap-2">
        📝 Details
      </p>
      <p class="text-gray-700 text-sm">
        <strong>Walk-Ins:</strong> <span class={acceptsWalkIns ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{acceptsWalkIns ? "Yes" : "No"}</span>
      </p>
      <p class="text-gray-700 text-sm">
        <strong>Completion Time:</strong> {completionTimeD} Day, {completionTimeH} Hours
      </p>
      <p class="text-gray-700 text-sm">
        <strong>Base Price:</strong> Php {price} 
      </p>
      <p class="text-gray-700 text-sm">
        <strong>Division ID:</strong> {divisionID}
      </p>
    </div>

    <hr class="mt-4 border-gray-300">
   <p class="mt-2 text-gray-500 text-sm"><em>Last Updated:</em> {updatedAt ?? "N/A"}</p>
  </div>
  {#if data.fromSearch}
  <!-- View Facility Page Button -->
  <div class="flex bg-white pb-10 pt-5  justify-center">
    <a href={"/facilityInfo/"+(data.facilityID ?? '')} class="bg-purple-500 text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 hover:bg-purple-600 transition">
      View Facility Page →
    </a>
  </div>
  {/if}
</div>

