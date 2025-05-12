<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  let phoneNumber           = data.phoneNumber;
  let openingTime           = data.openingTime;
  let closingTime           = data.closingTime;
  let basePricePerUnit      = data.availability;
  let turnaroundTimeD       = data.baseRate;
  let turnaroundTimeH       = data.minCoverageRadius;
  let bloodTypeAvailability = data.mileageRate;
  let note                  = data.note;
  let divisionName          = data.divisionName;

  let facilityID   = data.facilityID;
  let fromSearch   = data.fromSearch;
  let facilityName = data.address;
  let address      = data.address;
  let phoneSource  = data.phoneSource;
  let hoursSource  = data.hoursSource;

  let updatedAt    = data.updatedAt;

  let service = "Blood Bank";
</script>