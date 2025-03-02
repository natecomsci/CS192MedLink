<script lang="ts">
  import PatientSearch from '../../PatientSearch.svelte'
  import PatientHeader from '../../PatientHeader.svelte'

  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<PatientHeader guest={false} id={Number(data.id)} />

<PatientSearch guest={false} />