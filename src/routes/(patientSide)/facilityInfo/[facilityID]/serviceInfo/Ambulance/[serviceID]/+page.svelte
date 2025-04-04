<script lang="ts">
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();

  let facilityName       = $state(data.facilityName);
  let facilityAddress    = $state(data.facilityAddress);
  let phoneNumber       = $state(data.phoneNumber);
  let openingTime       = $state(data.openingTime);
  let closingTime       = $state(data.closingTime);
  let baseRate          = $state(data.baseRate);
  let minCoverageRadius = $state(data.minCoverageRadius);
  let mileageRate       = $state(data.mileageRate);
  let maxCoverageRadius = $state(data.maxCoverageRadius);
  let availability      = $state(data.availability);
  let updatedAt         = $state(data.updatedAt);

  // Rereplace ito? Dagdag ni elle
  let service = "Ambulance"
  function formatTime(time, showTimeZone = false) {
    if (!time) return "N/A";
    const date = new Date(time);
    let formatted = date.toLocaleTimeString("en-SG", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Ensures AM/PM format
      timeZoneName: showTimeZone ? "short" : undefined,
    });
    formatted = formatted.replace(/am|pm/gi, (match) => match.toUpperCase()); // Capitalize
    return formatted;     // Return formatted time (with or without time zone) 
  }

  let formattedTime = openingTime && closingTime
    ? `${formatTime(openingTime)} - ${formatTime(closingTime, true)}`
    : "N/A";

</script>

<div class="max-w-md mx-auto bg-[#FDFCFD] shadow-lg ">
  <!-- Header Facility Name -->
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
        {#if availability}
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
     <hr class="my-4 border-gray-300"> <!-- Line -->   
  <!-- View Facility Page Button -->
  <div class="text-center my-4">
    <div class="flex justify-center mt-2">
      {#if availability}
      <a 
        href={"/facilityInfo/" + (data.facilityID ?? '') + "/serviceInfo" + "/Ambulance/ "+ (data.serviceID ?? '') + "/callAnAmbulance"} 
        class="bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2"
      >
        ✔ Request an Ambulance
      </a>
      {:else}
        <span class="bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2">
          ✖ Unable to Request an Ambulanace
        </span>
      {/if}
    </div>
  </div>
    <hr class="my-4 border-gray-300"> <!-- Line -->

    <!-- Location -->
    <div class="mt-4">
      <p class="text-[#9044C4] font-semibold flex items-center gap-2">
        📍 Location
      </p>
        <!-- {street}<br>
        {barangay}, {cityMunicipality}<br>
        {province}, {region} -->
        <!-- {facilityAddress ? `${facilityAddress.street},
        ${facilityAddress.barangay}, ${facilityAddress.city}, 
        ${facilityAddress.province}, ${facilityAddress.region}` : "Address not available"} -->
      
      <p class="text-gray-600 text-sm">
        {@html facilityAddress 
          ? `${facilityAddress.street} <br>
            ${facilityAddress.barangay}, ${facilityAddress.city} <br>
            ${facilityAddress.province}, ${facilityAddress.region}`
          : "Address not available"}
      </p>
    </div>
    <hr class="my-4 border-gray-300">

    <!-- Contact Information -->
    <div>
      <p class="text-[#9044C4] font-semibold flex items-center gap-2">
        ☎ Contact Information and Hours
      </p>
      <p class="text-gray-700 text-sm">
        <strong>Phone Number:</strong> {phoneNumber}
      </p>
      <p class="text-gray-700 text-sm">
        <strong>Hours:</strong> {formattedTime}
      </p>
    </div>

    <hr class="my-4 border-gray-300">

    <!-- Details -->
    <div>
      <p class="text-[#9044C4] font-semibold flex items-center gap-2">
        📝 Details
      </p>
      <p class="text-gray-700 text-sm">
        <strong>Minimum Coverage Radius:</strong> {minCoverageRadius}
      </p>
      <p class="text-gray-700 text-sm">
        <strong>Base Rate:</strong> Php {baseRate} 
      </p>
      <p class="text-gray-700 text-sm">
        <strong>Maximum Coverage Radius:</strong> {maxCoverageRadius}
      </p>
      <p class="text-gray-700 text-sm">
        <strong>Mileage Rate:</strong> Php {mileageRate} 
      </p>
    </div>

    <hr class="mt-4 border-gray-300">
    <p class="mt-2 text-gray-500 text-sm"><em>Last Updated:</em> {updatedAt ?? "N/A"}</p>  
  </div>
  <!-- View Facility Page Button -->
  <div class="flex bg-white pb-10 pt-5  justify-center">
    <a href={"/facilityInfo/"+(data.facilityID ?? '')} class="bg-purple-500 text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 hover:bg-purple-600 transition">
      View Facility Page →
    </a>
  </div>
</div>

