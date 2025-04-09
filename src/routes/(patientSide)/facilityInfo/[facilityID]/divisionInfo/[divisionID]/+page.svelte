<script lang="ts">
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();

  let phoneNumber = $state(data.phoneNumber);
  let divisionName = $state(data.divisionName);
  let email = $state(data.email);
  let openTime = $state(data.openTime);
  let closingTime = $state(data.closeTime);
  let hasServices = $state(data.hasServices);
  let services = $state(data.services);

  const formatTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleTimeString('en-PH', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };
</script>

<h1>{divisionName}</h1>

<h2>Division Information</h2>

<p><strong>Phone Number:</strong> {phoneNumber}</p>
<p><strong>Email Address:</strong> {email}</p>
<p><strong>Hours:</strong> {formatTime(openTime)} - {formatTime(closingTime)}</p>

{#if hasServices}
  <h3>Services Offered</h3>
  <ul>
    {#each services as service}
      <li>{service.type}</li>
    {/each}
  </ul>
{/if}
