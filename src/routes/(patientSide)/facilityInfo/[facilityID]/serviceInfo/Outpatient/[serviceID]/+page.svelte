<script lang="ts">
  import type { PageProps } from './$types';

  import { Availability } from '@prisma/client';

	import { completionTimeMapping, moneyMapping, updatedAtMapping } from '$lib/mappings';

  import Header from '$lib/patientComponents/Header.svelte';
  import InfoRow from '$lib/patientComponents/details/InfoRow.svelte';
  import Location from '$lib/patientComponents/details/Location.svelte';
  import ResultPhoneAndHours from '$lib/patientComponents/details/ResultPhoneAndHours.svelte';
  import PagePhoneAndHours from '$lib/patientComponents/details/PagePhoneAndHours.svelte';
  import AvailabilityIndicator from '$lib/patientComponents/details/AvailabilityIndicator.svelte';
  import ServiceWalk from '$lib/icons/ServiceWalk.svelte';
  import Clock from '$lib/icons/Clock.svelte';
  import ServicePeso from '$lib/icons/ServicePeso.svelte';
  import NavigateButton from '$lib/patientComponents/NavigateButton.svelte';

  import type { Status1 } from '$lib';

  let { data }: PageProps = $props();

  let basePrice       = data.basePrice;
  let completionTimeD = data.completionTimeD;
  let completionTimeH = data.completionTimeH;
  let isAvailable     = data.isAvailable;
  let acceptsWalkIns  = data.acceptsWalkIns;
  let note            = data.note;
  let divisionName    = data.divisionName;

  let phoneNumber  = data.phoneNumber;
  let openingTime  = data.openingTime;
  let closingTime  = data.closingTime;

  let facilityID   = data.facilityID;
  let fromSearch   = data.fromSearch;
  let facilityName = data.facilityName;
  let {region, pOrC, cOrM, brgy, street } = data.address;
  let phoneSource  = data.phoneSource;
  let hoursSource  = data.hoursSource;

  let updatedAt    = data.updatedAt;

  let service = data.type;

  const completionTime  = completionTimeMapping(completionTimeD, completionTimeH);

  let mappedUpdatedAt = $state(updatedAtMapping(updatedAt));

	$effect(() => {
		const interval = setInterval(() => {
			mappedUpdatedAt = updatedAtMapping(updatedAt);
		}, 60 * 1000);
		return () => {
			clearInterval(interval);
		};
	});
</script>

{#if fromSearch}
  <Header text={facilityName} icon="X" />
{:else}
  <Header text={service} icon="Arrow" />
{/if}

<div class="flex items-center justify-center flex-col gap-4 w-full px-6 pt-6 pb-14">
  {#if fromSearch}
    <p class="text-primary-700 text-base font-bold tracking-tight leading-loose font-['Inter'] text-center">
      {service}
    </p>

    <hr class="self-stretch h-px border-neutral-200" />
  {:else if divisionName}
    <p class="text-primary-700 text-base font-bold tracking-tight leading-loose font-['Inter'] text-center">
      {divisionName}
    </p>

    <hr class="self-stretch h-px border-neutral-200" />
  {/if}

  <p class="text-primary-500 text-sm font-bold tracking-tight leading-tight font-['Inter'] text-center">
    Availability Status
  </p>

  <AvailabilityIndicator status={isAvailable ? 'available' as Status1 : 'unavailable' as Status1} />

  <hr class="self-stretch h-px border-neutral-200" />

  {#if fromSearch}
    <Location {region} {pOrC} {cOrM} {brgy} {street}/>

    <hr class="self-stretch h-px border-neutral-200" />

    <ResultPhoneAndHours phone={phoneNumber} {openingTime} {closingTime} {phoneSource} {hoursSource} />

    <hr class="self-stretch h-px border-neutral-200" />
  {/if}

  <div class="flex flex-col items-start gap-2 self-stretch">
    <p class="text-primary-500 text-sm font-bold tracking-tight leading-tight font-['Inter']">
      Details
    </p>

    <InfoRow
      icon={ServiceWalk}
      label="Walk-ins"
      value={acceptsWalkIns ? "<b>Accepted</b>" : "<b>Not Accepted</b>"}
      valueColor={acceptsWalkIns ? "text-success-on" : "text-error-on"}
    />

    <InfoRow
      icon={Clock}
      label="Completion Time"
      value={completionTime}
    />

    <InfoRow
      icon={ServicePeso}
      label="Base Price"
      value={moneyMapping(basePrice)}
    />
  </div>

  <hr class="self-stretch h-px border-neutral-200" />

  {#if note}
    <div class="flex flex-col items-start gap-2 self-stretch">
      <p class="text-primary-500 text-sm font-bold tracking-tight leading-tight font-['Inter']">
        Note
      </p>

      <p class="text-neutral-950 text-xs font-normal tracking-tight leading-loose font-['Inter']">
        {note}
      </p>
    </div>

    <hr class="self-stretch h-px border-neutral-200" />
  {/if}

  <p class="self-stretch justify-center text-neutral-600 text-[10px] font-normal font-['Inter'] tracking-tight leading-none text-right">
    Updated {mappedUpdatedAt}
  </p>

  {#if fromSearch}
    <div class="flex justify-center mt-6">
      <NavigateButton text="View Facility Page" href={`/facilityInfo/${facilityID}`} />
    </div>
  {/if}
</div>