<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  let phoneNumber         = data.phoneNumber;
  let openingTime         = data.openingTime;
  let closingTime         = data.closingTime;
  let load                = data.load;
  let baseRate            = data.baseRate;
  let availableBeds       = data.availableBeds;
  let cardiacSupport      = data.cardiacSupport;
  let neurologicalSupport = data.neurologicalSupport;
  let renalSupport        = data.renalSupport;
  let respiratorySupport  = data.respiratorySupport;
  let note                = data.note;
  let divisionName        = data.divisionName;

  let facilityID   = data.facilityID;
  let fromSearch   = data.fromSearch;
  let facilityName = data.address;
  let address      = data.address;
  let phoneSource  = data.phoneSource;
  let hoursSource  = data.hoursSource;

  let updatedAt    = data.updatedAt;

  let service = "Intensive Care Unit";
</script>