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
</script>

<div class="mt-4">
  <h2 class="text-xl font-semibold">Emergency Service Details</h2>
  <p><strong>Facility Name:</strong> {facilityName}</p>
  <p><strong>Address:</strong> 
    {facilityAddress ? 
      `${facilityAddress.street}, ${facilityAddress.barangay}, ${facilityAddress.city}, ${facilityAddress.province}, ${facilityAddress.region}` 
      : "Address not available"}
  </p>
  <p><strong>Phone:</strong> {phoneNumber ?? "N/A"}</p>
  <p><strong>Current Load:</strong> {load ?? "N/A"}</p>
  <p><strong>Available Beds:</strong> {availableBeds ?? "N/A"}</p>
  
  <h3 class="mt-2 font-semibold">Patient Statistics</h3>
  <p><strong>Non-Urgent Patients:</strong> {nonUrgentPatients ?? "N/A"}</p>
  <p><strong>Non-Urgent Queue Length:</strong> {nonUrgentQueueLength ?? "N/A"}</p>
  <p><strong>Urgent Patients:</strong> {urgentPatients ?? "N/A"}</p>
  <p><strong>Urgent Queue Length:</strong> {urgentQueueLength ?? "N/A"}</p>
  <p><strong>Critical Patients:</strong> {criticalPatients ?? "N/A"}</p>
  <p><strong>Critical Queue Length:</strong> {criticalQueueLength ?? "N/A"}</p>

  <p class="mt-2 text-gray-500 text-sm"><em>Last Updated:</em> {updatedAt ?? "N/A"}</p>
</div>
