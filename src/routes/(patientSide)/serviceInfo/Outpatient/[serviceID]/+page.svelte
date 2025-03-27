<script lang="ts">
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();

  let facilityName        = $state(data.facilityName);
  let facilityAddress     = $state(data.facilityAddress);
  let price              = $state(data.price);
  let completionTimeD     = $state(data.completionTimeD);
  let completionTimeH     = $state(data.completionTimeH);
  let isAvailable         = $state(data.isAvailable);
  let acceptsWalkIns      = $state(data.acceptsWalkIns);
  let divisionID          = $state(data.divisionID);
</script>

<div class="mt-4 p-4 border rounded shadow-lg bg-white">
  <h2 class="text-xl font-bold mb-4">Outpatient Service Details</h2>
  <p><strong>Facility Name:</strong> {facilityName}</p>
  <p><strong>Address:</strong> {facilityAddress}</p>
  <p><strong>Price:</strong> {price}</p>
  <p><strong>Completion Time:</strong> {completionTimeD} days, {completionTimeH} hours</p>
  <p><strong>Available:</strong> <span class={isAvailable ? 'text-green-600' : 'text-red-600'}>{isAvailable ? "Yes" : "No"}</span></p>
  <p><strong>Accepts Walk-Ins:</strong> <span class={acceptsWalkIns ? 'text-green-600' : 'text-red-600'}>{acceptsWalkIns ? "Yes" : "No"}</span></p>
  {#if divisionID}
    <p><strong>Division ID:</strong> {divisionID}</p>
  {/if}
</div>
