<script lang="ts">
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();

  let facilityName       = $state(data.facilityName);
  let facilityAddress    = $state(data.facilityAddress);
  let phoneNumber       = $state(data.phoneNumber);
  let openingTime       = $state(data.openingTime);
  let closingTime       = $state(data.closingTime);
  let pricePerUnit      = $state(data.pricePerUnit);
  let turnaroundTimeD   = $state(data.turnaroundTimeD);
  let turnaroundTimeH   = $state(data.turnaroundTimeH);
  let bloodTypeAvailability = $state(data.bloodTypeAvailability);
</script>

<div class="mt-4 border p-4 rounded-lg shadow-md bg-white">
  <h1 class="text-xl font-bold mb-4">Blood Bank Service Details</h1>

  <p><strong>Facility Name:</strong> {facilityName}</p>
  <p><strong>Address:</strong> {facilityAddress ? 
    `${facilityAddress.street}, ${facilityAddress.barangay}, ${facilityAddress.city}, ${facilityAddress.province}, ${facilityAddress.region}` 
    : "Address not available"}
  </p>
  <p><strong>Phone:</strong> {phoneNumber ?? "N/A"}</p>
  <p><strong>Opening Time:</strong> {openingTime ?? "N/A"}</p>
  <p><strong>Closing Time:</strong> {closingTime ?? "N/A"}</p>
  <p><strong>Price per Unit:</strong> {pricePerUnit ?? "N/A"}</p>
  <p><strong>Turnaround Time:</strong> {turnaroundTimeD} days, {turnaroundTimeH} hours</p>

  <h3 class="mt-4 font-semibold">Blood Type Availability</h3>
  {#if bloodTypeAvailability}
    <ul class="list-disc ml-5">
      <li><strong>A+:</strong> {bloodTypeAvailability.A_P ? "Available" : "Unavailable"}</li>
      <li><strong>A-:</strong> {bloodTypeAvailability.A_N ? "Available" : "Unavailable"}</li>
      <li><strong>B+:</strong> {bloodTypeAvailability.B_P ? "Available" : "Unavailable"}</li>
      <li><strong>B-:</strong> {bloodTypeAvailability.B_N ? "Available" : "Unavailable"}</li>
      <li><strong>O+:</strong> {bloodTypeAvailability.O_P ? "Available" : "Unavailable"}</li>
      <li><strong>O-:</strong> {bloodTypeAvailability.O_N ? "Available" : "Unavailable"}</li>
      <li><strong>AB+:</strong> {bloodTypeAvailability.AB_P ? "Available" : "Unavailable"}</li>
      <li><strong>AB-:</strong> {bloodTypeAvailability.AB_N ? "Available" : "Unavailable"}</li>
    </ul>
  {:else}
    <p class="text-gray-500">Blood type availability information is not available.</p>
  {/if}
</div>
