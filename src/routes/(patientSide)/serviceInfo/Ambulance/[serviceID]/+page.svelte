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
</script>

<div class="mt-4">
  <p><strong>Facility Name:</strong> {facilityName}</p>
  <p><strong>Address:</strong> {facilityAddress ? `${facilityAddress.street}, ${facilityAddress.barangay}, ${facilityAddress.city}, ${facilityAddress.province}, ${facilityAddress.region}` : "Address not available"}</p>
  <p><strong>Phone:</strong> {phoneNumber}</p>
  <p><strong>Opening Time:</strong> {openingTime}</p>
  <p><strong>Closing Time:</strong> {closingTime}</p>
  <p><strong>Base Rate:</strong> {baseRate}</p>
  <p><strong>Minimum Coverage Radius:</strong> {minCoverageRadius} km</p>
  <p><strong>Mileage Rate:</strong> {mileageRate}</p>
  <p><strong>Maximum Coverage Radius:</strong> {maxCoverageRadius} km</p>
  <p><strong>Availability:</strong> {availability ? "Available" : "Unavailable"}</p>
</div>
