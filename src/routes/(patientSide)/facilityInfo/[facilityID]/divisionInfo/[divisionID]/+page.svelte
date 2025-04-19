<script lang="ts">
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();

  let phoneNumber = $state(data.phoneNumber);
  let divisionName = $state(data.divisionName);
  let email = $state(data.email);
  let openTime = $state(data.openTime ?? '');
  let closingTime = $state(data.closeTime ?? '');
  let hasServices = $state(data.hasServices);
  let services = $state(data.services ?? []);
</script>

<div class="max-w-md mx-auto bg-[#FDFCFD] shadow-lg ">
  <!-- Header Facility Name -->
  <div class=" bg-gray-100 p-5 border-b border-gray-300 flex justify-between items-center">
    <button class="text-gray-600 hover:text-gray-900">✖</button>
    <h2 class="text-xl font-bold text-center flex-1 -ml-4"><strong>{divisionName}</strong></h2>
  </div>

  <!-- Service and Info!!!-->
  <div class="p-5 max-h-[calc(100vh-100px)] overflow-y-auto">
    <!-- Contact Information -->
    <div>
      <p class="text-[#9044C4] font-semibold flex items-center gap-2">
        ☎ Contact Information and Hours
      </p>
      <p class="text-gray-700 text-sm">
        <strong>Phone Number:</strong> {phoneNumber}
      </p>
      <p class="text-gray-700 text-sm">
        <strong>Email:</strong> {email}
      </p>
      <p class="text-gray-700 text-sm">
        <strong>Hours:</strong> {openTime} - {closingTime}
      </p>
    </div>

    <hr class="my-4 border-gray-300">
    <!-- Details -->
    <div>
      <p class="text-[#9044C4] font-semibold flex items-center gap-2">
        📝 Details
      </p>
      <p class="text-gray-700 text-sm">
        <strong>Minimum Coverage Radius:</strong> 
      </p>
      <p class="text-gray-700 text-sm">
        <strong>Base Rate:</strong> Php 
      </p>
      <p class="text-gray-700 text-sm">
        <strong>Maximum Coverage Radius:</strong> 
      </p>
      <p class="text-gray-700 text-sm">
        <strong>Mileage Rate:</strong> Php 
      </p>
    </div>
    <hr class="my-4 border-gray-300">

    <div>
      <p class="text-[#9044C4] text-center font-semibold flex items-center gap-2">
        Services Offered
      </p>
      {#if hasServices}
        <ul>
          {#each services as service}
            <li class="text-sm">{service.type}</li>
          {/each}
        </ul>
      {/if}

    </div>
  </div>
</div>

