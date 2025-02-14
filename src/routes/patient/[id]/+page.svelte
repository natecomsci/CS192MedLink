<script lang="ts">
  import Search from '$lib/Search.svelte'
  import PatientHeader from '$lib/PatientHeader.svelte'

  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<PatientHeader guest={false} id={data.id} />

<Search guest={false} />