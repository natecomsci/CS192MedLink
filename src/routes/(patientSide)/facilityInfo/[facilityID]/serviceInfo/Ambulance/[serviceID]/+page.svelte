<script lang="ts">
  import type { PageProps } from './$types';

  import { Availability } from '@prisma/client';

  import { moneyMapping, updatedAtMapping } from '$lib/mappings';

  import Header from '$lib/patientComponents/Header.svelte';
  import InfoRow from '$lib/patientComponents/details/InfoRow.svelte';
  import Location from '$lib/patientComponents/details/Location.svelte';
  import ResultPhoneAndHours from '$lib/patientComponents/details/ResultPhoneAndHours.svelte';
  import PagePhoneAndHours from '$lib/patientComponents/details/PagePhoneAndHours.svelte';
  import AvailabilityIndicator from '$lib/patientComponents/details/AvailabilityIndicator.svelte';
  import ServiceRadius from '$lib/icons/ServiceRadius.svelte';
  import ServicePeso from '$lib/icons/ServicePeso.svelte';
  import NavigateButton from '$lib/patientComponents/NavigateButton.svelte';

  import type { Status1 } from '$lib';

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
  let facilityName = data.facilityName;
  let {region, pOrC, cOrM, brgy, street } = data.address;
  let phoneSource  = data.phoneSource;
  let hoursSource  = data.hoursSource;

  let updatedAt    = data.updatedAt;

  let service = "Ambulance";

  let mappedUpdatedAt = $state(updatedAtMapping(updatedAt));

	$effect(() => {
		const interval = setInterval(() => {
			mappedUpdatedAt = updatedAtMapping(updatedAt);
		}, 60 * 1000);
		return () => {
			clearInterval(interval);
		};
	});

  const availabilityMapping: { key: Availability; label: Status1 }[] = [
    { key: Availability.AVAILABLE, label: 'available' },
    { key: Availability.SHORT_DELAY, label: 'short delay' },
    { key: Availability.MODERATE_DELAY, label: 'moderate delay' },
    { key: Availability.EXTENDED_DELAY, label: 'extended delay' },
    { key: Availability.UNAVAILABLE, label: 'unavailable' },
  ]
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

  <AvailabilityIndicator status={availabilityMapping.find(item => item.key === availability)?.label ?? 'unavailable' as Status1} />

  <hr class="self-stretch h-px border-neutral-200" />

  {#if fromSearch}
    <Location {region} {pOrC} {cOrM} {brgy} {street}/>

    <hr class="self-stretch h-px border-neutral-200" />

    <ResultPhoneAndHours phone={phoneNumber} {openingTime} {closingTime} {phoneSource} {hoursSource} />

    <hr class="self-stretch h-px border-neutral-200" />
  {:else}
    <PagePhoneAndHours phone={phoneNumber} {openingTime} {closingTime} />

    <hr class="self-stretch h-px border-neutral-200" />
  {/if}

  <div class="flex flex-col items-start gap-2 self-stretch">
    <p class="text-primary-500 text-sm font-bold tracking-tight leading-tight">
      Details
    </p>

    <InfoRow
      icon={ServiceRadius}
      label="Minimum Coverage Radius"
      value={minCoverageRadius}
    />

    <InfoRow
      icon={ServicePeso}
      label="Base Rate"
      value={moneyMapping(baseRate)}
    />

    <InfoRow
      icon={ServiceRadius}
      label="Minimum Coverage Radius"
      value={maxCoverageRadius}
    />

    <InfoRow
      icon={ServicePeso}
      label="Mileage Rate"
      value={moneyMapping(mileageRate)}
    />
  </div>

  <hr class="self-stretch h-px border-neutral-200" />

  {#if note}
    <div class="flex flex-col items-start gap-2 self-stretch">
      <p class="text-primary-500 text-sm font-bold tracking-tight leading-tight">
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