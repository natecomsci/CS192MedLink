<script lang="ts">
  import type { PageProps } from './$types';

  import type { BloodTypeMappingDTO } from '$lib';

	import { completionTimeMapping, moneyMapping, updatedAtMapping } from '$lib/mappings';

  import Header from '$lib/patientComponents/Header.svelte';
  import InfoRow from '$lib/patientComponents/details/InfoRow.svelte';
  import Location from '$lib/patientComponents/details/Location.svelte';
  import ResultPhoneAndHours from '$lib/patientComponents/details/ResultPhoneAndHours.svelte';
  import PagePhoneAndHours from '$lib/patientComponents/details/PagePhoneAndHours.svelte';
	import ValueC from '$lib/icons/ValueC.svelte';
	import ValueX from '$lib/icons/ValueX.svelte';
  import Clock from '$lib/icons/Clock.svelte';
  import ServicePeso from '$lib/icons/ServicePeso.svelte';
  import NavigateButton from '$lib/patientComponents/NavigateButton.svelte';

  let { data }: PageProps = $props();

  let phoneNumber           = data.phoneNumber;
  let openingTime           = data.openingTime;
  let closingTime           = data.closingTime;
  let basePricePerUnit      = data.basePricePerUnit;
  let turnaroundTimeD       = data.turnaroundTimeD;
  let turnaroundTimeH       = data.turnaroundTimeH;
  let bloodTypeAvailability = data.bloodTypeAvailability;
  let note                  = data.note;
  let divisionName          = data.divisionName;

  let facilityID   = data.facilityID;
  let fromSearch   = data.fromSearch;
  let facilityName = data.facilityName;
  let {region, pOrC, cOrM, brgy, street } = data.address;
  let phoneSource  = data.phoneSource;
  let hoursSource  = data.hoursSource;

  let updatedAt    = data.updatedAt;

  let service = "Blood Bank";

  const mappedTurnaroundTime: string = completionTimeMapping(turnaroundTimeD, turnaroundTimeH);

  let mappedUpdatedAt = $state(updatedAtMapping(updatedAt));

	$effect(() => {
		const interval = setInterval(() => {
			mappedUpdatedAt = updatedAtMapping(updatedAt);
		}, 60 * 1000);
		return () => {
			clearInterval(interval);
		};
	});

	const rows = [
		{ key: 'A_P', label: 'A+' },
		{ key: 'A_N', label: 'A-' },
		{ key: 'B_P', label: 'B+' },
		{ key: 'B_N', label: 'B-' },
		{ key: 'O_P', label: 'O+' },
		{ key: 'O_N', label: 'O-' },
		{ key: 'AB_P', label: 'AB+' },
		{ key: 'AB_N', label: 'AB-' },
	];
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
    Blood Type Availability Status
  </p>

  <div class="border-primary-400 flex w-48 flex-col overflow-hidden rounded-lg border">
    <!-- Header -->
    <div
      class="bg-primary-100 border-primary-300 flex border-b text-center font-['Inter'] text-xs leading-none font-bold text-neutral-950"
    >
      <div class="border-primary-300 flex-1 border-r px-3 py-2">Blood Type</div>
      
      <div class="border-primary-300 flex-1 border-l px-3 py-2">Availability</div>
    </div>

    <!-- Rows -->
    {#each rows as { key, label }, i}
      <div class="flex {i % 2 === 0 ? 'bg-primary-50' : 'bg-neutral-50'}">
        <!-- Left Column -->
        <div
          class="border-primary-300 flex flex-1 items-center justify-center border-r px-3 py-2 font-['Inter'] text-xs font-bold text-neutral-950"
        >
          {label}
        </div>

        <!-- Right Column -->
        <div class="border-primary-300 flex flex-1 items-center justify-center border-l px-3 py-2">
          {#if bloodTypeAvailability[key as keyof BloodTypeMappingDTO]}
            <div
              class="text-success-on flex items-center gap-2 font-['Inter'] text-xs leading-relaxed font-bold"
            >
              <ValueC
                class="text-success-on hover:text-success-on-t active:text-success-on-t h-4 w-4 shrink-0 transition-colors duration-300"
              />
              <p class="text-success-on text-left">Yes</p>
            </div>
          {:else}
            <div
              class="text-error-on flex items-center gap-2 font-['Inter'] text-xs leading-relaxed font-bold"
            >
              <ValueX
                class="text-error-on hover:text-error-on-t active:text-error-on-t h-4 w-4 shrink-0 transition-colors duration-300"
              />
              <p class="text-error-on text-left">No</p>
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>

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
    <p class="text-primary-500 text-sm font-bold tracking-tight leading-tight font-['Inter']">
      Details
    </p>

    <InfoRow
      icon={Clock}
      label="Turnaround Time"
      value={mappedTurnaroundTime}
    />

    <InfoRow
      icon={ServicePeso}
      label="Base Price Per Unit"
      value={moneyMapping(basePricePerUnit)}
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