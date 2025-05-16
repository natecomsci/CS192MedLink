<script lang="ts">
  import type { PageProps } from './$types';

  import { normalizePhoneNumberForSMS } from '$lib/patientComponents/details/detailsUtility';

  import { dateToTimeMapping, type ServiceDTO } from '$lib';

  import Header from '$lib/patientComponents/Header.svelte';
  import InfoRow from '$lib/patientComponents/details/InfoRow.svelte';
  import Accordion from '$lib/patientComponents/Accordion.svelte';
	import ServiceStethoscope from '$lib/icons/ServiceStethoscope.svelte';
	import Phone from '$lib/icons/Phone.svelte';
	import Email from '$lib/icons/Email.svelte';
	import Clock from '$lib/icons/Clock.svelte';

  let { data }: PageProps = $props();

  let name = data.name;
  let openingTime = data.openingTime;
  let closingTime = data.closingTime;
  let email = data.email;
  let phoneNumber = data.phoneNumber;
  let services: ServiceDTO[] = data.services;

  const mappedOpeningTime = dateToTimeMapping(openingTime);
  const mappedClosingTime = dateToTimeMapping(closingTime);
</script>

{#snippet divisionServices()}
	{#each services as service}
		<div class={`${services.length > 1 ? "mb-2" : ""}`}>
      <InfoRow
        icon={ServiceStethoscope}
        value={service.type}
      />
    </div>
  {/each}
{/snippet}

<Header text={name} icon="X" />

<div class="flex items-center justify-center flex-col gap-4 w-full px-6 pt-6 pb-14">
  <div class="w-full">
    <Accordion text="Services" content={divisionServices}/>
  </div>

  <div class="flex flex-col items-start gap-2 self-stretch">
    <p class="text-primary-500 text-sm font-bold tracking-tight leading-tight">
      Contact Information and Hours
    </p>

    <InfoRow
      icon={Phone}
      label="Phone Number"
      value={phoneNumber}
      isLink={true}
      href={`sms:${normalizePhoneNumberForSMS(phoneNumber)}`}
    />

    {#if email}
      <InfoRow
        icon={Email}
        label="Email Address"
        value={email}
        isLink={true}
        href={`mailto:${email}`}
      />
    {/if}

    <InfoRow
      icon={Clock}
      label="Hours"
      value={`${mappedOpeningTime} - ${mappedClosingTime}`}
    />
  </div>
</div>