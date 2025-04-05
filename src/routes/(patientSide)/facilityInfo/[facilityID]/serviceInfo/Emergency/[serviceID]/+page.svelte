<script lang="ts">
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();

  let facilityName       = $state(data.facilityName);
  let facilityAddress    = $state(data.facilityAddress);
  let phoneNumber        = $state(data.phoneNumber);
  let load               = $state(data.load);
  let availableBeds      = $state(data.availableBeds);
  let nonUrgentPatients  = $state(data.nonUrgentPatients);
  let nonUrgentQueueLength = $state(data.nonUrgentQueueLength);
  let urgentPatients     = $state(data.urgentPatients);
  let urgentQueueLength  = $state(data.urgentQueueLength);
  let criticalPatients   = $state(data.criticalPatients);
  let criticalQueueLength = $state(data.criticalQueueLength);
  let updatedAt          = $state(data.updatedAt);

  let service = "Emergency Room"
  let queueData = [
    { type: "Non-Urgent", inCare: nonUrgentPatients, queue: nonUrgentQueueLength },
    { type: "Urgent", inCare: urgentPatients, queue: urgentQueueLength },
    { type: "Critical", inCare: criticalPatients, queue: criticalQueueLength }
  ];
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

    <!-- Current Load Status -->
    <div class="text-center my-4">
      <p class="text-[#9044C4] font-semibold">Current Load</p>
        <div class="flex justify-center mt-2">
          <span class="bg-[#F5DBA6] text-black font-semibold px-4 py-2 rounded-full flex items-center gap-2">
            {load}
          </span>     
      </div>
      <div class="flex justify-center mt-2">
      </div>
    </div>
    <hr class="my-4 border-gray-300"> <!-- Line -->

    <!-- Table  -->
    <div class="max-w-md mx-auto my-4 ">
      <p class="text-[#9044C4] text-center font-semibold">Queue Status</p>
      <table class="w-full border-collapse border border-purple-400 rounded-lg mt-2">
        <!-- Table Header -->
        <thead>
          <tr class="bg-purple-100">
            <th class="border border-purple-400 px-4 py-2 text-left">Patient Type</th>
            <th class="border border-purple-400 px-4 py-2 text-center">In Care</th>
            <th class="border border-purple-400 px-4 py-2 text-center">Queue</th>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody>
          {#each queueData as row, i}
            <tr class="{i % 2 === 1 ? 'bg-purple-50' : 'bg-white'}">
              <td class="border border-purple-400 px-4 py-2 font-semibold">{row.type}</td>
              <td class="border border-purple-400 px-4 py-2 text-center">{row.inCare ?? "N/A"}</td>
              <td class="border border-purple-400 px-4 py-2 text-center">{row.queue ?? "N/A"}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    {#if data.fromSearch}
    <hr class="my-4 border-gray-300"> <!-- Line -->
    <!-- Location -->
    <div class="mt-4">
      <p class="text-[#9044C4] font-semibold flex items-center gap-2">
        📍 Location
      </p>
      <p class="text-gray-600 text-sm">
        {@html facilityAddress 
          ? `${facilityAddress.street} <br>
            ${facilityAddress.barangay}, ${facilityAddress.city} <br>
            ${facilityAddress.province}, ${facilityAddress.region}`
          : "Address not available"}
      </p>
    </div>
    <hr class="my-4 border-gray-300"> <!-- Line -->

    <!-- Contact Information -->
    <div>
      <p class="text-[#9044C4] font-semibold flex items-center gap-2">
        ☎ Contact Information and Hours
      </p>
      <p class="text-gray-700 text-sm">
        <strong>Phone Number:</strong> {phoneNumber}
      </p>
      <p class="text-gray-700 text-sm">
        <strong>Hours:</strong> 
      </p>
    </div>
    {/if}
    <hr class="my-4 border-gray-300"> <!-- Line -->
    
    <!-- Details -->
    <div>
      <p class="text-[#9044C4] font-semibold flex items-center gap-2">
        📝 Details
      </p>
      <p class="text-gray-700 text-sm">
        <strong>Available Beds:</strong> {availableBeds ?? "N/A"}
      </p>
      <p class="text-gray-700 text-sm">
        <!-- <strong>Base Rate:</strong> Php {baseRate}  -->
      </p>
      <p class="text-gray-700 text-sm">
        <!-- <strong>Maximum Coverage Radius:</strong> {maxCoverageRadius} -->
      </p>
      <p class="text-gray-700 text-sm">
        <!-- <strong>Mileage Rate:</strong> Php {mileageRate}  -->
      </p>
    </div>

    <hr class="mt-4 border-gray-300">
    <p class="mt-2 text-gray-500 text-sm"><em>Last Updated:</em> {updatedAt ?? "N/A"}</p>  
  </div>
  <!-- View Facility Page Button -->
  {#if data.fromSearch}
  <div class="flex justify-center pb-10 pt-5 bg-gradient-to-b from-[#BCB6BC]/0 via-[#FDFCFD]/80 to-[#FDFCFD]">
    <a href={"/facilityInfo/"+(data.facilityID ?? '')} 
      class="block text-center text-[#9044C4] border-2 border-[#9044C4] px-6 py-3 rounded-full font-semibold hover:bg-[#9044C4] hover:text-white transition">
      View Facility Page →
    </a>
  </div>
  {/if}
</div>