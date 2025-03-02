<script lang="ts">
  import PatientSearch from '$lib/PatientSearch.svelte'
  import PatientHeader from '$lib/PatientHeader.svelte'

  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<PatientHeader guest={false} id={Number(data.id)} />

<PatientSearch guest={false} />