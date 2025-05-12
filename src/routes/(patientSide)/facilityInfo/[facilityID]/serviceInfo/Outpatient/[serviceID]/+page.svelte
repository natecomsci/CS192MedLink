<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  let basePrice       = data.basePrice;
  let completionTimeD = data.completionTimeD;
  let completionTimeH = data.completionTimeH;
  let isAvailable     = data.isAvailable;
  let acceptsWalkIns  = data.acceptsWalkIns;

  let facilityID   = data.facilityID;
  let fromSearch   = data.fromSearch;
  let facilityName = data.address;
  let address      = data.address;
  let phoneSource  = data.phoneSource;
  let hoursSource  = data.hoursSource;

  let updatedAt    = data.updatedAt;

  let service = data.type;
</script>