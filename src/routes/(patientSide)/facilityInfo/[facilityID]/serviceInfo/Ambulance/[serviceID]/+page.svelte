<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  let phoneNumber       = data.phoneNumber;
  let openingTime       = data.openingTime;
  let closingTime       = data.closingTime;
  let availability      = data.availability;
  let baseRate          = data.baseRate;
  let minCoverageRadius = data.minCoverageRadius;
  let mileageRate       = data.mileageRate;
  let maxCoverageRadius = data.maxCoverageRadius;
  let note              = data.note;
  let divisionName      = data.divisionName;

  let facilityID   = data.facilityID;
  let fromSearch   = data.fromSearch;
  let facilityName = data.address;
  let address      = data.address;
  let phoneSource  = data.phoneSource;
  let hoursSource  = data.hoursSource;

  let updatedAt    = data.updatedAt;

  let service = "Ambulance";
</script>