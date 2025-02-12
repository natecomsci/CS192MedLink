<script lang="ts">
  import Search from '$lib/Search.svelte'
  import Header from '$lib/Header.svelte'

  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<Header guest={false} id={data.id} />

<Search guest={false} />