<script lang="ts">
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();

  let facilityName        = $state(data.facilityName);
  let facilityAddress     = $state(data.facilityAddress);
  let phoneNumber         = $state(data.phoneNumber);
  let baseRate            = $state(data.baseRate);
  let load                = $state(data.load);
  let availableBeds       = $state(data.availableBeds);
  let cardiacSupport      = $state(data.cardiacSupport);
  let neurologicalSupport = $state(data.neurologicalSupport);
  let renalSupport        = $state(data.renalSupport);
  let respiratorySupport  = $state(data.respiratorySupport);
  let updatedAt           = $state(data.updatedAt);

  let formattedAddress = facilityAddress
    ? `${facilityAddress.street}, ${facilityAddress.barangay}, ${facilityAddress.city}, ${facilityAddress.province}, ${facilityAddress.region}`
    : "Unknown Address";
</script>

<div class="mt-4 p-4 border rounded shadow-lg bg-white">
  <h2 class="text-xl font-bold mb-4">ICU Service Details</h2>
  <p><strong>Facility Name:</strong> {facilityName}</p>
  <p><strong>Address:</strong> {formattedAddress}</p>
  <p><strong>Phone:</strong> {phoneNumber}</p>
  <p><strong>Base Rate:</strong> {baseRate}</p>
  <p><strong>Load:</strong> {load}</p>
  <p><strong>Available Beds:</strong> {availableBeds}</p>
  <p><strong>Cardiac Support:</strong> <span class={cardiacSupport ? 'text-green-600' : 'text-red-600'}>{cardiacSupport ? "Yes" : "No"}</span></p>
  <p><strong>Neurological Support:</strong> <span class={neurologicalSupport ? 'text-green-600' : 'text-red-600'}>{neurologicalSupport ? "Yes" : "No"}</span></p>
  <p><strong>Renal Support:</strong> <span class={renalSupport ? 'text-green-600' : 'text-red-600'}>{renalSupport ? "Yes" : "No"}</span></p>
  <p><strong>Respiratory Support:</strong> <span class={respiratorySupport ? 'text-green-600' : 'text-red-600'}>{respiratorySupport ? "Yes" : "No"}</span></p>
  <p><strong>Last Updated:</strong> {updatedAt}</p>
</div>