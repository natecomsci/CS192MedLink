<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  let phoneNumber          = data.phoneNumber;
  let openingTime          = data.openingTime;
  let closingTime          = data.closingTime;
  let load                 = data.load;
  let availableBeds        = data.availableBeds;
  let nonUrgentPatients    = data.nonUrgentPatients;
  let nonUrgentQueueLength = data.nonUrgentQueueLength;
  let urgentPatients       = data.urgentPatients;
  let urgentQueueLength    = data.urgentQueueLength;
  let criticalPatients     = data.criticalPatients;
  let criticalQueueLength  = data.criticalQueueLength;
  let note                 = data.note;
  let divisionName         = data.divisionName;

  let facilityID   = data.facilityID;
  let fromSearch   = data.fromSearch;
  let facilityName = data.address;
  let address      = data.address;
  let phoneSource  = data.phoneSource;
  let hoursSource  = data.hoursSource;

  let updatedAt    = data.updatedAt;

  let service = "Emergency Room";
</script>

