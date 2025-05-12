<script lang="ts">
  import type { PageProps } from './$types';

  import { dateToTimeMapping } from '$lib';

  let { data }: PageProps = $props();

  let name = data.name;
  let openingTime = data.openingTime;
  let closingTime = data.closingTime;
  let email = data.email;
  let phoneNumber = data.phoneNumber;
  let services = data.services;

  const mappedOpeningTime = dateToTimeMapping(openingTime);
  const mappedClosingTime = dateToTimeMapping(closingTime);
</script>