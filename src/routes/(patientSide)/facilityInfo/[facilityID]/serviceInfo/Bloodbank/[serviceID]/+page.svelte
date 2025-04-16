<script lang="ts">
  let { data } = $props();

  let facilityName       = $state(data.facilityName);
  let facilityAddress    = $state(data.facilityAddress);
  let phoneNumber       = $state(data.phoneNumber);
  let openingTime       = $state(data.openingTime);
  let closingTime       = $state(data.closingTime);
  let pricePerUnit      = $state(data.pricePerUnit);
  let turnaroundTimeD   = $state(data.turnaroundTimeD);
  let turnaroundTimeH   = $state(data.turnaroundTimeH);
  let bloodTypeAvailability = $state(data.bloodTypeAvailability);

  let service = "Blood Bank Service Details"

  const bloodData = [
    { type: "A+", available: bloodTypeAvailability?.A_P },
    { type: "A-", available: bloodTypeAvailability?.A_N },
    { type: "B+", available: bloodTypeAvailability?.B_P },
    { type: "B-", available: bloodTypeAvailability?.B_N },
    { type: "O+", available: bloodTypeAvailability?.O_P },
    { type: "O-", available: bloodTypeAvailability?.O_N },
    { type: "AB+", available: bloodTypeAvailability?.AB_P },
    { type: "AB-", available: bloodTypeAvailability?.AB_N }
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

    <!-- Current Load Status -->

    <hr class="my-4 border-gray-300"> <!-- Line -->

    <!-- Table  -->
    <div class="max-w-md mx-auto my-4 ">
      <p class="text-[#9044C4] text-center font-semibold">Blood Type Availability Status</p>
      <table class="w-full border-collapse border border-purple-400 rounded-lg mt-2">
        <!-- Table Header -->
        <thead>
          <tr class="bg-purple-100">
            <th class="border-purple-400 border-2 px-4 py-2 text-center">Blood Type</th>
            <th class="border-purple-400 border-2  px-4 py-2 text-center">Availability</th>
          </tr>
        </thead>

        <!-- Table Body -->

        <tbody>
        {#each bloodData as row, i}
          <tr class={i % 2 === 0 ? "bg-white" : "bg-purple-50 border-purple-400"}>
            <td class="p-2 border-l border-r border-purple-400 text-center">{row.type}</td>
            <td class="p-2 border-purple-200">
              {#if row.available}
              <span class="text-green-500 font-bold flex items-center justify-center gap-2">
                ✔ Yes
              </span>              
              {:else}
              <span class="text-red-500 font-bold flex items-center justify-center gap-2">
                ✖ No
              </span>
              {/if}
            </td>
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
        <strong>Phone Number:</strong> {phoneNumber ?? "N/A"}
      </p>
      <p class="text-gray-700 text-sm">
        <strong>Hours:</strong> {openingTime ?? "N/A"} - {closingTime ?? "N/A"}
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
        <strong>Base Rate:</strong> Php {pricePerUnit ?? "N/A"}
      </p>
      <p class="text-gray-700 text-sm">
        <strong>Turnaround Time:</strong> {turnaroundTimeD} days, {turnaroundTimeH} hours
      </p>
    </div>

    <hr class="mt-4 border-gray-300">
    <!-- <p class="mt-2 text-gray-500 text-sm"><em>Last Updated:</em> {updatedAt ?? "N/A"}</p>   -->
  </div>
  
  {#if data.fromSearch}
  <!-- View Facility Page Button -->
  <div class="flex justify-center pb-10 pt-5 bg-gradient-to-b from-[#BCB6BC]/0 via-[#FDFCFD]/80 to-[#FDFCFD]">
    <a href={"/facilityInfo/"+(data.facilityID ?? '')} 
      class="block text-center text-[#9044C4] border-2 border-[#9044C4] px-6 py-3 rounded-full font-semibold hover:bg-[#9044C4] hover:text-white transition">
      View Facility Page →
    </a>
  </div>
  {/if}
</div>